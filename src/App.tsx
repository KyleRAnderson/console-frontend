import React from 'react';
import ReactNotifications from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import './App.scss';
import Routes from './routes/Index';

export default function App(): JSX.Element {
    return (
        <div className="App">
            <ReactNotifications />
            <Routes />
        </div>
    );
}
