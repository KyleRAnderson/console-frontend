import React from 'react';
import Roster from '../../../../models/Roster';
import ParticipantsHandler from './ParticipantsHandler';
import Participant from '../../../../models/Participant';
import { getParticipants, ParticipantPaginatedResponse } from '../../../../api/participantAPI';

type Props = {
    roster: Roster;
};

export default function ParticipantAdapter(props: Props): JSX.Element {
    async function loadParticipants(
        currentPage: number,
        recordsPerPage?: number,
    ): Promise<ParticipantPaginatedResponse<Participant>> {
        const data = await getParticipants(props.roster.id, {
            page: currentPage,
            per_page: recordsPerPage,
        });
        return data;
    }
    return (
        <ParticipantsHandler
            participantProperties={props.roster.participant_properties}
            getParticipants={loadParticipants}
        />
    );
}
