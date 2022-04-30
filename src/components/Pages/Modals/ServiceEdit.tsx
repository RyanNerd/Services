import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useState} from 'reactn';
import {ServiceRecord} from 'types/RecordTypes';

interface IProps {
    onClose: (serviceRecord: ServiceRecord | null) => void;
    show: boolean;
    serviceInfo: ServiceRecord;
}

const ServiceEdit = (props: IProps) => {
    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);
    const onClose = props.onClose;

    const [serviceInfo, setServiceInfo] = useState(props.serviceInfo);
    useEffect(() => {
        if (props.serviceInfo) {
            const info = {...props.serviceInfo};
            if (!info.HmisId) info.HmisId = '';
            setServiceInfo(info);
        }
    }, [props.serviceInfo]);

    const [canSave, setCanSave] = useState(true);
    useEffect(() => {
        setCanSave(document.querySelectorAll('.is-invalid')?.length === 0);
    }, [serviceInfo]);

    if (!serviceInfo) return null;

    return (
        <Modal backdrop="static" show={show} onHide={() => onClose(null)}>
            <Modal.Header closeButton>
                <Modal.Title>{serviceInfo.Id !== null ? 'Edit ' + serviceInfo.ServiceName : 'Add Service'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <FloatingLabel label="Service Name" controlId="serviceName" className="mb-3">
                        <Form.Control
                            autoFocus
                            autoComplete="off"
                            className={serviceInfo.ServiceName !== '' ? '' : 'is-invalid'}
                            type="text"
                            onChange={(changeEvent) =>
                                setServiceInfo({...serviceInfo, ServiceName: changeEvent.target.value})
                            }
                            placeholder="service-name"
                            required
                            value={serviceInfo.ServiceName}
                        />
                        <Form.Control.Feedback type="invalid">Service name can not be blank.</Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel label="HMIS #" controlId="hmis-number" className="mb-3">
                        <Form.Control
                            autoComplete="off"
                            className={serviceInfo.HmisId !== null && serviceInfo.HmisId !== '' ? '' : 'is-invalid'}
                            type="text"
                            onChange={(changeEvent) =>
                                setServiceInfo({...serviceInfo, HmisId: changeEvent.target.value})
                            }
                            placeholder="hmis-number"
                            required
                            value={serviceInfo.HmisId as string}
                        />
                        <Form.Control.Feedback type="invalid">HMIS # can not be blank.</Form.Control.Feedback>
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShow(false);
                        onClose(null);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    disabled={!canSave}
                    onClick={() => {
                        setShow(false);
                        onClose(serviceInfo);
                    }}
                    style={{cursor: canSave ? 'pointer' : 'not-allowed'}}
                    variant="primary"
                >
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ServiceEdit;
