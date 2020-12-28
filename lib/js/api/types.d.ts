import { DataModel } from "../models";
interface HeaderPros {
    'Content-Type'?: string;
    'Transfer-Encoding'?: string;
    'Content-Encoding'?: string;
    Vary?: string;
    Server?: string;
}
export declare const makeHeaders: (pros?: HeaderPros) => HeaderPros;
export declare const DefualtHeaders: {
    'Content-Type': string;
    'Transfer-Encoding': string;
    'Content-Encoding': string;
    Vary: string;
    Server: string;
};
export declare enum StatusCode {
    SUCCESS = 1,
    FAIL = 2,
    SYS_BUSY = 3,
    UNLOGIN = 4,
    PARAMINVALID = 5
}
export interface RequestParams {
    _headers?: any;
}
export interface Status {
    code: StatusCode;
    message: string | undefined | null;
}
export interface ResponseModel {
    status: Status;
    result?: any;
}
export interface PaginationDataModel<T extends DataModel> extends DataModel {
    total: number;
    all: number;
    data?: Array<T> | undefined | null;
}
export declare class CacheStorage<D> {
    save(req: RequestParams, data?: D | null): Promise<D>;
    read(req: RequestParams): Promise<D>;
}
export declare const postUploadFile: (api: string, files: any, headers?: any, retryLimit?: number) => Promise<any>;
export {};
