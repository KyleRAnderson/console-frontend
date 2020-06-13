import React from 'react';
import ParticipantsHandler, { ParticipantPaginatedResponse } from '../participants/ParticipantsHandler';
import { ParticipantBase } from '../../../../models/Participant';
import License from '../../../../models/License';
import ParticipantsTable from '../participants/ParticipantsTable';
import { getLicenses } from '../../../../api/licenseAPI';

type Props = {
    huntId: string;
    participantProperties: string[];
};

type ParticipantWithEliminated = ParticipantBase & Pick<License, 'eliminated'>;

export default function LicensesAdapter(props: Props) {
    async function loadLicenses(
        currentPage: number,
        recordsPerPage?: number,
    ): Promise<ParticipantPaginatedResponse<ParticipantWithEliminated>> {
        const { data } = await getLicenses(props.huntId, { page: currentPage, per_page: recordsPerPage });
        return {
            num_pages: data.num_pages,
            participants: data.licenses.map((license) => {
                return { ...license.participant, eliminated: license.eliminated };
            }),
        };
    }

    const extraColumn: [string, (participant: ParticipantWithEliminated) => string] = [
        'Eliminated',
        (participant) => {
            return participant.eliminated ? 'Yes' : 'No';
        },
    ];

    function participantsTableGenerator({
        participantProperties,
        participants,
    }: {
        participantProperties: string[];
        participants: ParticipantWithEliminated[];
    }): React.ReactNode {
        return (
            <ParticipantsTable
                participantProperties={participantProperties}
                participants={participants}
                extraColumns={[extraColumn]}
            />
        );
    }

    return (
        <ParticipantsHandler
            getParticipants={loadLicenses}
            participantProperties={props.participantProperties}
            participantTable={participantsTableGenerator}
        />
    );
}
