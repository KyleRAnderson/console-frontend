import { useEffect, useRef } from 'react';
import Hunt from '../../../../models/Hunt';
import Notifications from '../../../../notification';
import MiniSignal from 'mini-signals';
import { subscribe } from '../../../../channels/matchesChannel';

type Props = {
    hunt: string | Hunt;
    children?: (signal: MiniSignal) => JSX.Element | null;
};

export default function HuntSubscriptionHolder(props: Props): JSX.Element | null {
    const matchmakeComplete = useRef<MiniSignal>(new MiniSignal());

    function createSubscription(): ActionCable.Channel {
        console.log('Creating subscription');
        return subscribe(props.hunt, {
            received() {
                Notifications.createNotification({ message: 'Matchmaking complete!', type: 'success' });
                matchmakeComplete.current.dispatch();
            },
        });
    }

    useEffect(() => {
        let channel: ActionCable.Channel = createSubscription();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return props.children?.(matchmakeComplete.current) || null;
}
