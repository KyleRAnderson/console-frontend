import { subscribe } from '../../../../channels/matchesChannel';
import Hunt from '../../../../models/Hunt';

export default class NewMatchSubscription {
    subscription: ActionCable.Channel;
    onNewMatches: (obj: unknown) => void;

    constructor(hunt: string | Hunt, onNewMatches: NewMatchSubscription['onNewMatches']) {
        this.onNewMatches = onNewMatches;
        this.subscription = this.createSubscription(hunt);
    }

    private createSubscription(hunt: string | Hunt): ActionCable.Channel {
        return subscribe(hunt, {
            received: this.onNewMatches,
        });
    }

    cleanup(): void {
        this.subscription.unsubscribe();
    }
}
