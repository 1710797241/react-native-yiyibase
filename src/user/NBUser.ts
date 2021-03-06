import AsyncStorage from '@react-native-community/async-storage';
import { NBUserModel, NBUserID, NBUserAll } from "./types";
import { createAxiosClient, HeaderManager, createNBNetworkApi, callApi } from '../network';
import Constants from '../Constants';
import { nbSQLiteCache } from '../cache';
import { ResponseModel, StatusCode, NBGateway } from "../api";
import { isEmptyObj, showError, nbLog } from '../util';
import NBBaseCxt from '../NBBaseCxt';

const tokenKey = "_nbuser_app_token";
const userKey = "_nbuser_app_user";

class NBUserMemCache {
    private _memCache: any = {};
    public currentUser?: NBUserModel;
    public token?: string

    public getMemUser(id: NBUserID): NBUserModel | undefined | null {
        return this._memCache[id];
    }

    public setMemUser(id: NBUserID, user: NBUserModel) {
        this._memCache[id] = user;
    }

    public isLogin(): boolean {
        return this.currentUser && !isEmptyObj(this.token);
    }
}

export const nbUserMemCache = new NBUserMemCache();

export const setNBUserAll = (user: NBUserAll): Promise<boolean> => {
    if (user && user.token) {
        nbUserMemCache.currentUser = user.user;
        nbUserMemCache.token = user.token;
        NBBaseCxt.nbUser = user;
        return Promise.all([
            HeaderManager.updateHeaders({
                token: user.token
            }),
            AsyncStorage.multiSet([[userKey, JSON.stringify(user.user)], [tokenKey, user.token || '']])
        ]).then(() => true)
    }
    return AsyncStorage.multiSet([[userKey, JSON.stringify(user.user)], [tokenKey, user.token || '']]).then(() => true)
}

export const getLastNBUserALL = (notConfirm?: boolean): Promise<NBUserAll | null> => {
    return getLastNBUserInfo().then(u => {
        if (u) {
            return getLastUserToken().then(token => {
                if (token !== undefined && token.length > 0) {
                    return HeaderManager.updateHeaders({
                        token
                    }).then(() => {
                        return {
                            user: u,
                            token
                        }
                    })
                }

                return null
            })
        }
        return null;
    }).then(u => {
        if (notConfirm !== undefined && notConfirm) {
            return u;
        }
        if (u !== null && u.token) {
            return callApi<NBUserModel>('/api/user/info/detail').then(uu => {
                if (uu) {
                    return setNBUserAll({
                        user: uu,
                        token: u.token
                    }).then(is => {
                        nbLog('用户模块', '口令换取档案成功：', uu, u)
                        return {
                            token: u.token,
                            user: {
                                ...u.user,
                                ...uu
                            }
                        }
                    }).catch(err => {
                        nbLog('用户模块', '重置本地缓存失败：', err);
                        return {
                            token: u.token,
                            user: {
                                ...u.user,
                                ...uu
                            }
                        }
                    })
                } else {
                    return saveLastNBUserInfo().then(() => saveLastUserToken()).then(is => {
                        return null;
                    }).catch(err => {
                        nbLog('用户模块', '重置本地缓存失败：', err);
                        return null;
                    })
                }
            }).catch(err => {
                showError('获取用户信息失败：' + (typeof err === 'string' ? err : (err.message ? err.message : JSON.stringify(err))));
                return u;
            })
        }
        return u;
    }).catch(err => {
        nbLog('用户模块', '获取本地用户信息失败', err)
        return null;
    })
}

export const getNBUserInfo = (id: NBUserID, url?: string): Promise<NBUserModel | null> => {
    const userKey = `_nb_user_${id}`;
    const user = nbUserMemCache.getMemUser(id);
    return user ? Promise.resolve(user) : nbSQLiteCache.readCache(userKey).then(v => {
        if (v && v.item) {
            return v.item
        }
        return NBGateway.getGateway().then(v => {
            if (Constants.isDebug) {
                console.log(`用户基础库 获取用户基础信息：${id}`)
            }
            return createAxiosClient('GET').then(axis => {
                return axis({
                    url: url === undefined ? `${Constants.BaseDomain}${v.gwUserInfo}?id=${id}` : `${url}?id=${id}`
                });
            }).then((r) => {
                if (r && r.data) {
                    let rsp: ResponseModel = r.data;
                    if (Constants.isDebug) {
                        console.log('用户基础库 用户基础信息', rsp.result);
                    }
                    if (rsp.status.code === StatusCode.SUCCESS) {
                        if (rsp.result) {
                            nbUserMemCache.setMemUser(id, rsp.result);
                            return nbSQLiteCache.saveCache(userKey, {
                                key: userKey,
                                item: rsp.result,
                                expire: 1000 * 60 * 60
                            }).then(() => rsp.result).catch(() => rsp.result);
                        }
                    }
                }
                return null;
            })
        })
    })
}

export const getLastNBUserInfo = (): Promise<NBUserModel | null> => {
    return AsyncStorage.getItem(userKey).then((s: string | null) => {
        if (s && s.length > 0) return JSON.parse(s);
        return null;
    });
}

export const saveLastNBUserInfo = (user?: NBUserModel): Promise<boolean> => {
    if (user === undefined) {
        return AsyncStorage.removeItem(userKey).then(() => true);
    }
    return AsyncStorage.setItem(userKey, JSON.stringify(user)).then(() => true);
}

export const saveLastUserToken = (token?: string): Promise<boolean> => {
    if (token === undefined) {
        return AsyncStorage.removeItem(tokenKey).then(() => Promise.resolve(true));
    }
    return AsyncStorage.setItem(tokenKey, token).then(() => Promise.resolve(true));
}

export const getLastUserToken = (): Promise<string | null> => {
    return AsyncStorage.getItem(tokenKey);
}

export const logoutNBUser = (): Promise<boolean> => {
    return Promise.all([
        saveLastNBUserInfo(),
        saveLastUserToken(),
        HeaderManager.updateHeaders({
            token: ''
        })
    ]).then(() => true)
}