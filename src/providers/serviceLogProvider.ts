import dayjs from 'dayjs';
import Frak from 'frak/lib/components/Frak';
import {ServiceLogRecord} from 'types/RecordTypes';

type DeleteResponse = {success: boolean};
type RecordResponse = {
    data: ServiceLogRecord[] | ServiceLogRecord;
    status: number;
    success: boolean;
};

type LoadResponse = {
    data: ServiceLogRecord[];
    status: number;
    success: boolean;
};

export interface IServiceLogProvider {
    delete: (serviceLogId: number, permanentDelete?: boolean) => Promise<DeleteResponse>;
    loadAll: (clientId?: number) => Promise<ServiceLogRecord[]>;
    loadForDate: (clientId: number, dateOfService: Date) => Promise<ServiceLogRecord[]>;
    update: (serviceLogInfo: ServiceLogRecord) => Promise<ServiceLogRecord>;
    read: (id: number) => Promise<ServiceLogRecord>;
    search: (options: Record<string, unknown>) => Promise<ServiceLogRecord[]>;
    setApiKey: (apiKey: string) => void;
}

/**
 * ServiceLogProvider API service connector
 * @param {string} url The url to use
 */
const serviceLogProvider = (url: string): IServiceLogProvider => {
    const _baseUrl = url;
    const _frak = Frak();
    let _apiKey = null as string | null;

    /**
     * Service Search
     * @param {object} options Multi shaped object for the fetch request
     * @returns {Promise<ServiceLogRecord[]>} An array of service records
     */
    const _search = async (options: Record<string, unknown>): Promise<ServiceLogRecord[]> => {
        const response = await _frak.post<RecordResponse>(`${_baseUrl}service-log/search?api_key=${_apiKey}`, options);
        if (response.success) {
            return response.data as ServiceLogRecord[];
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
         * ServiceLog Search
         * @param {object} options Multi shaped object for the fetch request
         * @returns {Promise<ServiceLogRecord[]>} An array of serviceLog records
         */
        search: async (options: Record<string, unknown>): Promise<ServiceLogRecord[]> => {
            return await _search(options);
        },

        /**
         * ServiceLog Read
         * @param {number} id PK of the Resident table
         * @returns {Promise<ServiceLogRecord>} A service record
         */
        read: async (id: number): Promise<ServiceLogRecord> => {
            const uri = _baseUrl + 'service-log/' + id + '?api_key=' + _apiKey;
            const response = await _frak.get<RecordResponse>(uri);
            if (response.success) {
                return response.data as ServiceLogRecord;
            } else {
                throw response;
            }
        },

        /**
         * ServiceLog Update
         * @param {ServiceLogRecord} serviceLogInfo The serviceLog record object
         * @returns {Promise<ServiceLogRecord>} A serviceLog record
         */
        update: async (serviceLogInfo: ServiceLogRecord): Promise<ServiceLogRecord> => {
            const uri = _baseUrl + 'service-log?api_key=' + _apiKey;
            const response = await _frak.post<RecordResponse>(uri, serviceLogInfo);
            if (response.success) {
                return response.data as ServiceLogRecord;
            } else {
                throw response;
            }
        },

        /**
         * ServiceLog Delete
         * @param {number} serviceLogId PK of the ServiceLog table
         * @param {boolean} permanentDelete Set to true to destroy the record
         * @returns {Promise<DeleteResponse>} Success: true/false
         */
        delete: async (serviceLogId: number, permanentDelete?: boolean): Promise<DeleteResponse> => {
            const uri = `${_baseUrl}service-log/${serviceLogId}?api_key=${_apiKey}&force=${
                permanentDelete ? 'true' : false
            }`;
            const response = await _frak.delete<DeleteResponse>(uri);
            if (response.success) {
                return response;
            } else {
                throw response;
            }
        },

        /**
         * Load all serviceLog records given a client id
         * @param {number} clientId The client PK to load all serviceLogs for
         * @returns {Promise<ServiceLogRecord[]>} Array of Service records
         */
        loadAll: async (clientId?: number): Promise<ServiceLogRecord[]> => {
            const uri = clientId
                ? `${_baseUrl}service-log-load/${clientId}?api_key=${_apiKey}`
                : `${_baseUrl}service-log-load?api_key=${_apiKey}`;
            const response = await _frak.get<LoadResponse>(uri);
            if (response.success) {
                return response.data;
            } else {
                if (response.status === 404) {
                    return [] as ServiceLogRecord[];
                }
                throw response;
            }
        },

        /**
         * Load serviceLog records for today's date given a client id
         * @param {number} clientId The client PK to load all serviceLogs for
         * @param {Date} dateOfService The date of service to filter the results
         * @returns {Promise<ServiceLogRecord[]>} Array of Service Log records
         */
        loadForDate: async (clientId: number, dateOfService: Date): Promise<ServiceLogRecord[]> => {
            const dos = dayjs(dateOfService).format('YYYY-MM-DD');
            const uri = `${_baseUrl}service-log-load/${clientId}?dos=${dos}&api_key=${_apiKey}`;
            const response = await _frak.get<LoadResponse>(uri);
            if (response.success) {
                return response.data;
            } else {
                if (response.status === 404) {
                    return [] as ServiceLogRecord[];
                }
                throw response;
            }
        }
    };
};

export default serviceLogProvider;
