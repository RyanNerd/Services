import ServiceEdit from 'components/Pages/Modals/ServiceEdit';
import {Card, ListGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, {useGlobal, useState} from 'reactn';
import {newServiceRecord, ServiceRecord} from 'types/RecordTypes';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    providers: IProviders;
    tabKey: string;
}

const ServicesPage = (props: IProps) => {
    const serviceProvider = props.providers.serviceProvider;
    const tabKey = props.tabKey;
    const [deleteAllowed, setDeleteAllowed] = useState(false);
    const [serviceList, setServiceList] = useGlobal('serviceList');
    const [showServiceEdit, setShowServiceEdit] = useState<ServiceRecord | null>(null);

    /**
     * Fires when the user is editing an existing service or adding a new service
     * @param {ServiceRecord} serviceRecord The service record object to add or edit
     */
    const addEditService = async (serviceRecord: ServiceRecord) => {
        // Is this is an existing Service?
        if (serviceRecord.Id !== null) {
            // Check if there are any service log records to determine if service can be deleted
            const serviceLogList = await serviceProvider.serviceLogs(serviceRecord.Id);
            setDeleteAllowed(serviceLogList.length === 0); // Delete
        } else {
            setDeleteAllowed(false);
        }
        setShowServiceEdit(serviceRecord);
    };

    if (tabKey !== 'services') return null;

    return (
        <>
            <Card border="info" style={{width: '35%'}} as={Form}>
                <Card.Header>
                    {'Services List'}
                    <Button
                        className="mx-2"
                        onClick={(mouseEvent) => {
                            mouseEvent.preventDefault();
                            addEditService({...newServiceRecord});
                        }}
                        size="sm"
                        variant="info"
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
                                    id={`service-list-item-${sl.Id}`}
                                    key={`service-list-item-${sl.Id}`}
                                    onClick={(mouseEvent) => {
                                        mouseEvent.preventDefault();
                                        addEditService({...sl});
                                    }}
                                >
                                    <Form.Group>
                                        <span>{`${sl.ServiceName} - HMIS# ${sl.HmisId}`}</span>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Check
                                            disabled={true}
                                            type="switch"
                                            value={sl.Id as number}
                                            checked={sl.AllowMultiple}
                                            label="Allow Multiple Services on the same day"
                                        />
                                    </Form.Group>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>

            <ServiceEdit
                deleteAllowed={deleteAllowed}
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
                serviceInfo={showServiceEdit as ServiceRecord}
                show={showServiceEdit !== null}
            />
        </>
    );
};

export default ServicesPage;
