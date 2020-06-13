import React from 'react';
import Routes from '../routes/Index';
import 'react-notifications-component/dist/theme.css';
import ReactNotifications from 'react-notifications-component';

export default function App(): JSX.Element {
    return (
        <>
            <ReactNotifications />
            <Routes />
        </>
    );
}
