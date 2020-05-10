import React from 'react';
import Roster from '../../../../models/Roster';
import { store } from 'react-notifications-component';
import RostersTable from './RostersTable';
import RosterParticipantsView from '../participants/RosterParticipantsView';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import AppPaths from '../../../../routes/AppLocations';
import CreateRoster from './CreateRoster';
import RosterAPI from './rosterAPI';

interface State {
    rosters: Roster[];
}

export default class RosterView extends React.Component<RouteComponentProps, State> {
    state: State = {
        rosters: [],
    };

    componentDidMount() {
        RosterAPI.getRosters()
            .then((response) => {
                this.setRosters(response.data);
            })
            .catch(() => {
                store.addNotification({
                    message: 'Failed to load rosters 😢',
                    type: 'danger',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                        duration: 2000,
                        onScreen: true,
                    },
                });
            });
    }

    setRosters(rosters: Roster[]) {
        this.setState({ ...this.state, rosters: rosters });
    }

    render(): JSX.Element {
        const participantsView: JSX.Element = (
            <Route
                path={`${this.props.match.url}/:rosterId`}
                render={(props: RouteComponentProps<{ rosterId: string }>) => {
                    let foundRoster: Roster | undefined = this.state.rosters.find(
                        (roster) => roster.id === props.match.params.rosterId,
                    );
                    if (foundRoster) {
                        return <RosterParticipantsView roster={foundRoster} />;
                    } else {
                        return <Redirect to={AppPaths.rostersPath} />;
                    }
                }}
            ></Route>
        );
        return (
            <>
                <Switch>
                    {this.state.rosters.length > 0 ? participantsView : null}
                    <Route>
                        <CreateRoster />
                        <RostersTable rosters={this.state.rosters} />
                    </Route>
                </Switch>
            </>
        );
    }
}
