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
        signIn: {apiKey: null, organization: null, success: null},
        serviceList: [
            {
                Id: 1,
                ServiceName: 'Computer Lab'
            },
            {
                Id: 2,
                ServiceName: 'DI Vouchers - Emergency Services'
            },
            {
                Id: 3,
                ServiceName: 'Donations Closet'
            },
            {
                Id: 4,
                ServiceName: 'Emergency Fund Used'
            },
            {
                Id: 5,
                ServiceName: 'Food'
            },
            {
                Id: 6,
                ServiceName: 'Hot Meal'
            },
            {
                Id: 7,
                ServiceName: 'Laundry'
            },
            {
                Id: 8,
                ServiceName: 'Pet Supplies'
            },
            {
                Id: 9,
                ServiceName: 'Sack Meal'
            },
            {
                Id: 10,
                ServiceName: 'Shower'
            },
            {
                Id: 11,
                ServiceName: 'Voucher SP Thrift Store'
            }
        ]
    } as State;
};

export default getInitialState;
