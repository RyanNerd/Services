import authenticationProvider, {IAuthenticationProvider} from 'providers/authenticationProvider';
import clientProvider, {IClientProvider} from 'providers/clientProvider';
import fileProvider, {IFileProvider} from 'providers/fileProvider';
import serviceLogProvider, {IServiceLogProvider} from 'providers/serviceLogProvider';
import serviceProvider, {IServiceProvider} from 'providers/serviceProvider';
import {State} from 'reactn/default';
import {ServiceRecord} from 'types/RecordTypes';

export interface IProviders {
    authenticationProvider: IAuthenticationProvider;
    clientProvider: IClientProvider;
    fileProvider: IFileProvider;
    serviceProvider: IServiceProvider;
    serviceLogProvider: IServiceLogProvider;
    setApi: (apiKey: string) => Promise<void>;
}

const getInitialState = () => {
    const baseUrl = process.env.REACT_APP_BASEURL;

    if (!baseUrl || baseUrl.length === 0) {
        throw new Error('The BASEURL environment variable is not set in the .env file or the .env file is missing');
    }

    const providers = {
        authenticationProvider: authenticationProvider(baseUrl),
        clientProvider: clientProvider(baseUrl),
        fileProvider: fileProvider(baseUrl),
        serviceProvider: serviceProvider(baseUrl),
        serviceLogProvider: serviceLogProvider(baseUrl),
        setApi: async (apiKey: string): Promise<void> => {
            await providers.clientProvider.setApiKey(apiKey);
            await providers.fileProvider.setApiKey(apiKey);
            await providers.serviceProvider.setApiKey(apiKey);
            await providers.serviceLogProvider.setApiKey(apiKey);
        }
    } as IProviders;

    return {
        errorDetails: undefined,
        providers,
        serviceList: [] as ServiceRecord[]
    } as State;
};

export default getInitialState;
