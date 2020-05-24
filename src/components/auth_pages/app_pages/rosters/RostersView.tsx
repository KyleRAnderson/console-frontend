import React from 'react';
import Roster from '../../../../models/Roster';
import { store } from 'react-notifications-component';
import RostersTable from './RostersTable';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import CreateRoster from './CreateRoster';
import RosterAPI from './rosterAPI';
import Notifications from '../../../../notification';
import { Button } from 'react-bootstrap';
import AppPaths from '../../../../routes/AppPaths';

interface State {
    rosters: Roster[];
    rosterToView: Roster | null;
}

export default class RosterView extends React.Component<RouteComponentProps, State> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { rosters: [], rosterToView: null };
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
        const actionButtons: (roster: Roster) => JSX.Element = (roster) => {
            return (
                <>
                    <Button variant="outline-secondary" type="button" onClick={() => this.setRosterToView(roster)}>
                        View
                    </Button>
                    <Button variant="outline-danger" type="button" onClick={() => this.deleteRoster(roster)}>
                        Delete
                    </Button>
                </>
            );
        };

        const rostersTable: JSX.Element = (
            <>
                <RostersTable rosters={this.state.rosters} actionButtons={actionButtons} />
                <CreateRoster onSuccessfulCreate={(roster) => this.onRosterCreated(roster)} />
            </>
        );

        return this.state.rosterToView ? (
            <Redirect
                push
                to={{
                    pathname: AppPaths.rosterPath(this.state.rosterToView.id),
                    state: {
                        roster: this.state.rosterToView,
                    },
                }}
            />
        ) : (
            rostersTable
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

    setRosterToView(roster: Roster): void {
        this.setState({ ...this.state, rosterToView: roster });
    }

    onRosterCreated(roster: Roster): void {
        let rosters: Roster[] = [...this.state.rosters];
        rosters.push(roster);
        this.setState({ ...this.state, rosters: rosters });
    }
}
