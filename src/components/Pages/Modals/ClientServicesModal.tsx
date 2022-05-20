import ClientServicesCard from 'components/Pages/Modals/ClientServicesCard';
import {IServiceLogProvider} from 'providers/serviceLogProvider';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceRecord} from 'types/RecordTypes';

interface IProps {
    activeClient: ClientRecord;
    dateOfService: Date;
    serviceList: ServiceRecord[];
    serviceLogProvider: IServiceLogProvider;
    onClose: () => void;
    show: boolean;
}

const ClientServicesModal = (props: IProps) => {
    const activeClient = props.activeClient;
    const dateOfService = props.dateOfService;
    const onClose = props.onClose;
    const serviceLogProvider = props.serviceLogProvider;
    const serviceList = props.serviceList;
    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);

    return (
        <Modal
            show={show}
            onHide={() => {
                setShow(false);
                onClose();
            }}
        >
            <Modal.Body>
                <ClientServicesCard
                    activeClient={activeClient}
                    dateOfService={dateOfService}
                    serviceList={serviceList}
                    serviceLogProvider={serviceLogProvider}
                />
            </Modal.Body>
        </Modal>
    );
};

export default ClientServicesModal;
