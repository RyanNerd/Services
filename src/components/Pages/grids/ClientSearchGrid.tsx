import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import React from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {randomString} from 'utilities/randomString';

interface IProps {
    searchResults: ClientRecord[] | null;
}

/**
 * Client Search Grid Row component
 * @param {IProps} props The props for this component
 */
const ClientSearchGrid = (props: IProps) => {
    const searchResults = props.searchResults;

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

    if (!searchResults) return null;

    return (
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
    );
};

export default ClientSearchGrid;
