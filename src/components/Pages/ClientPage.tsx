import {IClientProvider} from 'providers/clientProvider';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import React, {useState} from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {randomString} from 'utilities/randomString';

interface IProps {
    clientProvider: IClientProvider;
    tabKey: string;
}

const ClientPage = (props: IProps) => {
    const clientProvider = props.clientProvider;
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<null | ClientRecord[]>(null);

    const findClients = async (searchText: string) => {
        const searchCriteria = {
            where: [['FirstName', 'like', '%' + searchText + '%']],
            orWhere: [['LastName', 'like', '%' + searchText]],
            withTrashed: true
        };
        return await clientProvider.search(searchCriteria);
    };

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

    if (props.tabKey !== 'client') return null;

    return (
        <Form>
            <Form.Group>
                <FloatingLabel label="Search by name or DOB">
                    <Form.Control
                        autoComplete="off"
                        autoFocus
                        className="my-3"
                        id="client-page-search-text"
                        onChange={async (changeEvent) => {
                            const searchString = changeEvent.target.value;
                            setSearchText(searchString);
                            if (searchString.length > 1) {
                                const theSearchResults = await findClients(changeEvent.target.value);
                                if (theSearchResults) {
                                    setSearchResults(theSearchResults);
                                }
                            } else {
                                setSearchResults(null);
                            }
                        }}
                        onKeyDown={(keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                            if (keyboardEvent.key === 'Enter') keyboardEvent.preventDefault();
                        }}
                        style={{width: '300px'}}
                        type="search"
                        value={searchText}
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group>
                {searchResults && searchResults.length > 0 && (
                    <Table
                        bordered
                        hover
                        size="sm"
                        striped
                        style={{
                            display: 'block',
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
