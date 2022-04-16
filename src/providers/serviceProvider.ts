import Frak from 'frak/lib/components/Frak';
import {ClientRecord, ServiceRecord} from 'types/RecordTypes';

type DeleteResponse = {success: boolean};
type RecordResponse = {
    data: ServiceRecord[] | ServiceRecord;
    status: number;
    success: boolean;
};

type LoadResponse = {
    data: ServiceRecord[];
    success: boolean;
};

export interface IServiceProvider {
    delete: (residentId: number) => Promise<DeleteResponse>;
    load: () => Promise<ServiceRecord[]>;
    update: (residentInfo: ServiceRecord) => Promise<ServiceRecord>;
    read: (id: number) => Promise<ServiceRecord>;
    search: (options: Record<string, unknown>) => Promise<ServiceRecord[]>;
    setApiKey: (apiKey: string) => void;
}

/**
 * ServiceProvider API service connector
 * @param {string} url The url to use
 */
const serviceProvider = (url: string): IServiceProvider => {
    const _baseUrl = url;
    const _frak = Frak();
    let _apiKey = null as string | null;

    /**
     * Service Search
     * @param {object} options Multi shaped object for the fetch request
     * @returns {Promise<ServiceRecord[]>} An array of service records
     */
    const _search = async (options: Record<string, unknown>): Promise<ServiceRecord[]> => {
        const response = await _frak.post<RecordResponse>(`${_baseUrl}service/search?api_key=${_apiKey}`, options);
        if (response.success) {
            return response.data as ServiceRecord[];
        } else {
            if (response.status === 404) {
                return [];
            } else {
                throw response;
            }
        }
    };

    return {
        /**
         * Set the apiKey
         * @param {string} apiKey The API key to use
         */
        setApiKey: (apiKey: string) => {
            _apiKey = apiKey;
        },

        /**
         * Client Search
         * @param {object} options Multi shaped object for the fetch request
         * @returns {Promise<ClientRecord[]>} An array of client records
         */
        search: async (options: Record<string, unknown>): Promise<ServiceRecord[]> => {
            return await _search(options);
        },

        /**
         * Service Read
         * @param {number} id PK of the Resident table
         * @returns {Promise<ServiceRecord>} A service record
         */
        read: async (id: number): Promise<ServiceRecord> => {
            const uri = _baseUrl + 'service/' + id + '?api_key=' + _apiKey;
            const response = await _frak.get<RecordResponse>(uri);
            if (response.success) {
                return response.data as ServiceRecord;
            } else {
                throw response;
            }
        },

        /**
         * Service Update
         * @param {ServiceRecord} serviceInfo The service record object
         * @returns {Promise<ServiceRecord>} A service record
         */
        update: async (serviceInfo: ServiceRecord): Promise<ServiceRecord> => {
            const uri = _baseUrl + 'service?api_key=' + _apiKey;
            const response = await _frak.post<RecordResponse>(uri, serviceInfo);
            if (response.success) {
                return response.data as ServiceRecord;
            } else {
                throw response;
            }
        },

        /**
         * Service Delete
         * @param {number} serviceId PK of the Service table
         * @returns {Promise<DeleteResponse>} Success: true/false
         */
        delete: async (serviceId: number): Promise<DeleteResponse> => {
            const uri = _baseUrl + 'resident/' + serviceId + '?api_key=' + _apiKey;
            const response = await _frak.delete<DeleteResponse>(uri);
            if (response.success) {
                return response;
            } else {
                throw response;
            }
        },

        /**
         * Load all service records
         * @returns {Promise<ServiceRecord[]>} Array of Service records
         */
        load: async (): Promise<ServiceRecord[]> => {
            const uri = _baseUrl + 'service-load?api_key=' + _apiKey;
            const response = await _frak.get<LoadResponse>(uri);
            if (response.success) {
                return response.data;
            } else {
                throw response;
            }
        }
    };
};

export default serviceProvider;
