import React from 'react';
import Roster from '../../../../models/Roster';
import { store } from 'react-notifications-component';
import RostersTable from './RostersTable';
import { RouteComponentProps, Route, Switch } from 'react-router-dom';
import CreateRoster from './CreateRoster';
import RosterAPI from './rosterAPI';
import Notifications from '../../../../notification';
import { Button } from 'react-bootstrap';
import AppPaths from '../../../../routes/AppPaths';
import RosterDetails from './RosterDetails';

type State = {
    rosters: Roster[];
};

type Props = RouteComponentProps & {
    onRosterSelect: (roster: Roster) => void;
    rosterToView?: Roster;
};

export default class Rosters extends React.Component<Props, State> {
    constructor(props: Props) {
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
        const actionButtons: (roster: Roster) => JSX.Element = (roster) => {
            return (
                <>
                    <Button variant="outline-primary" type="button" onClick={() => this.setRosterToView(roster)}>
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

        return (
            <>
                <Switch>
                    <Route
                        path={AppPaths.rosterPath()}
                        render={(props) => {
                            return <RosterDetails roster={this.props.rosterToView} {...props} />;
                        }}
                    ></Route>
                    <Route>{rostersTable}</Route>
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
                    message: 'Failed to delete roster.',
                    type: 'danger',
                });
            });
    }

    setRosterToView(roster: Roster): void {
        this.props.onRosterSelect(roster);
        this.props.history.push(AppPaths.rosterPath(roster));
    }

    onRosterCreated(roster: Roster): void {
        let rosters: Roster[] = [...this.state.rosters];
        rosters.push(roster);
        this.setState({ ...this.state, rosters: rosters });
    }
}
