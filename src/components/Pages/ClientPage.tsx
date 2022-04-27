import ClientCard from 'components/Pages/Grids/ClientCard';
import ClientSearchGrid from 'components/Pages/Grids/ClientSearchGrid';
import ClientEdit from 'components/Pages/Modals/ClientEdit';
import {Col, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React, {useEffect, useGlobal, useState} from 'reactn';
import {ClientRecord, newClientRecord, ServiceRecord} from 'types/RecordTypes';
import {SearchKeys} from 'types/SearchTypes';
import {useDebounce} from 'usehooks-ts';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    providers: IProviders;
    serviceList: ServiceRecord[];
    tabKey: string;
}

/**
 * Given a single character return true if the character is a digit
 * @param {string} singleChar Single character string to test
 * @returns {boolean} True if digit, otherwise false
 */
const isDigit = (singleChar: string) => {
    return singleChar >= '0' && singleChar < '9';
};

const ClientPage = (props: IProps) => {
    const [, setErrorDetails] = useGlobal('errorDetails');
    const clientProvider = props.providers.clientProvider;
    const serviceList = props.serviceList;
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 300);
    const [searchDay, setSearchDay] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [searchResults, setSearchResults] = useState<ClientRecord[]>([] as ClientRecord[]);
    const [searchByName, setSearchByName] = useState(true);
    const [activeClient, setActiveClient] = useState<ClientRecord | null>(null);
    const [clientInfo, setClientInfo] = useState<ClientRecord | null>(null);

    /**
     * Set the search strings back to the default values
     */
    const resetSearch = () => {
        setSearchByName(true);
        setSearchText('');
        setSearchDay('');
        setSearchYear('');
        setSearchResults([]);
    };

    // Monitor changes to the search text
    useEffect(() => {
        /**
         * Access the API searching for clients by FirstName and LastName
         * @returns {Promise<void>}
         */
        const findClientsByName = async () => {
            const searchCriteria = {
                where: [['FirstName', 'like', '%' + debouncedSearchText + '%']],
                orWhere: [['LastName', 'like', '%' + debouncedSearchText]],
                onlyTrashed: true
            } as Record<SearchKeys, (string | number)[][] | boolean>;
            setSearchResults(await clientProvider.search(searchCriteria));
        };

        /**
         * Access the API searching for clients by DOB
         * @returns {Promise<void>}
         */
        const findClientsByDOB = async () => {
            // Build out the search criteria
            const searchCriteria = {onlyTrashed: true} as Record<SearchKeys, (string | number)[][] | boolean>;

            const searchContext = [];
            if (debouncedSearchText.length > 0 && Number.parseInt(debouncedSearchText)) {
                searchContext.push(['DOB_MONTH', '=', Number.parseInt(debouncedSearchText)]);
            }
            if (searchDay.length > 0 && Number.parseInt(searchDay)) {
                searchContext.push(['DOB_DAY', '=', Number.parseInt(searchDay)]);
            }
            if (searchYear.length > 0 && Number.parseInt(searchYear)) {
                searchContext.push(['DOB_YEAR', '=', Number.parseInt(searchYear)]);
            }

            if (searchContext.length > 0) {
                searchCriteria.where = searchContext;
                setSearchResults(await clientProvider.search(searchCriteria));
            }
        };

        // Is there text in searchText?
        if (debouncedSearchText.length > 0) {
            setActiveClient(null);
            // Figure out if this is a DOB or name search
            const isSearchByDOB = isDigit(debouncedSearchText.slice(0, 1)) && debouncedSearchText.slice(0, 1) !== '0';
            setSearchByName(!isSearchByDOB);
            setSearchResults([]); // This prevents Uncaught Error: Rendered fewer hooks than expected
            if (debouncedSearchText.length > 1 || isSearchByDOB) {
                if (isSearchByDOB) {
                    findClientsByDOB().catch((error: unknown) => setErrorDetails(error));
                } else {
                    findClientsByName().catch((error: unknown) => setErrorDetails(error));
                }
            }
        } else {
            resetSearch();
        }
    }, [debouncedSearchText, clientProvider, searchDay, searchYear, setErrorDetails]);

    /**
     * Edit existing client or add a new client
     * @param {ClientRecord} clientRecord The client record to add or edit
     */
    const addEditClient = (clientRecord: ClientRecord | null) => {
        if (clientRecord !== null) setClientInfo(clientRecord);
        else setClientInfo({...newClientRecord});
    };

    /**
     * Handle when a client is selected
     * @param {ClientRecord} c The client record to make active
     */
    const handleClientSelected = (c: ClientRecord) => {
        resetSearch();
        setActiveClient(c);
    };

    if (props.tabKey !== 'client') return null;

    return (
        <Form>
            {searchByName ? (
                <Row>
                    <Form.Group as={Col} sm="2">
                        <FloatingLabel label="Search by name or DOB">
                            <Form.Control
                                autoComplete="off"
                                autoFocus
                                className="my-3"
                                id="client-page-search-text"
                                onChange={(changeEvent) => setSearchText(changeEvent.target.value)}
                                onKeyDown={(keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                                    if (keyboardEvent.key === 'Enter') keyboardEvent.preventDefault();
                                }}
                                style={{width: '300px'}}
                                type="search"
                                value={searchText}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} controlId="dob-year" sm="2">
                        <Button className="my-3 mx-2" size="sm" variant="info" onClick={() => addEditClient(null)}>
                            + Add Client
                        </Button>
                    </Form.Group>
                </Row>
            ) : (
                <Row>
                    <Form.Group as={Col} controlId="dob-month" sm="1">
                        <FloatingLabel label="DOB Month">
                            <Form.Control
                                autoComplete="off"
                                autoFocus
                                className="my-3"
                                id="client-page-search-month"
                                onChange={(changeEvent) => setSearchText(changeEvent.target.value)}
                                onKeyDown={(keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                                    if (keyboardEvent.key === 'Enter') keyboardEvent.preventDefault();
                                }}
                                style={{width: '90px'}}
                                type="number"
                                value={searchText}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} controlId="dob-day" sm="1">
                        <FloatingLabel label="DOB Day">
                            <Form.Control
                                autoComplete="off"
                                className="my-3"
                                id="client-page-search-day"
                                onChange={(changeEvent) => setSearchDay(changeEvent.target.value)}
                                onKeyDown={(keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                                    if (keyboardEvent.key === 'Enter') keyboardEvent.preventDefault();
                                }}
                                style={{width: '90px'}}
                                type="number"
                                value={searchDay}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} controlId="dob-year" sm="1">
                        <FloatingLabel label="DOB Year">
                            <Form.Control
                                autoComplete="off"
                                className="my-3"
                                id="client-page-search-year"
                                onChange={(changeEvent) => setSearchYear(changeEvent.target.value)}
                                onKeyDown={(keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                                    if (keyboardEvent.key === 'Enter') keyboardEvent.preventDefault();
                                }}
                                style={{width: '90px'}}
                                type="number"
                                value={searchYear}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} controlId="dob-year" sm="1">
                        <Button className="my-3" size="sm" variant="outline-info" onClick={() => resetSearch()}>
                            Search by Name
                        </Button>
                    </Form.Group>
                </Row>
            )}

            <Form.Group>
                {searchResults.length > 0 && activeClient === null ? (
                    <ClientSearchGrid
                        searchResults={searchResults}
                        onSelect={(c) => handleClientSelected({...c})}
                        onEdit={(c) => addEditClient(c)}
                    />
                ) : (
                    <>
                        {activeClient && searchText.length === 0 && (
                            <ClientCard
                                activeClient={activeClient}
                                providers={props.providers}
                                serviceList={serviceList}
                            />
                        )}
                    </>
                )}
            </Form.Group>

            <ClientEdit
                clientInfo={clientInfo as ClientRecord}
                clientProvider={props.providers.clientProvider}
                onClose={(cr) => {
                    setClientInfo(null);
                    if (cr !== null) {
                        handleClientSelected(cr);
                    }
                }}
                show={clientInfo !== null}
            />
        </Form>
    );
};

export default ClientPage;
