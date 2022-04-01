import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {setGlobal} from 'reactn';
import App from './components/App';
import Main from './components/Main';
import getInitialState from './utilities/getInitialState';

const startApp = async () => {
    const initialState = await setGlobal(getInitialState());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
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
