import dayjs from 'dayjs';
import {ClientHmisResponse} from 'providers/fileProvider';
import Table from 'react-bootstrap/Table';
import React from 'reactn';
import {ClientRecord} from 'types/RecordTypes';

import {randomString} from 'utilities/randomString';

interface IProps {
    clientList: ClientHmisResponse;
}

const UploadGrid = (props: IProps) => {
    const clientsResponse = props.clientList;
    // TODO: Need to show both updated and not found clients!
    // const clientsNotFound = clientsResponse.clientsNotFound;
    const clientList = clientsResponse.clientsUpdated;

    const ClientRow = (clientRecord: ClientRecord) => {
        const domId = clientRecord.Id ? clientRecord.Id : randomString();
        const dob = new Date(
            clientRecord.DOB_YEAR as number,
            (clientRecord.DOB_MONTH as number) - 1,
            clientRecord.DOB_DAY as number
        );
        const clientDob = dayjs(dob);

        return (
            <tr id={`upload-grid-row-${domId}`} key={`upload-grid-row-${domId}`}>
                <td>{clientRecord.FirstName}</td>
                <td>{clientRecord.LastName}</td>
                <td>{clientDob.format('MM/DD/YYYY')}</td>
                <td>{clientRecord.HMIS}</td>
                <td>{clientRecord.EnrollmentId}</td>
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
                {clientList.length > 0 ? (
                    <tr>
                        <th colSpan={3}>Clients Updated</th>
                        <tr style={{backgroundColor: 'lightgray'}}>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>DOB</th>
                            <th>HMIS #</th>
                            <th>Enrollment ID</th>
                        </tr>
                    </tr>
                ) : (
                    <tr>
                        <th colSpan={1}>
                            <td>No clients updated</td>
                        </th>
                    </tr>
                )}
            </thead>
            <tbody>{clientList.length > 0 && <>{clientList.map((client) => ClientRow(client))}</>}</tbody>
        </Table>
    );
};

export default UploadGrid;
