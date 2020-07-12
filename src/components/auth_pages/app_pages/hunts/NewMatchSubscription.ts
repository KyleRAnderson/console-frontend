import { subscribe } from '../../../../channels/matchesChannel';
import Hunt from '../../../../models/Hunt';

export default class NewMatchSubscription {
    subscription: ActionCable.Channel;
    onNewMatches: () => void;

    constructor(hunt: string | Hunt, onNewMatches: () => void) {
        this.onNewMatches = onNewMatches;
        this.subscription = this.createSubscription(hunt);
    }

    private createSubscription(hunt: string | Hunt): ActionCable.Channel {
        return subscribe(hunt, {
            received: this.onNewMatches,
        });
    }

    cleanup() {
        this.subscription.unsubscribe();
    }
}
