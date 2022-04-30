import ServiceEdit from 'components/Pages/Modals/ServiceEdit';
import {Card, ListGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, {useGlobal, useState} from 'reactn';
import {newServiceRecord, ServiceRecord} from 'types/RecordTypes';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    providers: IProviders;
}

const ServicesPage = (props: IProps) => {
    const [serviceList, setServiceList] = useGlobal('serviceList');
    const serviceProvider = props.providers.serviceProvider;
    const [showServiceEdit, setShowServiceEdit] = useState<ServiceRecord | null>(null);

    return (
        <>
            <Card border="info" style={{width: '35%'}}>
                <Card.Header>
                    {'Services List'}
                    <Button
                        size="sm"
                        variant="info"
                        className="mx-2"
                        onClick={() => setShowServiceEdit({...newServiceRecord})}
                    >
                        + Add Service
                    </Button>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {serviceList.map((sl) => {
                            return (
                                <ListGroup.Item
                                    action
                                    onClick={() => setShowServiceEdit({...sl})}
                                    key={`service-list-item-${sl.Id}`}
                                >
                                    <span>{`${sl.ServiceName} - HMIS# ${sl.HmisId}`}</span>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>

            <ServiceEdit
                onClose={async (serviceRecord) => {
                    setShowServiceEdit(null);
                    if (serviceRecord !== null) {
                        await serviceProvider.update(serviceRecord);
                        await setServiceList(await serviceProvider.load());
                    }
                }}
                show={showServiceEdit !== null}
                serviceInfo={showServiceEdit as ServiceRecord}
            />
        </>
    );
};

export default ServicesPage;
