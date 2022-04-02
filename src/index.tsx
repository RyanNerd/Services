import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {setGlobal} from 'reactn';
import App from './components/App';
import Main from './components/Main';
import getInitialState from './utilities/getInitialState';
import {createRoot} from 'react-dom/client';
const startApp = async () => {
    const initialState = await setGlobal(getInitialState());
    const root = createRoot(document.getElementById('root') as HTMLDivElement);
    root.render(
        <React.StrictMode>
            {/* eslint-disable-next-line no-console */}
            <Main callback={() => console.log('Services app started', initialState)}>
                <App />
            </Main>
        </React.StrictMode>
    );
};

startApp();
