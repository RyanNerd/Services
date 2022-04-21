import {Card, Col, Form, InputGroup, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientDOB, clientFullName} from 'utilities/clientFormatting';
import getFormattedDate from 'utilities/getFormattedDate';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    activeClient: ClientRecord;
    providers: IProviders;
    serviceList: ServiceRecord[];
}

const ClientCard = (props: IProps) => {
    const serviceList = props.serviceList;
    const providers = props.providers;
    const [serviceLogList, setServiceLogList] = useState<ServiceLogRecord[]>([]);
    const [activeClient, setActiveClient] = useState(props.activeClient);
    useEffect(() => {
        const populateServiceLog = async () => {
            setServiceLogList(await providers.serviceLogProvider.load(props.activeClient.Id as number));
        };
        setActiveClient(props.activeClient);
        populateServiceLog();
    }, [props.activeClient, providers.serviceLogProvider]);

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
            await providers.serviceLogProvider.update({
                Id: null,
                ResidentId: activeClient.Id as number,
                ServiceId: serviceRecord.Id as number,
                Notes: ''
            });
            setServiceLogList(await providers.serviceLogProvider.load(activeClient.Id as number));
        };

        /**
         * Remove the serviceLog entry when the service switch is set to false
         * @param {number} serviceLogId The service record Id
         * @returns {Promise<void>}
         */
        const removeServiceLog = async (serviceLogId: number) => {
            await providers.serviceLogProvider.delete(serviceLogId, true);
            setServiceLogList(await providers.serviceLogProvider.load(activeClient.Id as number));
        };

        // Is there an existing service log record? If so then remove it, otherwise add a new record.
        if (serviceLogRecord && serviceLogRecord.Id) {
            removeServiceLog(serviceLogRecord.Id);
        } else {
            addServiceLog();
        }
    };

    const handleOnChange = (changeEvent: React.ChangeEvent, serviceLogRecord: ServiceLogRecord) => {
        const target = changeEvent.target as HTMLInputElement;
        const value = target.value;
        const cloneServiceLogList = [...serviceLogList];
        for (const [cloneIndex, clonedServiceLog] of cloneServiceLogList.entries()) {
            if (clonedServiceLog.Id === serviceLogRecord.Id) {
                cloneServiceLogList[cloneIndex].Notes = value;
            }
        }
        setServiceLogList(cloneServiceLogList);
    };

    return (
        <Row>
            <Col sm="2">
                <Card border="info">
                    <Card.Header>
                        <span style={{backgroundColor: 'lawngreen', fontWeight: 'bold'}}>
                            {clientFullName(activeClient)}
                        </span>
                    </Card.Header>
                    <Card.Body>
                        <ul>
                            <li>DOB: {clientDOB(activeClient)}</li>
                            <li>
                                <span>
                                    Notes: <Form.Text>{activeClient.Notes}</Form.Text>
                                </span>
                            </li>
                        </ul>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm="10">
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
                                                    type="text"
                                                    size="sm"
                                                    className="mx-2"
                                                    placeholder="Notes"
                                                    value={serviceLogRecord.Notes}
                                                />

                                                <Button
                                                    disabled={serviceLogRecord.Notes.length === 0}
                                                    size="sm"
                                                    variant="outline-primary"
                                                >
                                                    Save
                                                </Button>

                                                <Button
                                                    disabled={serviceLogRecord.Notes.length === 0}
                                                    className="mx-1"
                                                    size="sm"
                                                    variant="outline-secondary"
                                                >
                                                    Cancel
                                                </Button>
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
