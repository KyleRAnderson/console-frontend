import React from 'react';
import Roster from '../../../../models/Roster';
import RostersTable from './RostersTable';
import CreateRoster from './CreateRoster';
import { createNotification } from '../../../../notification';
import { Button } from 'react-bootstrap';
import { getRosters, deleteRoster } from '../../../../api/rosterAPI';

type State = {
    rosters: Roster[];
};

type Props = {
    onRosterSelect: (roster: Roster) => void;
};

export default class RostersList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { rosters: [] };
    }

    componentDidMount(): void {
        getRosters()
            .then(({ data: rosters }) => {
                this.setRosters(rosters);
            })
            .catch(() => {
                createNotification({
                    message: 'Failed to load rosters 😢',
                    type: 'danger',
                });
            });
    }

    setRosters(rosters: Roster[]): void {
        this.setState({ ...this.state, rosters: rosters });
    }

    render(): JSX.Element {
        const actionButtons: (roster: Roster) => React.ReactNode = (roster) => {
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

        return (
            <>
                <RostersTable rosters={this.state.rosters} actionButtons={actionButtons} />
                <CreateRoster onSuccessfulCreate={(roster) => this.onRosterCreated(roster)} />
            </>
        );
    }

    deleteRoster(roster: Roster): void {
        deleteRoster(roster.id)
            .then(() => {
                const rosters: Roster[] = this.state.rosters.filter((r) => r.id !== roster.id);
                this.setState({ ...this.state, rosters: rosters });
                createNotification({ message: 'Roster deleted.', type: 'success' });
            })
            .catch(() => {
                createNotification({
                    message: 'Failed to delete roster.',
                    type: 'danger',
                });
            });
    }

    setRosterToView(roster: Roster): void {
        this.props.onRosterSelect(roster);
    }

    onRosterCreated(roster: Roster): void {
        const rosters: Roster[] = [...this.state.rosters];
        rosters.push(roster);
        this.setState({ ...this.state, rosters: rosters });
    }
}
