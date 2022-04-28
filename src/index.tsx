import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {setGlobal} from 'reactn';
import LandingPage from 'components/Pages/LandingPage';
import App from 'components/App';
import getInitialState from './utilities/getInitialState';
import {createRoot} from 'react-dom/client';
const startApp = async () => {
    await setGlobal(getInitialState());
    const root = createRoot(document.getElementById('root') as HTMLDivElement);
    root.render(
        <React.StrictMode>
            {/* eslint-disable-next-line no-console */}
            <App>
                <LandingPage />
            </App>
        </React.StrictMode>
    );
};

startApp();
