import authenticationProvider, {IAuthenticationProvider} from 'providers/authenticationProvider';
import clientProvider, {IClientProvider} from 'providers/clientProvider';
import {State} from 'reactn/default';

export interface IProviders {
    authenticationProvider: IAuthenticationProvider;
    clientProvider: IClientProvider;
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
        setApi: async (apiKey: string): Promise<void> => {
            await providers.clientProvider.setApiKey(apiKey);
        }
    } as IProviders;

    return {
        errorDetails: undefined,
        providers,
        signIn: {apiKey: null, organization: null, success: null}
    } as State;
};

export default getInitialState;
