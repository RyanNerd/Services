import {Card, Col, Form, InputGroup, Row} from 'react-bootstrap';
import React from 'reactn';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientDOB, clientFullName} from 'utilities/clientFormatting';
import getFormattedDate from 'utilities/getFormattedDate';

interface IProps {
    activeClient: ClientRecord;
    serviceList: ServiceRecord[];
}

const ClientCard = (props: IProps) => {
    const activeClient = props.activeClient;
    const serviceList = props.serviceList;

    const servicesLog = [
        {
            ServiceId: 1,
            Notes: ''
        },
        {
            ServiceId: 3,
            Notes: ''
        },
        {
            ServiceId: 8,
            Notes: ''
        }
    ] as ServiceLogRecord[];

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
                    <Card.Header>Services for {getFormattedDate(new Date(), true)}</Card.Header>
                    <Card.Body>
                        <Form>
                            {serviceList.map((s) => {
                                return (
                                    <InputGroup key={`services-input-group-${s.Id}`}>
                                        <Form.Check
                                            key={`services-checkbox-${s.Id}`}
                                            checked={servicesLog.some((sl) => sl.ServiceId === s.Id)}
                                            id={`service-list-checkbox-${s.Id}`}
                                            name="services"
                                            label={s.ServiceName}
                                            type="switch"
                                            value={s.Id as number}
                                        />

                                        <Form.Control type="text" size="sm" className={'mx-2'} placeholder="notes" />
                                    </InputGroup>
                                );
                            })}
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ClientCard;
