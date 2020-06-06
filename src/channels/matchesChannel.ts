import Hunt from '../models/Hunt';
import App from './consumer';
import getId from '../util/identifiableHelper';

export function subscribe(hunt: Hunt | string, obj?: ActionCable.CreateMixin): ActionCable.Channel {
    return App.cable.subscriptions.create({ channel: 'MatchesChannel', hunt_id: getId(hunt) }, obj);
}
