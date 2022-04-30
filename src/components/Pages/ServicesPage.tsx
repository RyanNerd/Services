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
    const [deleteAllowed, setDeleteAllowed] = useState(false);

    const addEditService = async (serviceRecord: ServiceRecord) => {
        if (serviceRecord.Id !== null) {
            const serviceLogList = await serviceProvider.serviceLogs(serviceRecord.Id);
            setDeleteAllowed(serviceLogList.length === 0);
        } else {
            setDeleteAllowed(false);
        }
        setShowServiceEdit(serviceRecord);
    };

    return (
        <>
            <Card border="info" style={{width: '35%'}}>
                <Card.Header>
                    {'Services List'}
                    <Button
                        size="sm"
                        variant="info"
                        className="mx-2"
                        onClick={() => addEditService({...newServiceRecord})}
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
                                    onClick={() => addEditService({...sl})}
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
                        // If the serviceRecord.Id is negative then it indicates the record should be destroyed
                        if (serviceRecord.Id === null || serviceRecord.Id > 0) {
                            await serviceProvider.update(serviceRecord);
                            await setServiceList(await serviceProvider.load());
                        } else {
                            await serviceProvider.delete(Math.abs(serviceRecord.Id as number));
                            await setServiceList(await serviceProvider.load());
                        }
                    }
                }}
                show={showServiceEdit !== null}
                deleteAllowed={deleteAllowed}
                serviceInfo={showServiceEdit as ServiceRecord}
            />
        </>
    );
};

export default ServicesPage;
