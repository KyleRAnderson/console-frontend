import Hunt from '../../../../models/Hunt';
import React from 'react';
import HuntAPI from '../../../../api/huntAPI';
import Notifications from '../../../../notification';
import HuntsTable from './HuntsTable';
import { Button } from 'react-bootstrap';
import CreateHunt from './CreateHunt';

type State = {
    hunts: Hunt[];
};

type HuntsProps = {
    rosterId: string;
    onHuntSelect?: (hunt: Hunt) => void;
};

class HuntsList extends React.Component<HuntsProps, State> {
    constructor(props: HuntsProps) {
        super(props);
        this.state = {
            hunts: [],
        };
    }

    componentDidMount() {
        HuntAPI.getHunts(this.props.rosterId)
            .then((response) => {
                this.setState({ ...this.state, hunts: response.data });
            })
            .catch(() => {
                Notifications.createNotification({ message: 'Error loading hunts.', type: 'danger' });
            });
    }

    render() {
        const actionButtons: (hunt: Hunt) => React.ReactNode = (hunt) => {
            return (
                <>
                    <Button type="button" variant="outline-primary" onClick={() => this.goToHunt(hunt)}>
                        View
                    </Button>
                    <Button type="button" variant="outline-danger" onClick={() => this.deleteHunt(hunt)}>
                        Delete
                    </Button>
                </>
            );
        };

        return (
            <>
                <HuntsTable hunts={this.state.hunts} actionButtons={actionButtons} />
                <CreateHunt onSubmission={(hunt) => this.createHunt(hunt)} />
            </>
        );
    }
    goToHunt(hunt: Hunt) {
        this.props.onHuntSelect?.(hunt);
    }

    createHunt(hunt: HuntAPI.HuntPost): void {
        HuntAPI.createHunt(this.props.rosterId, hunt)
            .then(({ data }) => {
                Notifications.createNotification({ message: 'Successfully created hunt.', type: 'success' });
                this.setState({ ...this.state, hunts: [...this.state.hunts, data] });
            })
            .catch((error) => {
                let errorCasted: HuntAPI.HuntErrorResponse | undefined = HuntAPI.asHuntError(error);
                let title: string | undefined;
                let errorMessage: string = 'Failed to create hunt';
                if (errorCasted && errorCasted.response && errorCasted.response.data.detail.hunt.length > 0) {
                    title = errorMessage;
                    errorMessage = errorCasted.response.data.detail.hunt.join('\n');
                }
                Notifications.createNotification({ title: title, message: errorMessage });
            });
    }

    deleteHunt(hunt: Hunt): void {
        HuntAPI.deleteHunt(hunt.id)
            .then(() => {
                Notifications.createNotification({ message: 'Successfully deleted hunt', type: 'success' });
                const newHuntsList = [...this.state.hunts];
                newHuntsList.splice(this.state.hunts.indexOf(hunt), 1);
                this.setState({ ...this.state, hunts: newHuntsList });
            })
            .catch(() => {
                Notifications.createNotification({ message: 'Failed to delete hunt.', type: 'danger' });
            });
    }
}

export default HuntsList;
