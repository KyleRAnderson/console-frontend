import consumer from './consumer';
import ActionCable from 'action-cable-react-jwt';
import Auth from '../auth';

console.log('Subscribing'); // FIXME

const App = {};
App.cable = ActionCable.createConsumer('ws://localhost:3000/cable', Auth.getToken().replace('Bearer', '').trim());

App.cable.subscriptions.create('MatchesChannel', {
    initialized() {
        console.log('Channel initialized.');
    },
    connected() {
        console.log('Channel connected.');
    },
    disconnected() {
        console.log('Disconnected.');
    },
    rejected() {
        console.log('Rejected.');
    },
    update() {
        console.log('Update');
    },
    received(data) {
        console.log(`Received data: ${data}`); // FIXME up
    },
});
