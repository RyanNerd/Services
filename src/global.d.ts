import {Authenticated} from 'providers/authenticationProvider';
import {ServiceListRecord} from 'types/RecordTypes';
import {IProviders} from 'utilities/getInitialState';

declare module 'reactn/default' {
    export interface State {
        errorDetails: unknown;
        providers: IProviders;
        signIn: Authenticated;
        serviceList: ServiceListRecord[];
    }
}
