import ClientServicesCard from 'components/Pages/Modals/ClientServicesCard';
import dayjs from 'dayjs';
import {Card, Col, Form, ListGroup} from 'react-bootstrap';
import React, {useEffect, useState} from 'reactn';
import 'styles/list-item-marker.css';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientDOB, clientFullName} from 'utilities/clientFormatting';
import {IProviders} from 'utilities/getInitialState';
import {multiSort, SortDirection} from 'utilities/multiSort';

interface IProps {
    activeClient: ClientRecord;
    onEdit: (activeClient: ClientRecord) => void;
    providers: IProviders;
    serviceList: ServiceRecord[];
}

const ClientCard = (props: IProps) => {
    const onEditClient = props.onEdit;
    const serviceLogProvider = props.providers.serviceLogProvider;

    const [serviceList, setServiceList] = useState(props.serviceList);
    useEffect(() => {
        setServiceList(props.serviceList);
    }, [props.serviceList]);

    const [activeClient, setActiveClient] = useState(props.activeClient);
    useEffect(() => {
        setActiveClient(props.activeClient);
    }, [props.activeClient]);

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

        if (props.activeClient.Id) populateServiceLogHistory(props.activeClient.Id);
    }, [props.activeClient.Id, serviceLogProvider]);

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
                <ClientServicesCard
                    activeClient={activeClient}
                    dateOfService={new Date()}
                    serviceList={serviceList}
                    serviceLogProvider={serviceLogProvider}
                />
            </Col>
        </>
    );
};

export default ClientCard;
