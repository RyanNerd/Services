import dayjs from 'dayjs';
import {IServiceLogProvider} from 'providers/serviceLogProvider';
import {Card, Form, InputGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceLogRecord, ServiceRecord, UNIT_OF_MEASURE} from 'types/RecordTypes';
import {clientFullName} from 'utilities/clientFormatting';

interface IProps {
    activeClient: ClientRecord;
    dateOfService: Date;
    serviceList: ServiceRecord[];
    serviceLogProvider: IServiceLogProvider;
    serviceLogListUpdated?: (serviceLogs: ServiceLogRecord[]) => void;
}

type ServiceLogInputRecord = {
    AllowMultiple: boolean;
    Id: number;
    UnitOfMeasure: UNIT_OF_MEASURE;
    Units: number;
    UnitValue: number;
    ServiceGiven: boolean;
    ServiceId: number;
    ServiceLogRecord: ServiceLogRecord | null;
    ServiceName: string;
};

const ClientServicesCard = (props: IProps) => {
    const serviceLogProvider = props.serviceLogProvider;
    const serviceLogListUpdated = props.serviceLogListUpdated;

    const [dateOfService, setDateOfService] = useState(dayjs(props.dateOfService));
    useEffect(() => {
        setDateOfService(dayjs(props.dateOfService));
    }, [props.dateOfService]);

    const [serviceList, setServiceList] = useState(props.serviceList);
    useEffect(() => {
        setServiceList(props.serviceList);
    }, [props.serviceList]);

    const [serviceLogList, setServiceLogList] = useState<ServiceLogRecord[]>([]);
    const [activeClient, setActiveClient] = useState(props.activeClient);
    useEffect(() => {
        /**
         * Given the clientId set the service log list with the DoS entries
         * @param {number} clientId The client id
         */
        const populateServiceLog = async (clientId: number) => {
            const updatedServiceLogList = await serviceLogProvider.loadForDate(clientId, dateOfService.toDate());
            setServiceLogList(updatedServiceLogList);
        };

        setActiveClient(props.activeClient);
        populateServiceLog(props.activeClient.Id as number);
    }, [dateOfService, props.activeClient, serviceLogListUpdated, serviceLogProvider]);

    /**
     * Rehydrate the serviceLogList and invoke the serviceLogListUpdated() c/b if passed in as a prop
     */
    const populateServiceLog = async () => {
        const updatedServiceLogList = await serviceLogProvider.loadForDate(
            activeClient.Id as number,
            dateOfService.toDate()
        );
        setServiceLogList(updatedServiceLogList);
        if (serviceLogListUpdated) serviceLogListUpdated(updatedServiceLogList);
    };

    // Build out the serviceLogInputList
    const [serviceLogInputList, setServiceLogInputList] = useState([] as ServiceLogInputRecord[]);
    useEffect(() => {
        const logInputList = [] as ServiceLogInputRecord[];
        let count = 0;
        for (const serviceRecord of serviceList) {
            let found = false;
            for (const serviceLogRecord of serviceLogList) {
                if (serviceLogRecord.ServiceId === serviceRecord.Id) {
                    found = true;
                    logInputList.push({
                        AllowMultiple: serviceRecord.AllowMultiple,
                        Id: count++,
                        UnitOfMeasure: serviceLogRecord.UnitOfMeasure,
                        Units: serviceLogRecord.Units,
                        UnitValue: serviceLogRecord.UnitValue,
                        ServiceGiven: true,
                        ServiceId: serviceRecord.Id,
                        ServiceLogRecord: serviceLogRecord,
                        ServiceName: serviceRecord.ServiceName
                    });
                }
            }
            // Even if the service has no service log records we need to add it to the list so it can be selected
            if (!found) {
                logInputList.push({
                    AllowMultiple: false,
                    Id: count++,
                    UnitOfMeasure: UNIT_OF_MEASURE.Count,
                    Units: 1,
                    UnitValue: 1,
                    ServiceGiven: false,
                    ServiceId: serviceRecord.Id as number,
                    ServiceLogRecord: null,
                    ServiceName: serviceRecord.ServiceName
                });
            }
        }
        setServiceLogInputList([...logInputList]);
    }, [serviceList, serviceLogList]);

    /**
     * Add a serviceLog entry when the service switch is set to true
     * @param {number} serviceId The service Id
     */
    const addServiceLog = async (serviceId: number) => {
        await serviceLogProvider.update({
            Id: null,
            ResidentId: activeClient.Id as number,
            ServiceId: serviceId,
            UnitOfMeasure: UNIT_OF_MEASURE.Count,
            Units: 1,
            UnitValue: 1,
            DateOfService: dateOfService.toDate()
        });
        await populateServiceLog();
    };

    /**
     * Remove the serviceLog entry when the service switch is set to false
     * @param {number} serviceLogId The service record Id
     * @returns {Promise<void>}
     */
    const removeServiceLog = async (serviceLogId: number) => {
        await serviceLogProvider.delete(serviceLogId, true);
        await populateServiceLog();
    };

    /**
     * Handle when the toggle switch is changed
     * @param {ServiceLogInputRecord} serviceLogInputRecord The ServiceLogInputRecord
     */
    const handleSwitchChange = (serviceLogInputRecord: ServiceLogInputRecord) => {
        // Is there an existing service log record? If so then remove it, otherwise add a new record.
        if (serviceLogInputRecord.ServiceGiven) removeServiceLog(serviceLogInputRecord.ServiceLogRecord?.Id as number);
        else addServiceLog(serviceLogInputRecord.ServiceId);
    };

    /**
     * Fires as the user changes unit of measure, units, or unit value fields
     * @param {React.ChangeEvent} changeEvent The onChange event
     * @param {ServiceLogRecord} serviceLogRecord The service log record notes to change
     * @param {string} fieldName Name of the field that should be updated.
     */
    const handleOnChange = (changeEvent: React.ChangeEvent, serviceLogRecord: ServiceLogRecord, fieldName: string) => {
        const target = changeEvent.target as HTMLInputElement;
        const value = target.value;
        const cloneServiceLogList = [...serviceLogList];
        for (const [cloneIndex, clonedServiceLog] of cloneServiceLogList.entries()) {
            if (clonedServiceLog.Id === serviceLogRecord.Id) {
                const logItem = cloneServiceLogList[cloneIndex];
                if (logItem[fieldName] !== value) {
                    logItem[fieldName] = value;
                    setServiceLogList(cloneServiceLogList);
                }
            }
        }
    };

    /**
     * Fires when the focus is moved from the unitOfMeasure, units, or unitValue fields
     * @param {ServiceLogRecord} serviceLogRecord The serviceLogRecord to update
     */
    const saveChanges = (serviceLogRecord: ServiceLogRecord) => {
        const updateServiceLog = async () => {
            await serviceLogProvider.update(serviceLogRecord);
            await populateServiceLog();
        };
        updateServiceLog();
    };

    return (
        <Card border="primary">
            <Card.Header>
                Services for{' '}
                <span style={{backgroundColor: 'lawngreen', fontWeight: 'bold'}}>{clientFullName(activeClient)}</span>
                <span> for </span>
                <span style={{fontWeight: 'bold'}}>{dateOfService.format('MM/DD/YYYY')}</span>
            </Card.Header>

            <Card.Body>
                {serviceLogInputList.map((serviceLogInputItem) => {
                    return (
                        <InputGroup key={`services-input-group-${serviceLogInputItem.Id}`} className="my-1">
                            <Form.Check
                                key={`services-checkbox-${serviceLogInputItem.Id}`}
                                checked={serviceLogInputItem.ServiceGiven}
                                onChange={() => handleSwitchChange(serviceLogInputItem)}
                                id={`service-list-checkbox-${serviceLogInputItem.Id}`}
                                name="services"
                                label={serviceLogInputItem.ServiceName}
                                type="switch"
                                value={serviceLogInputItem.Id as number}
                            />

                            {serviceLogInputItem.ServiceGiven && (
                                <>
                                    {serviceLogInputItem.AllowMultiple ? (
                                        <Button
                                            className="mx-2"
                                            size="sm"
                                            onClick={() => addServiceLog(serviceLogInputItem.ServiceId)}
                                            variant="outline-info"
                                        >
                                            +
                                        </Button>
                                    ) : null}

                                    <Form.Select
                                        onChange={(changeEvent) =>
                                            handleOnChange(
                                                changeEvent,
                                                serviceLogInputItem.ServiceLogRecord as ServiceLogRecord,
                                                'UnitOfMeasure'
                                            )
                                        }
                                        onBlur={() =>
                                            saveChanges(serviceLogInputItem.ServiceLogRecord as ServiceLogRecord)
                                        }
                                        size="sm"
                                        className="mx-2"
                                        placeholder="UnitOfMeasure"
                                        value={serviceLogInputItem.UnitOfMeasure || UNIT_OF_MEASURE.Count}
                                    >
                                        <option value={UNIT_OF_MEASURE.Count}>Count</option>
                                        <option value={UNIT_OF_MEASURE.Dollars}>Dollars</option>
                                        <option value={UNIT_OF_MEASURE.Hours}>Hours</option>
                                        <option value={UNIT_OF_MEASURE.Minutes}>Minutes</option>
                                    </Form.Select>

                                    <Form.Control
                                        onChange={(changeEvent) =>
                                            handleOnChange(
                                                changeEvent,
                                                serviceLogInputItem.ServiceLogRecord as ServiceLogRecord,
                                                'Units'
                                            )
                                        }
                                        onBlur={() =>
                                            saveChanges(serviceLogInputItem.ServiceLogRecord as ServiceLogRecord)
                                        }
                                        size="sm"
                                        type="number"
                                        className="mx-2"
                                        placeholder="Units"
                                        value={serviceLogInputItem.Units}
                                    />

                                    <Form.Control
                                        onChange={(changeEvent) =>
                                            handleOnChange(
                                                changeEvent,
                                                serviceLogInputItem.ServiceLogRecord as ServiceLogRecord,
                                                'UnitValue'
                                            )
                                        }
                                        onBlur={() =>
                                            saveChanges(serviceLogInputItem.ServiceLogRecord as ServiceLogRecord)
                                        }
                                        size="sm"
                                        type="number"
                                        className="mx-2"
                                        placeholder="UnitValue"
                                        value={serviceLogInputItem.UnitValue}
                                    />
                                </>
                            )}
                        </InputGroup>
                    );
                })}
            </Card.Body>
        </Card>
    );
};

export default ClientServicesCard;
