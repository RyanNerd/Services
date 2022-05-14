import dayjs from 'dayjs';
import {Card, Col, Form, InputGroup, ListGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'reactn';
import 'styles/list-item-marker.css';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientDOB, clientFullName} from 'utilities/clientFormatting';
import getFormattedDate from 'utilities/getFormattedDate';
import {IProviders} from 'utilities/getInitialState';
import {multiSort, SortDirection} from 'utilities/multiSort';

interface IProps {
    activeClient: ClientRecord;
    onEdit: (activeClient: ClientRecord) => void;
    providers: IProviders;
    serviceList: ServiceRecord[];
}

type ServiceLogInputRecord = {
    AllowMultiple: boolean;
    Id: number;
    Notes: string | null;
    ServiceGiven: boolean;
    ServiceId: number;
    ServiceLogRecord: ServiceLogRecord | null;
    ServiceName: string;
};

const ClientCard = (props: IProps) => {
    const onEditClient = props.onEdit;
    const serviceLogProvider = props.providers.serviceLogProvider;

    const [serviceList, setServiceList] = useState(props.serviceList);
    useEffect(() => {
        setServiceList(props.serviceList);
    }, [props.serviceList]);

    const [serviceLogList, setServiceLogList] = useState<ServiceLogRecord[]>([]);
    const [activeClient, setActiveClient] = useState(props.activeClient);
    useEffect(() => {
        /**
         * Given the clientId set the service log list with today's entries
         * @param {number} clientId The client id
         */
        const populateServiceLog = async (clientId: number) => {
            setServiceLogList(await serviceLogProvider.loadToday(clientId));
        };

        setActiveClient(props.activeClient);
        populateServiceLog(props.activeClient.Id as number);
    }, [props.activeClient, serviceLogProvider]);

    const [serviceLogHistoryList, setServiceLogHistoryList] = useState<ServiceLogRecord[]>([]);
    useEffect(() => {
        /**
         * Given the clientId set the service log history list
         * @param {number} clientId The client id
         */
        const populateServiceLogHistory = async (clientId: number) => {
            const serviceLogHistoryResponse = await serviceLogProvider.loadAll(clientId);
            setServiceLogHistoryList([...multiSort(serviceLogHistoryResponse, {Updated: SortDirection.asc})]);
        };

        if (props.activeClient.Id && serviceLogList.length >= 0) populateServiceLogHistory(props.activeClient.Id);
    }, [props.activeClient.Id, serviceLogList.length, serviceLogProvider]);

    /**
     * Add a serviceLog entry when the service switch is set to true
     * @param {number} serviceId The service Id
     */
    const addServiceLog = async (serviceId: number) => {
        await serviceLogProvider.update({
            Id: null,
            ResidentId: activeClient.Id as number,
            ServiceId: serviceId,
            Notes: ''
        });
        setServiceLogList(await serviceLogProvider.loadToday(activeClient.Id as number));
    };

    /**
     * Handle when the toggle switch is changed
     * @param {ServiceLogInputRecord} serviceLogInputRecord The ServiceLogInputRecord
     */
    const handleSwitchChange = (serviceLogInputRecord: ServiceLogInputRecord) => {
        /**
         * Remove the serviceLog entry when the service switch is set to false
         * @param {number} serviceLogId The service record Id
         * @returns {Promise<void>}
         */
        const removeServiceLog = async (serviceLogId: number) => {
            await serviceLogProvider.delete(serviceLogId, true);
            setServiceLogList(await serviceLogProvider.loadToday(activeClient.Id as number));
        };

        // Is there an existing service log record? If so then remove it, otherwise add a new record.
        if (serviceLogInputRecord.ServiceGiven) {
            removeServiceLog(serviceLogInputRecord.ServiceLogRecord?.Id as number);
        } else {
            addServiceLog(serviceLogInputRecord.ServiceId);
        }
    };

    /**
     * Fires as the user changes the notes field
     * @param {React.ChangeEvent} changeEvent The onChange event
     * @param {ServiceLogRecord} serviceLogRecord The service log record notes to change
     */
    const handleOnChange = (changeEvent: React.ChangeEvent, serviceLogRecord: ServiceLogRecord) => {
        const target = changeEvent.target as HTMLInputElement;
        const value = target.value;
        const cloneServiceLogList = [...serviceLogList];
        for (const [cloneIndex, clonedServiceLog] of cloneServiceLogList.entries()) {
            if (clonedServiceLog.Id === serviceLogRecord.Id && cloneServiceLogList[cloneIndex].Notes !== value) {
                cloneServiceLogList[cloneIndex].Notes = value;
                setServiceLogList(cloneServiceLogList);
            }
        }
    };

    /**
     * Fires when the focus is moved from the notes field
     * @param {ServiceLogRecord} serviceLogRecord The serviceLogRecord to update
     */
    const saveNoteChanges = (serviceLogRecord: ServiceLogRecord) => {
        const updateServiceLog = async () => {
            await serviceLogProvider.update(serviceLogRecord);
            setServiceLogList(await serviceLogProvider.loadToday(activeClient.Id as number));
        };
        updateServiceLog();
    };

    // Build out the serviceLogInputList
    const [serviceLogInputList, setServiceLogInputList] = useState([] as ServiceLogInputRecord[]);
    useEffect(() => {
        const logInputList = [] as ServiceLogInputRecord[];
        let count = 0;
        for (const serviceRecord of serviceList) {
            let found = false;
            for (const serviceLogRecord of serviceLogList) {
                if (serviceLogRecord.ServiceId === serviceRecord.Id) {
                    found = true;
                    logInputList.push({
                        AllowMultiple: serviceRecord.AllowMultiple,
                        Id: count++,
                        Notes: serviceLogRecord.Notes,
                        ServiceGiven: true,
                        ServiceId: serviceRecord.Id,
                        ServiceLogRecord: serviceLogRecord,
                        ServiceName: serviceRecord.ServiceName
                    });
                }
            }
            // Even if the service has no service log records we need to add it to the list so it can be selected
            if (!found) {
                logInputList.push({
                    AllowMultiple: false,
                    Id: count++,
                    Notes: null,
                    ServiceGiven: false,
                    ServiceId: serviceRecord.Id as number,
                    ServiceLogRecord: null,
                    ServiceName: serviceRecord.ServiceName
                });
            }
        }
        setServiceLogInputList([...logInputList]);
    }, [serviceList, serviceLogList]);

    /**
     * Service Log History Item
     * @param {ServiceLogRecord} serviceLogRecord The service log record
     */
    const ServiceLogHistoryRow = (serviceLogRecord: ServiceLogRecord) => {
        if (serviceLogRecord.Recorded === null) {
            const serviceName = serviceList.find(
                (serviceRecord) => serviceRecord.Id === serviceLogRecord.ServiceId
            )?.ServiceName;
            const dos = new Date(serviceLogRecord.Updated as Date);
            const dateOfService = dayjs(dos).format('MM/DD/YYYY');
            return (
                <li key={`service-log-history-${serviceLogRecord.Id}`}>
                    {serviceName} - {dateOfService}
                </li>
            );
        } else {
            return null;
        }
    };

    return (
        <>
            <Col sm="3">
                <Card border="info">
                    <Card.Header>
                        <span style={{backgroundColor: 'lawngreen', fontWeight: 'bold'}}>
                            {clientFullName(activeClient, true)}
                        </span>
                    </Card.Header>

                    <Card.Body>
                        <ListGroup>
                            <ListGroup.Item>
                                <span style={{fontWeight: 'bold'}}>DOB: </span> {clientDOB(activeClient)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span style={{fontWeight: 'bold'}}>Notes: </span>
                                <Form.Text>{activeClient.Notes}</Form.Text>
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                onClick={(mouseEvent) => {
                                    mouseEvent.preventDefault();
                                    onEditClient(activeClient);
                                }}
                                variant="info"
                            >
                                <span style={{fontWeight: 'bold', backgroundColor: 'lawngreen'}}>
                                    {clientFullName(activeClient)}
                                </span>
                                <span className="mx-1">(click to edit)</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className="list-section">
                                    <ul style={{height: '450px', overflowY: 'auto'}}>
                                        {serviceLogHistoryList.map((serviceLogRecord) =>
                                            ServiceLogHistoryRow(serviceLogRecord)
                                        )}
                                    </ul>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>

            <Col sm="9">
                <Card border="primary">
                    <Card.Header>
                        Services for{' '}
                        <span style={{backgroundColor: 'lawngreen', fontWeight: 'bold'}}>
                            {clientFullName(activeClient)}
                        </span>
                        <span> for today </span>
                        <span style={{fontWeight: 'bold'}}>{getFormattedDate(new Date(), true)}</span>
                    </Card.Header>

                    <Card.Body>
                        {serviceLogInputList.map((serviceLogInputItem) => {
                            return (
                                <InputGroup key={`services-input-group-${serviceLogInputItem.Id}`} className="my-1">
                                    <Form.Check
                                        key={`services-checkbox-${serviceLogInputItem.Id}`}
                                        checked={serviceLogInputItem.ServiceGiven}
                                        onChange={() => handleSwitchChange(serviceLogInputItem)}
                                        id={`service-list-checkbox-${serviceLogInputItem.Id}`}
                                        name="services"
                                        label={serviceLogInputItem.ServiceName}
                                        type="switch"
                                        value={serviceLogInputItem.Id as number}
                                    />

                                    {serviceLogInputItem.ServiceGiven && (
                                        <>
                                            {serviceLogInputItem.AllowMultiple ? (
                                                <Button
                                                    className="mx-2"
                                                    size="sm"
                                                    onClick={() => addServiceLog(serviceLogInputItem.ServiceId)}
                                                    variant="outline-info"
                                                >
                                                    +
                                                </Button>
                                            ) : null}

                                            <Form.Control
                                                onChange={(changeEvent) =>
                                                    handleOnChange(
                                                        changeEvent,
                                                        serviceLogInputItem.ServiceLogRecord as ServiceLogRecord
                                                    )
                                                }
                                                onBlur={() =>
                                                    saveNoteChanges(
                                                        serviceLogInputItem.ServiceLogRecord as ServiceLogRecord
                                                    )
                                                }
                                                type="text"
                                                size="sm"
                                                className="mx-2"
                                                placeholder="Notes"
                                                value={serviceLogInputItem.Notes || ''}
                                            />
                                        </>
                                    )}
                                </InputGroup>
                            );
                        })}
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

export default ClientCard;
