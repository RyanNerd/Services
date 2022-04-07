import {IClientProvider} from 'providers/clientProvider';
import {Col, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import React, {useEffect, useGlobal, useState} from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {randomString} from 'utilities/randomString';

interface IProps {
    clientProvider: IClientProvider;
    tabKey: string;
}

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

    const ClientSelectionRow = (clientRecord: ClientRecord) => {
        const domId = clientRecord.Id ? clientRecord.Id : randomString();
        const dob = clientRecord.DOB_MONTH + '/' + clientRecord.DOB_DAY + '/' + clientRecord.DOB_YEAR;
        return (
            <tr key={`client-selection-grid-row-${domId}`} id={`client-selection-grid-row-${domId}`}>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <ToggleButton
                        checked={false}
                        name={'client-selection-list'}
                        onChange={() => alert('todo: Selected Client# ' + clientRecord.Id)}
                        onClick={() => alert('todo: Selected Client# ' + clientRecord.Id)}
                        type="checkbox"
                        value={clientRecord.Id as number}
                        variant="info"
                    />
                </td>
                <td>{clientRecord.FirstName}</td>
                <td>{clientRecord.LastName}</td>
                <td>{dob}</td>
            </tr>
        );
    };

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
                withTrashed: true
            };
            setSearchResults(await clientProvider.search(searchCriteria));
        };

        /**
         * Access the API searching for clients by DOB
         * @returns {Promise<void>}
         */
        const findClientsByDOB = async () => {
            // Build out the search criteria
            const searchCriteria = {withTrashed: true} as Record<string, unknown>;

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
                {searchResults && searchResults.length > 0 && (
                    <Table
                        bordered
                        className="d-block"
                        hover
                        size="sm"
                        striped
                        style={{
                            width: 'fit-content',
                            borderCollapse: 'collapse',
                            height: '500px',
                            overflowY: 'auto',
                            overflowX: 'auto'
                        }}
                    >
                        <thead className="dark" style={{position: 'sticky', top: 0, display: 'table-header-group'}}>
                            <tr style={{backgroundColor: 'lightgray'}}>
                                <th> </th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>DOB</th>
                            </tr>
                        </thead>
                        <tbody>{searchResults.map((client) => ClientSelectionRow(client))}</tbody>
                    </Table>
                )}
            </Form.Group>
        </Form>
    );
};

export default ClientPage;
