import ClientPage from 'components/Pages/ClientPage';
import LoginPage from 'components/Pages/LoginPage';
import {Authenticated} from 'providers/authenticationProvider';
import Button from 'react-bootstrap/Button';
import React, {useGlobal, useState} from 'reactn';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from 'styles/common.css';

const App = () => {
    const [signIn, setSignIn] = useGlobal('signIn');
    const [providers] = useGlobal('providers');
    const [key, setKey] = useState('login');

    const handleSignIn = async (authenticated: Authenticated) => {
        if (authenticated.apiKey) {
            await setSignIn(authenticated);
            await providers.setApi(authenticated.apiKey);
            setKey('client');
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
                        <Button onClick={() => alert('todo: Logic to sign out')}>Logout</Button>
                    </>
                )}
            </Tab>
            <Tab eventKey="client" title="Client" disabled={!signIn.apiKey}>
                <ClientPage clientProvider={providers.clientProvider} tabKey={key} />
            </Tab>
            <Tab eventKey="settings" title="Settings" disabled={!signIn.apiKey}>
                <p>Settings</p>
            </Tab>
        </Tabs>
    );
};

export default App;
