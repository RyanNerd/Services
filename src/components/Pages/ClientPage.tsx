import ClientSearchGrid from 'components/Pages/Grids/ClientSearchGrid';
import {IClientProvider} from 'providers/clientProvider';
import {Col, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React, {useEffect, useGlobal, useState} from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {SearchKeys} from 'types/SearchTypes';

interface IProps {
    clientProvider: IClientProvider;
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
    const clientProvider = props.clientProvider;
    const [searchText, setSearchText] = useState('');
    const [searchDay, setSearchDay] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [searchResults, setSearchResults] = useState<null | ClientRecord[]>(null);
    const [searchByName, setSearchByName] = useState(true);

    /**
     * Set the search strings back to the default values
     */
    const resetSearch = () => {
        setSearchByName(true);
        setSearchText('');
        setSearchDay('');
        setSearchYear('');
        setSearchResults(null);
    };

    // Monitor changes to the search text
    useEffect(() => {
        /**
         * Access the API searching for clients by FirstName and LastName
         * @returns {Promise<void>}
         */
        const findClientsByName = async () => {
            const searchCriteria = {
                where: [['FirstName', 'like', '%' + searchText + '%']],
                orWhere: [['LastName', 'like', '%' + searchText]],
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
            if (searchText.length > 0 && Number.parseInt(searchText)) {
                searchContext.push(['DOB_MONTH', '=', Number.parseInt(searchText)]);
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
        if (searchText.length > 0) {
            // Figure out if this is a DOB or name search
            const isSearchByDOB = isDigit(searchText.slice(0, 1));
            setSearchByName(!isSearchByDOB);
            if (searchText.length > 1 || isSearchByDOB) {
                if (isSearchByDOB) {
                    findClientsByDOB().catch((error: unknown) => setErrorDetails(error));
                } else {
                    findClientsByName().catch((error: unknown) => setErrorDetails(error));
                }
            } else {
                setSearchResults(null);
            }
        } else {
            resetSearch();
        }
    }, [searchText, clientProvider, searchDay, searchYear, setErrorDetails]);

    /**
     * Add a new client
     */
    const addClient = () => {
        alert('todo: Add client logic');
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
                        <Button className="my-3 mx-2" size="sm" variant="info" onClick={() => addClient()}>
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
                {searchResults && searchResults.length > 0 && <ClientSearchGrid searchResults={searchResults} />}
            </Form.Group>
        </Form>
    );
};

export default ClientPage;
