
import { PermissionsAndroid, Platform } from "react-native";

const LocationPermissions = [
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
];

/**
 * 权限申请，主要是针对android
 * @param {权限数组} pms 
 */
export const requestPermissions = (pms = []) => {
    if (pms === undefined || pms === null || pms.length === 0) {
        return Promise.resolve(true);
    }

    if (Platform.OS === "android") {
        return PermissionsAndroid.requestMultiple(pms).then(grants => {
            if (!grants) return Promise.resolve(true);
            let granted = true;

            for(let name in grants) {
                let v = grants[name];
                
                if(v !== PermissionsAndroid.RESULTS.GRANTED) {
                    granted = false;
                    break;
                }
            }
            return Promise.resolve(granted);
        })
    }
    return Promise.resolve(true)
};

/**
 * 申请定位权限
 */
export const requestLocationPermissions = () => {
    return requestPermissions(LocationPermissions);
}

/**
 * 申请猎鹰轨迹及导航权限
 */
export const requestTrackPermissions = () => {
    return requestPermissions([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ])
}

export const checkPermission = p => {
    return Platform.select({
        android: PermissionsAndroid.check(p),
        ios: Promise.resolve(true)
    })
}

/**
 * 检测是否满足权限，主要是针对android
 * @param {检测权限} pms 
 */
export const checkPermisisons = (pms = []) => {

    if (pms === undefined || pms === null || pms.length === 0) {
        return Promise.resolve(true);
    }

    return Promise.all(pms.map(checkPermission)).then(rs => {
        logger.log(rs);
    });
}

/**
 * 检测是否具有定位权限
 */
export const checkLocationPermissions = () => {
    return checkPermisisons(LocationPermissions)
}