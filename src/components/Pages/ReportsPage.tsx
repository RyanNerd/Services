import dayjs from 'dayjs';
import usePrevious from 'hooks/usePrevious';
import {Card} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import React, {useEffect, useState} from 'reactn';
import {ClientRecord, ServiceLogRecord, ServiceRecord} from 'types/RecordTypes';
import {clientFullName} from 'utilities/clientFormatting';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    providers: IProviders;
    serviceList: ServiceRecord[];
    tabKey: string;
}

type ServiceLogReportRecord = {
    clientFullName: string;
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
                            clientFullName: clientFullName(clientRecord),
                            service: serviceName || '<unknown service>',
                            dateOfService: dos.format('MM/DD/YYYY'),
                            serviceLogRecord
                        });
                    } else {
                        serviceLogReportInfo.push({
                            clientFullName: '<unknown>',
                            service: serviceName || '<unknown service>',
                            dateOfService: dos.format('MM/DD/YYYY'),
                            serviceLogRecord
                        });
                    }
                }
            }
            setServiceLogReport([...serviceLogReportInfo]);
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
        return (
            <tr key={`service-log-report-item-${serviceLogItem.serviceLogRecord.Id as number}`}>
                <td>{serviceLogItem.clientFullName}</td>
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
                {serviceLogReport !== null && serviceLogReport !== undefined ? (
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
                    <p>No services to be imported into HMIS</p>
                )}
            </Card.Body>
        </Card>
    );
};

export default ReportsPage;
