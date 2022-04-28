import ClientPage from 'components/Pages/ClientPage';
import LoginPage from 'components/Pages/LoginPage';
import ServicesPage from 'components/Pages/ServicesPage';
import {Authenticated} from 'providers/authenticationProvider';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, {useGlobal, useState} from 'reactn';
import TabContent from 'styles/common.css';

const LandingPage = () => {
    const [signIn, setSignIn] = useGlobal('signIn');
    const [providers] = useGlobal('providers');
    const [key, setKey] = useState('login');
    const [serviceList, setServiceList] = useGlobal('serviceList');
    const [, setErrorDetails] = useGlobal('errorDetails');

    const handleSignIn = async (authenticated: Authenticated) => {
        if (authenticated.apiKey) {
            try {
                await setSignIn(authenticated);
                await providers.setApi(authenticated.apiKey);
                const serviceList = await providers.serviceProvider.load();
                await setServiceList(serviceList);
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

            <Tab eventKey="client" title="Client" disabled={!signIn.apiKey}>
                <ClientPage providers={providers} serviceList={serviceList} tabKey={key} />
            </Tab>

            <Tab eventKey="reports" title="Reports" disabled={!signIn.apiKey}>
                <p>Reports place holder</p>
            </Tab>

            <Tab eventKey="services" title="Services" disabled={!signIn.apiKey}>
                <ServicesPage providers={providers} />
            </Tab>
        </Tabs>
    );
};

export default LandingPage;
