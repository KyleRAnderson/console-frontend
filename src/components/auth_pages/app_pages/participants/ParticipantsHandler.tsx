import React, { useState } from 'react';
import { ParticipantPaginatedResponse } from '../../../../api/participantAPI';
import { ParticipantBase } from '../../../../models/Participant';
import PaginatedLoader from '../../../generics/PaginatedLoader';
import ParticipantsTable, { ParticipantsProps } from './ParticipantsTable';
import MiniSignal from 'mini-signals';

export type Props<T extends ParticipantBase> = {
    participantProperties: string[];
    getParticipants: (currentPage: number, recordsPerPage?: number) => Promise<ParticipantPaginatedResponse<T>>;
    participantTable?: (
        tableProps: Pick<ParticipantsProps<T>, 'participantProperties' | 'participants'>,
    ) => React.ReactNode;
    updateSignal?: MiniSignal;
};

export default function ParticipantsHandler<T extends ParticipantBase>(props: Props<T>): JSX.Element {
    const [participants, setParticipants] = useState<T[]>([]);

    const table: React.ReactNode = props.participantTable?.({
        participantProperties: props.participantProperties,
        participants: participants,
    }) || <ParticipantsTable participantProperties={props.participantProperties} participants={participants} />;

    async function getParticipants(page: number, participantsPerPage?: number): Promise<[T[], number]> {
        const response = await props.getParticipants(page, participantsPerPage);
        return [response.participants, response.num_pages];
    }

    return (
        <PaginatedLoader<T>
            getValues={getParticipants}
            updateValues={setParticipants}
            table={table}
            updateSignal={props.updateSignal}
        />
    );
}
