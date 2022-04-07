import {IClientProvider} from 'providers/clientProvider';
import {Col, Row} from 'react-bootstrap';
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

    useEffect(() => {
        const findClientsByName = async () => {
            const searchCriteria = {
                where: [['FirstName', 'like', '%' + searchText + '%']],
                orWhere: [['LastName', 'like', '%' + searchText]],
                withTrashed: true
            };
            setSearchResults(await clientProvider.search(searchCriteria));
        };

        const findClientsByDOB = async () => {
            const searchCriteria = {
                where: [['DOB_MONTH', '=', Number.parseInt(searchText)]],
                orWhere: [
                    ['DOB_DAY', '=', Number.parseInt(searchDay)],
                    ['DOB_YEAR', '=', Number.parseInt(searchYear)]
                ],
                withTrashed: true
            };
            setSearchResults(await clientProvider.search(searchCriteria));
        };

        if (searchText.length > 0) {
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
            setSearchByName(true);
            setSearchDay('');
            setSearchYear('');
            setSearchResults(null);
        }
    }, [searchText, clientProvider, searchDay, searchYear, setErrorDetails]);

    if (props.tabKey !== 'client') return null;

    return (
        <Form>
            {searchByName ? (
                <Form.Group>
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
                                type="search"
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
                                type="search"
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
                                type="search"
                                value={searchYear}
                            />
                        </FloatingLabel>
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
