import LoginPage from 'components/Pages/LoginPage';
import React, {useGlobal} from 'reactn';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from 'styles/common.css';

const App = () => {
    const [signIn, setSignIn] = useGlobal('signIn');
    const [providers] = useGlobal('providers');

    return (
        <Tabs className={TabContent}>
            <Tab eventKey="login" title="Login">
                <LoginPage
                    authenticationProvider={providers.authenticationProvider}
                    onLogin={(authenticated) => setSignIn(authenticated)}
                />
            </Tab>
            <Tab eventKey="client" title="Client" disabled={!signIn.apiKey}>
                <p>Client Lookup {signIn.organization}</p>
            </Tab>
            <Tab eventKey="settings" title="Settings" disabled={!signIn.apiKey}>
                <p>Settings</p>
            </Tab>
        </Tabs>
    );
};

export default App;
