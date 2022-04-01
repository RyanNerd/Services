import React from 'reactn';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from 'styles/common.css';

const App = () => {
    return (
        <Tabs className={TabContent}>
            <Tab eventKey="login" title="Login">
                <p>Login Place Holder</p>
            </Tab>
            <Tab eventKey="client" title="Client">
                <p>Client Lookup</p>
            </Tab>
            <Tab eventKey="settings" title="Settings">
                <p>Settings</p>
            </Tab>
        </Tabs>
    );
};

export default App;
