import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import React, {useRef} from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {useHover} from 'usehooks-ts';
import {randomString} from 'utilities/randomString';

interface IProps {
    searchResults: ClientRecord[] | null;
    onEdit: (client: ClientRecord) => void;
    onSelect: (client: ClientRecord) => void;
}

/**
 * Client Search Grid Row component
 * @param {IProps} props The props for this component
 */
const ClientSearchGrid = (props: IProps) => {
    const searchResults = props.searchResults;
    const onSelect = props.onSelect;
    const onEdit = props.onEdit;

    const ClientSelectionRow = (clientRecord: ClientRecord) => {
        const domId = clientRecord.Id ? clientRecord.Id : randomString();
        const dob = clientRecord.DOB_MONTH + '/' + clientRecord.DOB_DAY + '/' + clientRecord.DOB_YEAR;
        const hoverReference = useRef(null);
        const isHover = useHover(hoverReference); // https://usehooks-ts.com/react-hook/use-hover

        if (!hoverReference) return null;

        return (
            <tr
                key={`client-selection-grid-row-${domId}`}
                id={`client-selection-grid-row-${domId}`}
                ref={hoverReference}
                style={{fontWeight: isHover ? 'bold' : undefined}}
                onClick={() => onSelect(clientRecord)}
            >
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <ToggleButton
                        checked={false}
                        name={'client-selection-list'}
                        type="radio"
                        value={clientRecord.Id as number}
                        variant="outline-info"
                    />
                </td>
                <td style={{cursor: 'pointer'}}>{clientRecord.FirstName}</td>
                <td style={{cursor: 'pointer'}}>{clientRecord.LastName}</td>
                <td style={{cursor: 'pointer'}}>{dob}</td>
                <td>
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={(mouseEvent) => {
                            mouseEvent.stopPropagation();
                            onEdit(clientRecord);
                        }}
                    >
                        Edit
                    </Button>
                </td>
            </tr>
        );
    };

    if (searchResults === null) return null;

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
                    <th>Select</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th> </th>
                </tr>
            </thead>
            {searchResults.length > 0 ? (
                <tbody>{searchResults.map((client) => ClientSelectionRow(client))}</tbody>
            ) : (
                <tbody>
                    <tr>
                        <td>no clients found</td>
                    </tr>
                </tbody>
            )}
        </Table>
    );
};

export default ClientSearchGrid;
