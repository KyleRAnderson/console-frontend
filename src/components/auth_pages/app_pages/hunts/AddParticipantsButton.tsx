import React from 'react';
import { Button } from 'react-bootstrap';
import { ParticipantFilters } from '../../../../api/participantAPI';
import Hunt from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';

export type Props = Omit<React.ComponentProps<typeof Button>, 'children' | 'onClick' | 'href'> & {
    hunt: Hunt;
};

const EXCLUDE_HUNT_ID_KEY: keyof ParticipantFilters = 'exclude_hunt_id';

export default function AddParticipantsButton({ hunt, ...buttonProps }: Props): JSX.Element {
    // Regex to replace the last slash, if there is one.
    const rosterPath = AppPaths.rosterPath(hunt.roster_id).replace(/\/$/, '');
    const searchQuery = new URLSearchParams();
    searchQuery.set(EXCLUDE_HUNT_ID_KEY, hunt.id);
    const totalUrl = `${rosterPath}?${searchQuery.toString()}`;

    return (
        <Button {...buttonProps} href={totalUrl}>
            Add Participants
        </Button>
    );
}
