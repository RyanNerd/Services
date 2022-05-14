import ClientEdit from 'components/Pages/Modals/ClientEdit';
import dayjs from 'dayjs';
import usePrevious from 'hooks/usePrevious';
import {Card, Spinner} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
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
    dateOfService: string;
    firstName: string;
    fullName: string;
    lastName: string;
    service: string;
    serviceLogRecord: ServiceLogRecord;
    sortDate: string;
};

const ReportsPage = (props: IProps) => {
    const providers = props.providers;
    const clientProvider = providers.clientProvider;
    const serviceLogProvider = providers.serviceLogProvider;
    const previousKey = usePrevious(props.tabKey);
    const [clientModalInfo, setClientModalInfo] = useState<ClientRecord | null>(null);
    const [clientSortDirection, setClientSortDirection] = useState(true);
    const [dosSortDirection, setDosSortDirection] = useState(true);
    const [serviceSortDirection, setServiceSortDirection] = useState(true);

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
                const serviceName = serviceList.find(
                    (serviceRecord) => serviceRecord.Id === serviceLogRecord.ServiceId
                )?.ServiceName;
                if (!clientRecordList.some((c) => c.Id === serviceLogRecord.ResidentId)) {
                    const clientRecord = await clientProvider.read(serviceLogRecord.ResidentId);
                    if (clientRecord) {
                        clientRecordList.push(clientRecord);
                        serviceLogReportInfo.push({
                            clientInfo: clientRecord,
                            dateOfService: dos.format('MM/DD/YYYY'),
                            firstName: clientRecord.FirstName,
                            fullName: clientFullName(clientRecord),
                            lastName: clientRecord.LastName,
                            service: serviceName || '<unknown service>',
                            serviceLogRecord,
                            sortDate: dos.format('YYYY-MM-DD')
                        });
                    } else {
                        serviceLogReportInfo.push({
                            clientInfo: null,
                            dateOfService: dos.format('MM/DD/YYYY'),
                            firstName: '<unknown',
                            fullName: '<unknown client>',
                            lastName: '<unknown>',
                            service: serviceName || '<unknown service>',
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
                        dateOfService: dos.format('MM/DD/YYYY'),
                        firstName,
                        fullName,
                        lastName,
                        service: serviceName || '<unknown service>',
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

    if (tabKey !== 'reports') return null;

    /**
     * Service Log Row
     * @param {ServiceLogReportRecord} serviceLogItem The service log report record to render
     */
    const ServiceLogGridRow = (serviceLogItem: ServiceLogReportRecord) => {
        const clientInfo = serviceLogItem.clientInfo;
        const clientStyle = clientInfo?.Id ? {color: 'blue', cursor: 'pointer'} : {};
        return (
            <tr key={`service-log-report-item-${serviceLogItem.serviceLogRecord.Id as number}`}>
                <td style={clientStyle} onClick={() => setClientModalInfo(serviceLogItem.clientInfo)}>
                    {serviceLogItem.fullName}
                </td>
                <td onClick={() => alert('todo: Edit Services')}>
                    <span style={clientStyle}>
                        {serviceLogItem.service}
                        <br />
                    </span>
                    <span>{serviceLogItem.serviceLogRecord.Notes}</span>
                </td>
                <td>{serviceLogItem.dateOfService}</td>
            </tr>
        );
    };

    return (
        <Card border="info">
            <Card.Header>
                <span>Service Logs</span>
                <Button
                    className="mx-3"
                    disabled={
                        serviceLogReport === undefined || serviceLogReport === null || serviceLogReport.length === 0
                    }
                    onClick={() => alert('todo: Perform Import')}
                >
                    Import all to HMIS
                </Button>
                <Card.Subtitle className="my-1">Click on the table headers to sort</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                {serviceLogReport !== null && serviceLogReport !== undefined && serviceLogReport.length > 0 ? (
                    <Table bordered hover striped>
                        <thead>
                            <tr>
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
                    onClose={() => setClientModalInfo(null)}
                    show={true}
                />
            )}
        </Card>
    );
};

export default ReportsPage;
