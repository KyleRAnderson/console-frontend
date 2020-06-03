// app/javascript/channels/consumer.js
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.

import { createConsumer } from '@rails/actioncable';
import { Cable } from 'actioncable';
import Auth from '../auth';

type AppType = {
    cable: Cable;
};

function getWebsocketUrl(): string {
    return `ws://${location.host}/cable?auth_token=${Auth.getToken(false)}`;
}

const App: AppType = { cable: createConsumer(getWebsocketUrl) };
export default App;
