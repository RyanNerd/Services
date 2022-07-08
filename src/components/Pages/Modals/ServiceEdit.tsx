import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useRef, useState} from 'reactn';
import {ServiceRecord} from 'types/RecordTypes';

interface IProps {
    deleteAllowed: boolean;
    onClose: (serviceRecord: ServiceRecord | null) => void;
    serviceInfo: ServiceRecord;
    show: boolean;
}

const ServiceEdit = (props: IProps) => {
    const deleteAllowed = props.deleteAllowed;
    const [canSave, setCanSave] = useState(false);

    const serviceNameReference = useRef<HTMLInputElement>(null);
    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);
    const onClose = props.onClose;

    const [serviceInfo, setServiceInfo] = useState(props.serviceInfo);
    useEffect(() => {
        if (props.serviceInfo) {
            const info = {...props.serviceInfo};
            if (info.HmisId === null) info.HmisId = 0;
            if (info.ServiceName === null) info.ServiceName = '';
            setServiceInfo(info);
        }
    }, [props.serviceInfo]);

    useEffect(() => {
        setCanSave(document.querySelectorAll('.is-invalid')?.length === 0);
    }, [serviceInfo]);

    if (!serviceInfo) return null;

    return (
        <Modal
            backdrop="static"
            show={show}
            onHide={() => onClose(null)}
            onEnter={() => serviceNameReference?.current?.focus()}
        >
            <Modal.Header closeButton>
                <Modal.Title>{serviceInfo.Id !== null ? 'Edit ' + serviceInfo.ServiceName : 'Add Service'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <FloatingLabel label="Service Name" controlId="serviceName" className="mb-3">
                        <Form.Control
                            autoComplete="off"
                            autoFocus
                            className={serviceInfo.ServiceName !== '' ? '' : 'is-invalid'}
                            type="text"
                            onChange={(changeEvent) =>
                                setServiceInfo({...serviceInfo, ServiceName: changeEvent.target.value})
                            }
                            ref={serviceNameReference}
                            placeholder="service-name"
                            required
                            value={serviceInfo.ServiceName}
                        />
                        <Form.Control.Feedback type="invalid">Service name can not be blank.</Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel label="HMIS #" controlId="hmis-number" className="mb-3">
                        <Form.Control
                            autoComplete="off"
                            className={serviceInfo.HmisId !== null && serviceInfo.HmisId > 0 ? '' : 'is-invalid'}
                            onChange={(changeEvent) =>
                                setServiceInfo({...serviceInfo, HmisId: Number.parseInt(changeEvent.target.value)})
                            }
                            placeholder="hmis-number"
                            required
                            type="number"
                            value={serviceInfo.HmisId || undefined}
                        />
                        <Form.Control.Feedback type="invalid">HMIS # can not be blank.</Form.Control.Feedback>
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {deleteAllowed && (
                    <Button
                        className="mx-5"
                        onClick={() => {
                            setShow(false);
                            const info = {...serviceInfo};
                            info.Id = -(info.Id as number);
                            onClose(info);
                        }}
                        variant="danger"
                    >
                        Delete
                    </Button>
                )}
                <Button
                    onClick={() => {
                        setShow(false);
                        onClose(null);
                    }}
                    variant="secondary"
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
