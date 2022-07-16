import dayjs from 'dayjs';
import {ClientHmisResponse} from 'providers/fileProvider';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import React from 'reactn';
import {ClientNotFound, ClientRecord} from 'types/RecordTypes';

import {randomString} from 'utilities/randomString';

interface IProps {
    clientHmisList: ClientHmisResponse;
}

const HmisUpdatedGrid = (props: IProps) => {
    const clientsResponse = props.clientHmisList;
    const clientsNotFoundList = clientsResponse.clientsNotFound;
    const clientsUpdatedList = clientsResponse.updatedClients;

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

    const ClientNotFoundRow = (clientRecord: ClientNotFound) => {
        const domId = randomString();

        return (
            <tr id={`upload-grid-not-found-row-${domId}`} key={`upload-grid-not-found-row-${domId}`}>
                <td>{clientRecord.FirstName}</td>
                <td>{clientRecord.LastName}</td>
                <td>{clientRecord.Age}</td>
                <td>{clientRecord.HMIS}</td>
                <td>{clientRecord.EnrollmentId}</td>
            </tr>
        );
    };

    return (
        <Row>
            <Col lg={6}>
                <Table
                    bordered
                    className="d-block"
                    hover
                    size="sm"
                    striped
                    style={{
                        width: 'fit-content',
                        borderCollapse: 'separate',
                        height: '600px',
                        overflowY: 'auto',
                        overflowX: 'auto'
                    }}
                >
                    <thead className="dark" style={{position: 'sticky', top: 0, display: 'table-header-group'}}>
                        {clientsNotFoundList && clientsNotFoundList?.length > 0 ? (
                            <>
                                <tr>
                                    <th colSpan={6} style={{position: 'sticky', top: 0}}>
                                        Clients Not Found
                                    </th>
                                </tr>
                                <tr style={{backgroundColor: 'lightgray'}}>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Age</th>
                                    <th>HMIS</th>
                                    <th>EnrollmentId</th>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <th colSpan={1}>
                                    <td>All clients found</td>
                                </th>
                            </tr>
                        )}
                    </thead>
                    <tbody style={{overflow: 'hidden'}}>
                        {clientsNotFoundList?.length > 0 && (
                            <>{clientsNotFoundList.map((client) => ClientNotFoundRow(client))}</>
                        )}
                    </tbody>
                </Table>
            </Col>

            <Col lg={6}>
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
                        {clientsUpdatedList && clientsUpdatedList?.length > 0 ? (
                            <>
                                <tr>
                                    <th colSpan={5}>Clients Updated</th>
                                </tr>

                                <tr style={{backgroundColor: 'lightgray'}}>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>DOB</th>
                                    <th>HMIS #</th>
                                    <th>Enrollment ID</th>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <th colSpan={1}>
                                    <td>No clients updated</td>
                                </th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {clientsUpdatedList && clientsUpdatedList?.length > 0 && (
                            <>{clientsUpdatedList.map((client) => ClientRow(client))}</>
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
};

export default HmisUpdatedGrid;
