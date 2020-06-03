import ActionCable from 'action-cable-react-jwt';
import ActionCableTypes from 'actioncable';
import Auth from '../auth';

type AppType = {
    cable: ActionCableTypes.Cable;
};

const App: AppType = { cable: ActionCable.createConsumer(`ws://${location.host}/cable`, Auth.getToken(false)) };
export default App;
