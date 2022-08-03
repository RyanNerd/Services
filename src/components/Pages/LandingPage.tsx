import ClientPage from 'components/Pages/ClientPage';
import HmisIntegration from 'components/Pages/HmisIntegration';
import HmisUsersPage from 'components/Pages/HmisUsersPage';
import LoginPage from 'components/Pages/LoginPage';
import ReportsPage from 'components/Pages/ReportsPage';
import ServicesPage from 'components/Pages/ServicesPage';
import {Authenticated} from 'providers/authenticationProvider';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, {useGlobal, useState} from 'reactn';
import TabContent from 'styles/common.css';

const LandingPage = () => {
    const [, setErrorDetails] = useGlobal('errorDetails');
    const [key, setKey] = useState('login');
    const [providers] = useGlobal('providers');
    const [, setHmisUserList] = useGlobal('hmisUsersList');
    const [serviceList, setServiceList] = useGlobal('serviceList');
    const [signIn, setSignIn] = useState<Authenticated>({apiKey: null, organization: null, success: null});
    const hmisUsersProvider = providers.hmisUsersProvider;
    const serviceProvider = providers.serviceProvider;

    /**
     * Handle when the user has successfully logged in by setting the API and loading the global serviceList
     * @param {Authenticated} authenticated The authenticated object
     */
    const handleSignIn = async (authenticated: Authenticated): Promise<void> => {
        if (authenticated.apiKey) {
            try {
                setSignIn(authenticated);
                await providers.setApi(authenticated.apiKey);
                const serviceList = await serviceProvider.load();
                await setServiceList(serviceList);
                const hmisUsersList = await hmisUsersProvider.load();
                await setHmisUserList(hmisUsersList);
                setKey('client');
            } catch (error: unknown) {
                await setErrorDetails(error);
            }
        }
    };

    return (
        <Tabs className={TabContent} activeKey={key} onSelect={(key) => setKey(key || 'login')}>
            <Tab eventKey="login" title={signIn.apiKey === null ? 'Login' : 'Logout'}>
                {signIn.apiKey === null ? (
                    <LoginPage
                        authenticationProvider={providers.authenticationProvider}
                        onLogin={async (authenticated) => await handleSignIn(authenticated)}
                    />
                ) : (
                    <>
                        <Button onClick={() => location.reload()}>Logout</Button>
                    </>
                )}
            </Tab>

            <Tab
                disabled={!signIn.apiKey}
                eventKey="client"
                id="client-tab"
                title="Client"
                style={{display: !signIn.apiKey ? 'hidden' : 'block'}}
            >
                <ClientPage providers={providers} serviceList={serviceList} tabKey={key} />
            </Tab>

            <Tab disabled={!signIn.apiKey} eventKey="reports" title="Reports">
                <ReportsPage tabKey={key} providers={providers} serviceList={serviceList} />
            </Tab>

            <Tab disabled={!signIn.apiKey} eventKey="services" title="Services">
                <ServicesPage providers={providers} tabKey={key} />
            </Tab>

            <Tab title="HMIS Integration" eventKey="hmis-integration" disabled={!signIn.apiKey}>
                <HmisIntegration tabKey={key} />
            </Tab>

            <Tab disabled={!signIn.apiKey} eventKey="hmis-users" title="HMIS Users">
                <HmisUsersPage providers={providers} tabKey={key} />
            </Tab>
        </Tabs>
    );
};

export default LandingPage;
