import React from 'react';
import Roster from '../../../../models/Roster';
import { store } from 'react-notifications-component';
import RostersTable from './RostersTable';
import RosterParticipantsView from '../participants/RosterParticipantsView';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import AppPaths from '../../../../routes/AppLocations';
import CreateRoster from './CreateRoster';
import RosterAPI from './rosterAPI';
import Notifications from '../../../../notification';

interface State {
    rosters: Roster[];
}

export default class RosterView extends React.Component<RouteComponentProps, State> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { rosters: [] };
    }

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
                        <RostersTable
                            rosters={this.state.rosters}
                            onDeleteRoster={(roster) => this.deleteRoster(roster)}
                        />
                        <CreateRoster onSuccessfulCreate={(roster) => this.onRosterCreated(roster)} />
                    </Route>
                </Switch>
            </>
        );
    }

    deleteRoster(roster: Roster): void {
        RosterAPI.deleteRoster(roster.id)
            .then(() => {
                let rosters: Roster[] = this.state.rosters.filter((r) => r.id !== roster.id);
                this.setState({ ...this.state, rosters: rosters });
                Notifications.createNotification({ message: 'Roster deleted.', type: 'success' });
            })
            .catch(() => {
                Notifications.createNotification({
                    title: 'Failed to delete roster.',
                    type: 'danger',
                });
            });
    }

    onRosterCreated(roster: Roster): void {
        let rosters: Roster[] = [...this.state.rosters];
        rosters.push(roster);
        this.setState({ ...this.state, rosters: rosters });
    }
}
