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

    const serviceLog = [
        {
            Id: 1,
            ResidentId: 12,
            ServiceId: 1,
            Notes: ''
        },
        {
            Id: 2,
            ResidentId: 12,
            ServiceId: 3,
            Notes: ''
        },
        {
            Id: 3,
            ResidentId: 12,
            ServiceId: 8,
            Notes: ''
        }
    ] as ServiceLogRecord[];

    const handleSwitchChange = (serviceRecord: ServiceRecord) => {
        for (const [slIndex, sl] of serviceLog.entries()) {
            // TODO: handle this via the API - PoC right now
            if (sl.ServiceId === serviceRecord.Id) {
                // eslint-disable-next-line no-console
                console.log('serviceLog before', serviceLog);
                serviceLog.splice(slIndex, 1);
                // delete serviceLog[slIndex];
                // eslint-disable-next-line no-console
                console.log('serviceLog after', serviceLog);
            } else {
                serviceLog.push({
                    Id: serviceLog.length + 1,
                    ResidentId: 0,
                    ServiceId: serviceRecord.Id as number,
                    Notes: ''
                });
            }
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
                    <Card.Header>Services for {getFormattedDate(new Date(), true)}</Card.Header>
                    <Card.Body>
                        <Form>
                            {serviceList.map((s) => {
                                return (
                                    <InputGroup key={`services-input-group-${s.Id}`}>
                                        <Form.Check
                                            key={`services-checkbox-${s.Id}`}
                                            checked={serviceLog.some((sl) => sl.ServiceId === s.Id)}
                                            onChange={() => handleSwitchChange(s)}
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
