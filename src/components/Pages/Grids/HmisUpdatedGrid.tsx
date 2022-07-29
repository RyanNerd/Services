/* eslint-disable jsdoc/valid-types */
import dayjs from 'dayjs';
import {ClientHmisResponse} from 'providers/fileProvider';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import React from 'reactn';
import {ClientNotFound, ClientRecord} from 'types/RecordTypes';

import {randomString} from 'utilities/randomString';

interface IProps {
    clientHmisList: ClientHmisResponse;
}

/**
 * Get a fileHandle for when the user selects the fileName to save
 * @param {string} filename The name of the file to save
 */
const getNewFileHandle = ({filename}: {filename: string}): Promise<FileSystemFileHandle> => {
    const fileHandleOptions: SaveFilePickerOptions = {
        suggestedName: filename,
        types: [
            {
                description: 'Markdown file',
                accept: {
                    'text/plain': ['.txt', '.json']
                }
            }
        ]
    };

    return showSaveFilePicker(fileHandleOptions);
};

/**
 * Perform the save of the given file (Blob)
 * @param {{FileSystemFileHandle} fileHandle, {Blob} blob}} The fileHandle from getNewFileHandle()
 * @returns {Promise<void>}
 */
const writeFile = async ({fileHandle, blob}: {fileHandle: FileSystemFileHandle; blob: Blob}) => {
    const writer = await fileHandle.createWritable();
    await writer.write(blob);
    await writer.close();
};

/**
 * Called when the Save List button is clicked - saves the Clients Not Found
 * @param {string} notFoundClientsText The clients not found in a string format
 */
const saveUnknownClientList = async (notFoundClientsText: string) => {
    const fileHandle = await getNewFileHandle({
        filename: 'unknown_clients.json'
    });
    await writeFile({
        fileHandle,
        blob: new Blob([notFoundClientsText])
    });
};

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
                                        <span>
                                            {'Clients Not Found'}
                                            <Button
                                                className="mx-1"
                                                size="sm"
                                                onClick={async () => {
                                                    await saveUnknownClientList(
                                                        JSON.stringify(clientsNotFoundList, null, 2)
                                                    );
                                                }}
                                            >
                                                Save List
                                            </Button>
                                        </span>
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
                                    <th colSpan={5}>Clients EnrollmentId Updated</th>
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
