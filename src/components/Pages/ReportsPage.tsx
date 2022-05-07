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
    fullName: string;
    lastName: string;
    firstName: string;
    clientInfo: ClientRecord | null;
    service: string;
    dateOfService: string;
    serviceLogRecord: ServiceLogRecord;
};

const ReportsPage = (props: IProps) => {
    const providers = props.providers;
    const clientProvider = providers.clientProvider;
    const serviceLogProvider = providers.serviceLogProvider;
    const previousKey = usePrevious(props.tabKey);

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
                            fullName: clientFullName(clientRecord),
                            firstName: clientRecord.FirstName,
                            lastName: clientRecord.LastName,
                            service: serviceName || '<unknown service>',
                            dateOfService: dos.format('MM/DD/YYYY'),
                            serviceLogRecord
                        });
                    } else {
                        serviceLogReportInfo.push({
                            clientInfo: null,
                            fullName: '<unknown client>',
                            firstName: '<unknown',
                            lastName: '<unknown>',
                            service: serviceName || '<unknown service>',
                            dateOfService: dos.format('MM/DD/YYYY'),
                            serviceLogRecord
                        });
                    }
                } else {
                    const clientInfo = clientRecordList.find((c) => c.Id === serviceLogRecord.ResidentId) || null;
                    const lastName = clientInfo ? clientInfo.LastName : '<unknown>';
                    const firstName = clientInfo ? clientInfo.FirstName : '<unknown>';
                    const fullName = clientInfo ? clientFullName(clientInfo) : '<unknown client>';
                    serviceLogReportInfo.push({
                        clientInfo,
                        fullName,
                        firstName,
                        lastName,
                        service: serviceName || '<unknown service>',
                        dateOfService: dos.format('MM/DD/YYYY'),
                        serviceLogRecord
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

    const ServiceLogGridRow = (serviceLogItem: ServiceLogReportRecord) => {
        const clientInfo = serviceLogItem.clientInfo;
        const clientStyle = clientInfo?.Id ? {color: 'blue', cursor: 'pointer'} : {};
        return (
            <tr key={`service-log-report-item-${serviceLogItem.serviceLogRecord.Id as number}`}>
                <td style={clientStyle} onClick={() => alert('todo: show client modal')}>
                    {serviceLogItem.fullName}
                </td>
                <td>{serviceLogItem.service}</td>
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
            </Card.Header>
            <Card.Body>
                {serviceLogReport !== null && serviceLogReport !== undefined && serviceLogReport.length > 0 ? (
                    <Table bordered hover striped>
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Service</th>
                                <th>DOS</th>
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
        </Card>
    );
};

export default ReportsPage;
