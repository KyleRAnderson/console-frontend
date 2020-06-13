import Hunt from '../../../../models/Hunt';
import React from 'react';
import { createNotification } from '../../../../notification';
import HuntsTable from './HuntsTable';
import { Button } from 'react-bootstrap';
import CreateHunt from './CreateHunt';
import { getHunts, HuntPost, createHunt, HuntErrorResponse, asHuntError, deleteHunt } from '../../../../api/huntAPI';

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
        getHunts(this.props.rosterId)
            .then((response) => {
                this.setState({ ...this.state, hunts: response.data });
            })
            .catch(() => {
                createNotification({ message: 'Error loading hunts.', type: 'danger' });
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

    createHunt(hunt: HuntPost): void {
        createHunt(this.props.rosterId, hunt)
            .then(({ data }) => {
                createNotification({ message: 'Successfully created hunt.', type: 'success' });
                this.setState({ ...this.state, hunts: [...this.state.hunts, data] });
            })
            .catch((error) => {
                const errorCasted: HuntErrorResponse | undefined = asHuntError(error);
                let title: string | undefined;
                let errorMessage = 'Failed to create hunt';
                if (errorCasted && errorCasted.response && errorCasted.response.data.detail.hunt.length > 0) {
                    title = errorMessage;
                    errorMessage = errorCasted.response.data.detail.hunt.join('\n');
                }
                createNotification({ title: title, message: errorMessage });
            });
    }

    deleteHunt(hunt: Hunt): void {
        deleteHunt(hunt.id)
            .then(() => {
                createNotification({ message: 'Successfully deleted hunt', type: 'success' });
                const newHuntsList = [...this.state.hunts];
                newHuntsList.splice(this.state.hunts.indexOf(hunt), 1);
                this.setState({ ...this.state, hunts: newHuntsList });
            })
            .catch(() => {
                createNotification({ message: 'Failed to delete hunt.', type: 'danger' });
            });
    }
}

export default HuntsList;
