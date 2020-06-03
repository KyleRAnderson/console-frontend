import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import AppPaths from '../../../../routes/AppPaths';
import HuntAPI from '../../../../api/huntAPI';
import Notifications from '../../../../notification';
import { HuntWithProperties } from '../../../../models/Hunt';
import Loading from '../../../Loading';
import HuntNavigator from './HuntNavigator';
import App from '../../../../channels/matches_channel';
import * as MiniSignal from 'mini-signals';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    hunt?: HuntWithProperties;
};

export default function HuntDetails(props: Props): JSX.Element {
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(undefined);
    const [failedToLoadHunt, setFailedToLoadHunt] = useState<boolean>(false);
    const matchmakeComplete = useRef<MiniSignal>(new MiniSignal());

    function loadHunt(huntId: string) {
        HuntAPI.getHunt(huntId)
            .then(({ data }) => setCurrentHunt(data))
            .catch(() => {
                Notifications.createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
                setFailedToLoadHunt(true);
            });
    }

    function createSubscription(): ActionCable.Channel {
        console.log('Creating subscription');
        return App.cable.subscriptions.create('MatchesChannel', {
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
            received() {
                Notifications.createNotification({ message: 'Matchmaking complete!', type: 'success' });
                matchmakeComplete.current.dispatch();
            },
        });
    }

    useEffect(() => {
        const subscription: ActionCable.Channel = createSubscription();
        let loadedHunt: HuntWithProperties | undefined = props.hunt;
        if (!loadedHunt) {
            if (props.match.params[AppPaths.huntIdParam]) {
                loadHunt(props.match.params[AppPaths.huntIdParam]);
            } else {
                setFailedToLoadHunt(true);
            }
        }

        if (loadedHunt) {
            setCurrentHunt(loadedHunt);
        }

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (!currentHunt) {
        return <Loading />;
    }
    if (failedToLoadHunt) {
        props.history.goBack();
        return <Redirect to={props.history.location} />;
    }

    return <HuntNavigator currentHunt={currentHunt} matchmakingCompleteSignal={matchmakeComplete.current} {...props} />;
}
