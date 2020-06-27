import Hunt from '../../../../models/Hunt';
import React from 'react';
import { createNotification } from '../../../../notification';
import HuntsTable from './HuntsTable';
import { Button } from 'react-bootstrap';
import CreateHunt from './CreateHunt';
import { getHunts, HuntPost, createHunt, deleteHunt } from '../../../../api/huntAPI';
import BlockLoader from '../../../generics/BlockLoader';
import ServerError, { formatForPrint } from '../../../../models/ServerError';

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
            <BlockLoader<Hunt[]>
                loadFunction={() => getHunts(this.props.rosterId)}
                onLoaded={(hunts) => this.setHunts(hunts)}
                onError={() => this.onError()}
                isLoaded={this.state.hunts.length > 0}
            >
                <HuntsTable hunts={this.state.hunts} actionButtons={actionButtons} />
                <CreateHunt onSubmission={(hunt) => this.createHunt(hunt)} />
            </BlockLoader>
        );
    }

    setHunts(hunts: Hunt[]): void {
        this.setState({ ...this.state, hunts: hunts });
    }

    onError(): void {
        createNotification({ message: 'Error loading hunts.', type: 'danger' });
    }

    goToHunt(hunt: Hunt) {
        this.props.onHuntSelect?.(hunt);
    }

    createHunt(hunt: HuntPost): void {
        createHunt(this.props.rosterId, hunt)
            .then((hunts) => {
                createNotification({ message: 'Successfully created hunt.', type: 'success' });
                this.setState({ ...this.state, hunts: [...this.state.hunts, hunts] });
            })
            .catch((error) => {
                let title: string | undefined;
                let errorMessage = 'Failed to create hunt';
                if (error) {
                    const errorCasted: ServerError = error as ServerError;
                    title = errorMessage;
                    errorMessage = formatForPrint(errorCasted.detail);
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
