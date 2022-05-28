import ClientServicesCard from 'components/Pages/Modals/ClientServicesCard';
import {IServiceLogProvider} from 'providers/serviceLogProvider';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceRecord} from 'types/RecordTypes';

interface IProps {
    activeClient: ClientRecord;
    dateOfService: Date;
    onClose: (serviceLogChanged: boolean) => void;
    serviceList: ServiceRecord[];
    serviceLogProvider: IServiceLogProvider;
    show: boolean;
}

const ClientServicesModal = (props: IProps) => {
    const activeClient = props.activeClient;
    const dateOfService = props.dateOfService;
    const onClose = props.onClose;
    const serviceLogProvider = props.serviceLogProvider;
    const serviceList = props.serviceList;
    const [serviceLogChanged, setServiceLogChanged] = useState(false);

    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);

    return (
        <Modal
            size="xl"
            show={show}
            onHide={() => {
                setShow(false);
                onClose(serviceLogChanged);
            }}
            backdrop="static"
        >
            <Modal.Header closeButton />
            <Modal.Body>
                <ClientServicesCard
                    activeClient={activeClient}
                    dateOfService={dateOfService}
                    serviceList={serviceList}
                    serviceLogProvider={serviceLogProvider}
                    serviceLogListUpdated={() => setServiceLogChanged(true)}
                />
            </Modal.Body>
        </Modal>
    );
};

export default ClientServicesModal;
