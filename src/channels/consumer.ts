// app/javascript/channels/consumer.js
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.

import { createConsumer } from '@rails/actioncable';
import { Cable } from 'actioncable';
import * as ApiPaths from '../routes/ApiPaths';

type AppCable = {
    cable: Cable;
};

const App: AppCable = { cable: createConsumer(ApiPaths.CABLE_PATH) };
export default App;
