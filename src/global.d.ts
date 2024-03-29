import {HmisUserRecord, ServiceRecord} from 'types/RecordTypes';
import {IProviders} from 'utilities/getInitialState';

declare module 'reactn/default' {
    export interface State {
        errorDetails: unknown;
        providers: IProviders;
        serviceList: ServiceRecord[];
        hmisUsersList: HmisUserRecord[];
    }
}
