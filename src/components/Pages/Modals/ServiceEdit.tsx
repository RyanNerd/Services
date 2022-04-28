import Button from 'react-bootstrap/Button';
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

    return (
        <Modal backdrop="static" show={show}>
            <Modal.Body>
                <p>{JSON.stringify(props.serviceInfo)}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        setShow(false);
                        onClose(null);
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ServiceEdit;
