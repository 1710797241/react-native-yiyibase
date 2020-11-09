import { NBUserID } from "../user";
import { CommunicationListModel, CommunicationHistoryListModel } from "./types";
export declare const getNBInstantUserList: (pageNo?: number, pageSize?: number) => Promise<Array<CommunicationListModel> | null>;
export declare const getNBInstantMsgList: (id: NBUserID, pageNo?: number, pageSize?: number) => Promise<Array<CommunicationHistoryListModel> | null>;
export declare const adapterNBCommunicationListModel: (sourceModel: CommunicationListModel) => CommunicationListModel;
export declare const adapterNBCommunicationHistoryModel: (sourceModel: CommunicationHistoryListModel) => CommunicationHistoryListModel;
