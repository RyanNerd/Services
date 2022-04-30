import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import React, {createRef, useEffect, useRef, useState} from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {useHover} from 'usehooks-ts';
import {randomString} from 'utilities/randomString';

interface IProps {
    searchResults: ClientRecord[];
    onEdit: (client: ClientRecord) => void;
    onSelect: (client: ClientRecord) => void;
}

/**
 * Client Search Grid Row component
 * @param {IProps} props The props for this component
 */
const ClientSearchGrid = (props: IProps) => {
    const onSelect = props.onSelect;
    const onEdit = props.onEdit;

    const [searchResults, setSearchResults] = useState(props.searchResults);
    useEffect(() => {
        setSearchResults(props.searchResults);
    }, [props.searchResults]);

    // https://stackoverflow.com/questions/57901725/react-creating-dynamically-refs-with-typescript
    const references = useRef(Array.from({length: searchResults.length}, () => createRef<HTMLTableRowElement>()));

    /**
     * Client Selection Table Row component
     * @param {ClientRecord} clientRecord The ClientRecord to parse
     * @param {number} index Map index
     * @returns {JSX.Element | null} Returns either the component or null if no component to render
     */
    const ClientSelectionRow = (clientRecord: ClientRecord, index: number) => {
        const domId = clientRecord.Id ? clientRecord.Id : randomString();
        const dob = new Date(
            clientRecord.DOB_YEAR as number,
            (clientRecord.DOB_MONTH as number) - 1,
            clientRecord.DOB_DAY as number
        );
        const clientDob = dayjs(dob);
        const hoverReference = references.current[index];
        const isHover = useHover(hoverReference); // https://usehooks-ts.com/react-hook/use-hover

        return (
            <tr
                id={`client-selection-grid-row-${domId}`}
                key={`client-selection-grid-row-${domId}`}
                onClick={() => onSelect(clientRecord)}
                ref={references.current[index]}
                style={{fontWeight: isHover ? 'bold' : undefined}}
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
                <td style={{cursor: 'pointer'}}>{clientDob.format('MM/DD/YYYY')}</td>
                <td style={{cursor: 'pointer'}}>{clientRecord.Notes || ''}</td>
                <td>
                    <Button
                        onClick={(mouseEvent) => {
                            mouseEvent.stopPropagation();
                            onEdit(clientRecord);
                        }}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Edit
                    </Button>
                </td>
            </tr>
        );
    };

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
                height: '600px',
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
                    <th>Notes</th>
                    <th> </th>
                </tr>
            </thead>
            {searchResults.length > 0 ? (
                <tbody>{searchResults.map((client, index) => ClientSelectionRow(client, index))}</tbody>
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
