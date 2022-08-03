import Frak from 'frak/lib/components/Frak';
import {HmisUserRecord} from 'types/RecordTypes';

type DeleteResponse = {success: boolean};
type RecordResponse = {
    data: HmisUserRecord[] | HmisUserRecord;
    status: number;
    success: boolean;
};

type LoadResponse = {
    data: HmisUserRecord[];
    status: number;
    success: boolean;
};

export interface IHmisUserProvider {
    delete: (clientId: number) => Promise<DeleteResponse>;
    load: () => Promise<HmisUserRecord[]>;
    update: (hmisUserInfo: HmisUserRecord) => Promise<HmisUserRecord>;
    read: (id: number) => Promise<HmisUserRecord>;
    setApiKey: (apiKey: string) => void;
}

/**
 * HmisUsersProvider API HmisUsers connector
 * @param {string} url The url to use
 */
const hmisUsersProvider = (url: string): IHmisUserProvider => {
    const _baseUrl = url;
    const _frak = Frak();
    let _apiKey = null as string | null;

    return {
        /**
         * Set the apiKey
         * @param {string} apiKey The API key to use
         */
        setApiKey: (apiKey: string) => {
            _apiKey = apiKey;
        },

        /**
         * HmisUsers Read
         * @param {number} id PK of the HmisUsers table
         * @returns {Promise<HmisUserRecord>} A HmisUser record
         */
        read: async (id: number): Promise<HmisUserRecord> => {
            const uri = _baseUrl + 'hmis-users/' + id + '?api_key=' + _apiKey;
            const response = await _frak.get<RecordResponse>(uri);
            if (response.success) {
                return response.data as HmisUserRecord;
            } else {
                throw response;
            }
        },

        /**
         * HmisUsers Update
         * @param {HmisUserRecord} hmisUserInfo The HmisUser record object
         * @returns {Promise<HmisUserRecord>} The updated HmisUser record
         */
        update: async (hmisUserInfo: HmisUserRecord): Promise<HmisUserRecord> => {
            const uri = _baseUrl + 'hmis-users?api_key=' + _apiKey;
            const response = await _frak.post<RecordResponse>(uri, hmisUserInfo);
            if (response.success) {
                return response.data as HmisUserRecord;
            } else {
                throw response;
            }
        },

        /**
         * HmisUsers Delete
         * @param {number} id PK of the HmisUsers table
         * @returns {Promise<DeleteResponse>} Success: true/false
         */
        delete: async (id: number): Promise<DeleteResponse> => {
            const uri = _baseUrl + 'hmis-users/' + id + '?api_key=' + _apiKey;
            const response = await _frak.delete<DeleteResponse>(uri);
            if (response.success) {
                return response;
            } else {
                throw response;
            }
        },

        /**
         * Load all HmisUsers records
         * @returns {Promise<HmisUserRecord[]>} Array of HmisUser records
         */
        load: async (): Promise<HmisUserRecord[]> => {
            const uri = _baseUrl + 'hmis-users-load?api_key=' + _apiKey;
            const response = await _frak.get<LoadResponse>(uri);
            if (response.success) {
                return response.data;
            } else {
                if (response.status === 404) {
                    return [] as HmisUserRecord[];
                }
                throw response;
            }
        }
    };
};

export default hmisUsersProvider;
