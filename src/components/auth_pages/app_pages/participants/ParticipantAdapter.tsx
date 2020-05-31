import React from 'react';
import Roster from '../../../../models/Roster';
import ParticipantsHandler, { ParticipantPaginatedResponse } from './ParticipantsHandler';
import ParticipantAPI from '../../../../api/participantAPI';
import Participant from '../../../../models/Participant';

type Props = {
    roster: Roster;
};

export default function ParticipantAdapter(props: Props): JSX.Element {
    function getParticipants(
        currentPage: number,
        recordsPerPage?: number,
    ): Promise<ParticipantPaginatedResponse<Participant>> {
        return ParticipantAPI.getParticipants(props.roster.id, {
            page: currentPage,
            per_page: recordsPerPage,
        }).then(({ data }) => data);
    }
    return (
        <ParticipantsHandler
            participantProperties={props.roster.participant_properties}
            getParticipants={getParticipants}
        />
    );
}
