import Hunt from '../../../../models/Hunt';
import React from 'react';
import { createNotification } from '../../../../notification';
import HuntsTable from './HuntsTable';
import { Button } from 'react-bootstrap';
import CreateHunt from './CreateHunt';
import { getHunts, HuntPost, createHunt, deleteHunt } from '../../../../api/huntAPI';
import BlockLoader from '../../../generics/BlockLoader';
import ServerError, { formatForPrint, asServerError } from '../../../../models/ServerError';

type HuntsProps = {
    rosterId: string;
    onHuntSelect?: (hunt: Hunt) => void;
    hunts: Hunt[] | undefined;
    /** Function to call with the loaded hunts, for state storage. */
    onHuntsUpdated: (hunts: Hunt[]) => void;
};

export default class HuntsList extends React.Component<HuntsProps> {
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
                loadFunction={() => getHunts(this.props.rosterId).then(({ data: hunts }) => hunts)}
                onLoaded={(hunts) => this.setHunts(hunts)}
                onError={() => this.onError()}
                isLoaded={this.props.hunts !== undefined}
            >
                <HuntsTable hunts={this.props.hunts as Hunt[]} actionButtons={actionButtons} />
                <CreateHunt onSubmission={(hunt) => this.createHunt(hunt)} />
            </BlockLoader>
        );
    }

    setHunts(hunts: Hunt[]): void {
        this.props.onHuntsUpdated(hunts);
    }

    onError(): void {
        createNotification({ message: 'Error loading hunts.', type: 'danger' });
    }

    goToHunt(hunt: Hunt) {
        this.props.onHuntSelect?.(hunt);
    }

    createHunt(hunt: HuntPost): void {
        createHunt(this.props.rosterId, hunt)
            .then(({ data: newHunt }) => {
                createNotification({ message: 'Successfully created hunt.', type: 'success' });
                this.props.onHuntsUpdated([...(this.props.hunts || []), newHunt]);
            })
            .catch((error) => {
                let title: string | undefined;
                let errorMessage = 'Failed to create hunt';
                const errorCasted: ServerError | undefined = asServerError(error);
                if (errorCasted) {
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
                const newHuntsList = [...(this.props.hunts || [])];
                newHuntsList.splice(newHuntsList.indexOf(hunt), 1);
                this.props.onHuntsUpdated(newHuntsList);
            })
            .catch(() => {
                createNotification({ message: 'Failed to delete hunt.', type: 'danger' });
            });
    }
}
