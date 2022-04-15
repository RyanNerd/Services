import {Card, Col, Row} from 'react-bootstrap';
import React from 'reactn';
import {ClientRecord, ServiceListRecord} from 'types/RecordTypes';
import {clientDOB, clientFullName} from 'utilities/clientFormatting';
import getFormattedDate from 'utilities/getFormattedDate';

interface IProps {
    activeClient: ClientRecord;
    serviceList: ServiceListRecord[];
}

const ClientCard = (props: IProps) => {
    const activeClient = props.activeClient;
    const serviceList = props.serviceList;

    return (
        <Row>
            <Col sm="2">
                <Card border="info">
                    <Card.Header>{clientFullName(activeClient)}</Card.Header>
                    <Card.Body>DOB: {clientDOB(activeClient)}</Card.Body>
                </Card>
            </Col>
            <Col sm="10">
                <Card border="primary">
                    <Card.Header>Services for {getFormattedDate(new Date(), true)}</Card.Header>
                    <Card.Body>
                        <ul>
                            {serviceList.map((s) => {
                                // eslint-disable-next-line react/jsx-key
                                return <li key={`service-list-item-${s.Id}`}>Service: {s.ServiceName}</li>;
                            })}
                        </ul>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ClientCard;
