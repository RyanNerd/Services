import ClientEdit from 'components/Pages/Modals/ClientEdit';
import ClientServicesModal from 'components/Pages/Modals/ClientServicesModal';
import dayjs from 'dayjs';
import usePrevious from 'hooks/usePrevious';
import {Card, Spinner} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientFullName} from 'utilities/clientFormatting';
import {IProviders} from 'utilities/getInitialState';
import {multiSort, SortDirection} from 'utilities/multiSort';

interface IProps {
    providers: IProviders;
    serviceList: ServiceRecord[];
    tabKey: string;
}

type ServiceLogReportRecord = {
    clientInfo: ClientRecord | null;
    clientHmis: string | null;
    clientEnrollment: string | null;
    dateOfService: string;
    firstName: string;
    fullName: string;
    id: number;
    lastName: string;
    selected: boolean;
    serviceName: string;
    serviceHmisId: string;
    serviceLogRecord: ServiceLogRecord;
    sortDate: string;
    [key: string]: unknown;
};

const ReportsPage = (props: IProps) => {
    const providers = props.providers;
    const clientProvider = providers.clientProvider;
    const serviceLogProvider = providers.serviceLogProvider;
    const previousKey = usePrevious(props.tabKey);
    const [clientModalInfo, setClientModalInfo] = useState<ClientRecord | null>(null);
    const [clientSortDirection, setClientSortDirection] = useState(true);
    const [dosSortDirection, setDosSortDirection] = useState(true);
    const [serviceLogSelectAll, setServiceLogSelectAll] = useState(false);
    const [serviceSortDirection, setServiceSortDirection] = useState(true);
    const [showServiceLogModal, setShowServiceLogModal] = useState<ServiceLogReportRecord | null>(null);

    const [serviceList, setServiceList] = useState(props.serviceList);
    useEffect(() => {
        setServiceList(props.serviceList);
    }, [props.serviceList, setServiceList]);

    const [serviceLogReport, setServiceLogReport] = useState<ServiceLogReportRecord[] | null>();
    useEffect(() => {
        const populateServiceLogReport = async () => {
            const serviceLogReportInfo = [] as ServiceLogReportRecord[];
            const clientRecordList = [] as ClientRecord[];
            const serviceLogLoad = await serviceLogProvider.loadAll();
            for (const serviceLogRecord of serviceLogLoad) {
                const serviceLogUpdated = serviceLogRecord.Updated ?? '';
                const dos = dayjs(new Date(serviceLogUpdated));
                const serviceRecord = serviceList.find(
                    (serviceRecord) => serviceRecord.Id === serviceLogRecord.ServiceId
                );
                const serviceName = serviceRecord?.ServiceName;
                const serviceHmisId = serviceRecord?.HmisId || '';
                if (!clientRecordList.some((c) => c.Id === serviceLogRecord.ResidentId)) {
                    const clientRecord = await clientProvider.read(serviceLogRecord.ResidentId);
                    if (clientRecord) {
                        clientRecordList.push(clientRecord);
                        serviceLogReportInfo.push({
                            clientInfo: clientRecord,
                            clientEnrollment: clientRecord.EnrollmentId,
                            clientHmis: clientRecord.HMIS,
                            dateOfService: dos.format('MM/DD/YYYY'),
                            firstName: clientRecord.FirstName,
                            fullName: clientFullName(clientRecord),
                            id: serviceLogRecord.Id as number,
                            lastName: clientRecord.LastName,
                            selected: false,
                            serviceHmisId,
                            serviceName: serviceName || '<unknown service>',
                            serviceLogRecord,
                            sortDate: dos.format('YYYY-MM-DD')
                        });
                    } else {
                        serviceLogReportInfo.push({
                            clientInfo: null,
                            clientEnrollment: null,
                            clientHmis: null,
                            dateOfService: dos.format('MM/DD/YYYY'),
                            firstName: '<unknown',
                            fullName: '<unknown client>',
                            lastName: '<unknown>',
                            id: serviceLogRecord.Id as number,
                            selected: false,
                            serviceHmisId,
                            serviceName: serviceName || '<unknown service>',
                            serviceLogRecord,
                            sortDate: dos.format('YYYY-MM-DD')
                        });
                    }
                } else {
                    const clientInfo = clientRecordList.find((c) => c.Id === serviceLogRecord.ResidentId) || null;
                    const lastName = clientInfo ? clientInfo.LastName : '<unknown>';
                    const firstName = clientInfo ? clientInfo.FirstName : '<unknown>';
                    const fullName = clientInfo ? clientFullName(clientInfo) : '<unknown client>';
                    serviceLogReportInfo.push({
                        clientInfo,
                        clientEnrollment: clientInfo?.EnrollmentId || null,
                        clientHmis: clientInfo?.HMIS || null,
                        dateOfService: dos.format('MM/DD/YYYY'),
                        firstName,
                        fullName,
                        lastName,
                        id: serviceLogRecord.Id as number,
                        selected: false,
                        serviceHmisId,
                        serviceName: serviceName || '<unknown service>',
                        serviceLogRecord,
                        sortDate: dos.format('YYYY-MM-DD')
                    });
                }
            }
            setServiceLogReport([
                ...multiSort(serviceLogReportInfo, {fullName: SortDirection.desc, service: SortDirection.desc})
            ]);
        };

        if (serviceLogReport === null) populateServiceLogReport();
    }, [clientProvider, serviceList, serviceLogProvider, serviceLogReport]);

    const [tabKey, setTabKey] = useState(props.tabKey);
    useEffect(() => {
        setTabKey(props.tabKey);
        if (props.tabKey !== previousKey && props.tabKey === 'reports') setServiceLogReport(null);
    }, [previousKey, props.tabKey]);

    const [allowImport, setAllowImport] = useState(false);
    useEffect(() => {
        if (serviceLogReport) {
            setAllowImport(serviceLogReport.some((serviceLogReportRecord) => serviceLogReportRecord.selected));
        } else {
            setServiceLogSelectAll(false);
            setAllowImport(false);
        }
    }, [serviceLogReport, serviceLogSelectAll]);

    if (tabKey !== 'reports') return null;

    /**
     * Service Log Row
     * @param {ServiceLogReportRecord} serviceLogItem The service log report record to render
     */
    const ServiceLogGridRow = (serviceLogItem: ServiceLogReportRecord) => {
        const clientInfo = serviceLogItem.clientInfo;
        const clientStyle = clientInfo?.Id ? {color: 'blue', cursor: 'pointer'} : {};
        const serviceLogId = serviceLogItem.id;
        return (
            <tr key={`service-log-report-item-${serviceLogId}`}>
                <td>
                    <Form.Check
                        disabled={
                            serviceLogItem.serviceHmisId?.length === 0 ||
                            serviceLogItem.clientHmis === null ||
                            serviceLogItem.EnrollmentId === null
                        }
                        type="switch"
                        value={serviceLogId}
                        checked={serviceLogItem.selected}
                        onChange={() => {
                            if (serviceLogReport) {
                                const cloneServiceLogReport = [...serviceLogReport];
                                for (const serviceLogReportItem of cloneServiceLogReport) {
                                    if (serviceLogReportItem.id === serviceLogId) {
                                        serviceLogReportItem.selected = !serviceLogReportItem.selected;
                                        setServiceLogReport([...cloneServiceLogReport]);
                                        break;
                                    }
                                }
                            }
                        }}
                    />
                </td>
                <td style={clientStyle} onClick={() => setClientModalInfo(serviceLogItem.clientInfo)}>
                    {serviceLogItem.fullName}
                </td>
                <td onClick={() => setShowServiceLogModal(serviceLogItem)}>
                    <span style={clientStyle}>
                        {serviceLogItem.serviceName}
                        <br />
                    </span>
                </td>
                <td>{serviceLogItem.dateOfService}</td>
            </tr>
        );
    };

    return (
        <Card border="info">
            <Card.Header>
                <span>Service Logs</span>
                <Button className="mx-3" disabled={!allowImport} onClick={() => alert('todo: Perform Import')}>
                    Import into HMIS
                </Button>
                <Card.Subtitle className="my-1">Click on the table headers to sort</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                {serviceLogReport !== null && serviceLogReport !== undefined && serviceLogReport.length > 0 ? (
                    <Table bordered hover striped>
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        checked={serviceLogSelectAll}
                                        label="Select"
                                        onChange={() => {
                                            for (const [, serviceLogReportRecord] of serviceLogReport.entries())
                                                serviceLogReportRecord.selected =
                                                    serviceLogReportRecord.clientHmis === null ||
                                                    false ||
                                                    serviceLogReportRecord.serviceHmisId?.length === 0
                                                        ? false
                                                        : !serviceLogSelectAll;
                                            setServiceLogSelectAll(!serviceLogSelectAll);
                                        }}
                                        type="switch"
                                        value={serviceLogSelectAll ? 1 : 0}
                                    />
                                </th>
                                <th
                                    onClick={() => {
                                        setClientSortDirection(!clientSortDirection);
                                        setServiceLogReport([
                                            ...multiSort(serviceLogReport, {
                                                fullName: clientSortDirection ? SortDirection.desc : SortDirection.asc,
                                                service: SortDirection.desc
                                            })
                                        ]);
                                    }}
                                    style={{cursor: 'pointer', userSelect: 'none'}}
                                >
                                    Client
                                </th>
                                <th
                                    onClick={() => {
                                        setServiceSortDirection(!serviceSortDirection);
                                        setServiceLogReport([
                                            ...multiSort(serviceLogReport, {
                                                service: serviceSortDirection ? SortDirection.desc : SortDirection.asc,
                                                sortDate: SortDirection.desc
                                            })
                                        ]);
                                    }}
                                    style={{cursor: 'pointer', userSelect: 'none'}}
                                >
                                    Service
                                </th>
                                <th
                                    onClick={() => {
                                        setDosSortDirection(!dosSortDirection);
                                        setServiceLogReport([
                                            ...multiSort(serviceLogReport, {
                                                sortDate: dosSortDirection ? SortDirection.desc : SortDirection.asc,
                                                fullName: SortDirection.desc
                                            })
                                        ]);
                                    }}
                                    style={{cursor: 'pointer', userSelect: 'none'}}
                                >
                                    DOS
                                </th>
                            </tr>
                        </thead>
                        <tbody>{serviceLogReport.map((serviceLogItem) => ServiceLogGridRow(serviceLogItem))}</tbody>
                    </Table>
                ) : (
                    <>
                        {serviceLogReport !== undefined && serviceLogReport?.length === 0 ? (
                            <p>No services to be imported into HMIS</p>
                        ) : (
                            <span>
                                <Spinner animation="grow" />
                                {' Loading...'}
                            </span>
                        )}
                    </>
                )}
            </Card.Body>

            {clientModalInfo !== null && (
                <ClientEdit
                    clientInfo={clientModalInfo as ClientRecord}
                    clientProvider={clientProvider}
                    onClose={(clientUpdated) => {
                        setClientModalInfo(null);
                        if (clientUpdated) setServiceLogReport(null);
                    }}
                    show={true}
                />
            )}

            {showServiceLogModal !== null && showServiceLogModal.serviceLogRecord.Updated && (
                <ClientServicesModal
                    show={true}
                    onClose={(reloadNeeded) => {
                        setShowServiceLogModal(null);
                        if (reloadNeeded) setServiceLogReport(null);
                    }}
                    activeClient={showServiceLogModal.clientInfo as ClientRecord}
                    dateOfService={showServiceLogModal.serviceLogRecord.DateOfService}
                    serviceList={serviceList}
                    serviceLogProvider={serviceLogProvider}
                />
            )}
        </Card>
    );
};

export default ReportsPage;
