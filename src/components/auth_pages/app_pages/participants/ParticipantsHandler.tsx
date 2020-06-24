import React from 'react';
import ParticipantsTable, { ParticipantsProps } from './ParticipantsTable';
import { ParticipantBase } from '../../../../models/Participant';
import GenericPaginated from '../../../GenericPaginated';
import { ParticipantPaginatedResponse } from '../../../../api/participantAPI';

type Props<T extends ParticipantBase> = {
    participantProperties: string[];
    getParticipants: (currentPage: number, recordsPerPage?: number) => Promise<ParticipantPaginatedResponse<T>>;
    participantTable?: (
        tableProps: Pick<ParticipantsProps<T>, 'participantProperties' | 'participants'>,
    ) => React.ReactNode;
};

export default function ParticipantsHandler<T extends ParticipantBase>(props: Props<T>): JSX.Element {
    function getTable(participants: T[]): React.ReactNode {
        return (
            props.participantTable?.({
                participantProperties: props.participantProperties,
                participants: participants,
            }) || <ParticipantsTable participantProperties={props.participantProperties} participants={participants} />
        );
    }

    async function getParticipants(page: number, participantsPerPage?: number): Promise<[T[], number]> {
        const response = await props.getParticipants(page, participantsPerPage);
        return [response.participants, response.num_pages];
    }

    return <GenericPaginated<T> getValues={getParticipants} table={getTable} />;
}
