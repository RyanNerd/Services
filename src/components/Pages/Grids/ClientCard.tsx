import {Card, Col, Form, InputGroup, ListGroup, Row} from 'react-bootstrap';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientDOB, clientFullName} from 'utilities/clientFormatting';
import getFormattedDate from 'utilities/getFormattedDate';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    activeClient: ClientRecord;
    providers: IProviders;
    serviceList: ServiceRecord[];
    onEdit: (activeClient: ClientRecord) => void;
}

const ClientCard = (props: IProps) => {
    const serviceLogProvider = props.providers.serviceLogProvider;
    const onEditClient = props.onEdit;
    const [serviceLogList, setServiceLogList] = useState<ServiceLogRecord[]>([]);

    const [serviceList, setServiceList] = useState(props.serviceList);
    useEffect(() => {
        setServiceList(props.serviceList);
    }, [props.serviceList]);

    const [activeClient, setActiveClient] = useState(props.activeClient);
    useEffect(() => {
        const populateServiceLog = async (clientId: number) => {
            setServiceLogList(await serviceLogProvider.loadToday(clientId));
        };
        setActiveClient(props.activeClient);
        populateServiceLog(props.activeClient.Id as number);
    }, [props.activeClient, serviceLogProvider]);

    /**
     * Handle when the toggle switch is changed
     * @param {ServiceRecord} serviceRecord The service record being changed
     * @param {ServiceLogRecord | undefined} serviceLogRecord The service log record if there is one
     */
    const handleSwitchChange = (serviceRecord: ServiceRecord, serviceLogRecord: ServiceLogRecord | undefined) => {
        /**
         * Add a serviceLog entry when the service switch is set to true
         * @returns {Promise<void>}
         */
        const addServiceLog = async () => {
            await serviceLogProvider.update({
                Id: null,
                ResidentId: activeClient.Id as number,
                ServiceId: serviceRecord.Id as number,
                Notes: ''
            });
            setServiceLogList(await serviceLogProvider.loadToday(activeClient.Id as number));
        };

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
        if (serviceLogRecord && serviceLogRecord.Id) {
            removeServiceLog(serviceLogRecord.Id);
        } else {
            addServiceLog();
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

    return (
        <Row>
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
                                Edit{' '}
                                <span style={{fontWeight: 'bold', backgroundColor: 'lawngreen'}}>
                                    {clientFullName(activeClient)}
                                </span>
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
                        </span>{' '}
                        on {getFormattedDate(new Date(), true)}
                    </Card.Header>
                    <Card.Body>
                        <>
                            {serviceList.map((serviceRecord) => {
                                const serviceLogRecord = serviceLogList.find((s) => s.ServiceId === serviceRecord.Id);

                                return (
                                    <InputGroup key={`services-input-group-${serviceRecord.Id}`} className="my-1">
                                        <Form.Check
                                            key={`services-checkbox-${serviceRecord.Id}`}
                                            checked={serviceLogRecord !== undefined}
                                            onChange={() => handleSwitchChange(serviceRecord, serviceLogRecord)}
                                            id={`service-list-checkbox-${serviceRecord.Id}`}
                                            name="services"
                                            label={serviceRecord.ServiceName}
                                            type="switch"
                                            value={serviceRecord.Id as number}
                                        />

                                        {serviceLogRecord !== undefined && (
                                            <>
                                                <Form.Control
                                                    onChange={(changeEvent) =>
                                                        handleOnChange(changeEvent, serviceLogRecord)
                                                    }
                                                    onBlur={() => saveNoteChanges(serviceLogRecord)}
                                                    type="text"
                                                    size="sm"
                                                    className="mx-2"
                                                    placeholder="Notes"
                                                    value={serviceLogRecord.Notes}
                                                />
                                            </>
                                        )}
                                    </InputGroup>
                                );
                            })}
                        </>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ClientCard;
