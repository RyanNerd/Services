import {Card, Col, Form, InputGroup, Row} from 'react-bootstrap';
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
        const populatedServiceLog = async () => {
            setServiceLogList(await providers.serviceLogProvider.load(props.activeClient.Id as number));
        };
        setActiveClient(props.activeClient);
        populatedServiceLog();
    }, [props.activeClient, providers.serviceLogProvider]);

    /**
     * Handle when the toggle switch is changed
     * @param {ServiceRecord} serviceRecord The service record being changed
     */
    const handleSwitchChange = (serviceRecord: ServiceRecord) => {
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

        const currentServiceLogRecord = serviceLogList?.find((sl) => sl.ServiceId === serviceRecord.Id);
        // Is there an existing service log record? If so then remove it, otherwise add a new record.
        if (currentServiceLogRecord && currentServiceLogRecord.Id) {
            removeServiceLog(currentServiceLogRecord.Id);
        } else {
            addServiceLog();
        }
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
                                const isChecked = serviceLogList?.some(
                                    (serviceLogRecord) => serviceLogRecord.ServiceId === serviceRecord.Id
                                );

                                return (
                                    <InputGroup key={`services-input-group-${serviceRecord.Id}`}>
                                        <Form.Check
                                            key={`services-checkbox-${serviceRecord.Id}`}
                                            checked={isChecked}
                                            onChange={() => handleSwitchChange(serviceRecord)}
                                            id={`service-list-checkbox-${serviceRecord.Id}`}
                                            name="services"
                                            label={serviceRecord.ServiceName}
                                            type="switch"
                                            value={serviceRecord.Id as number}
                                        />

                                        <Form.Control
                                            disabled={!isChecked}
                                            type="text"
                                            size="sm"
                                            className={'mx-2'}
                                            placeholder="notes"
                                        />
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
