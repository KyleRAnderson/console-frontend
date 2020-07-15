import React, { useEffect, useState } from 'react';
import { getLicenses, LicenseFilters } from '../../../../api/licenseAPI';
import License from '../../../../models/License';
import { ParticipantBase } from '../../../../models/Participant';
import { createNotification } from '../../../../notification';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import PaginatedElement from '../../../generics/PaginatedElement';
import ParticipantsTable from '../participants/ParticipantsTable';

export type Props = {
    huntId: string;
    participantProperties: string[];
    filters?: LicenseFilters;
    currentSearch?: string;
};

type ParticipantWithEliminated = ParticipantBase & Pick<License, 'eliminated'>;

export default function LicensesAdapter(props: Props) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [licenses, setLicenses] = useState<ParticipantWithEliminated[]>();

    function loadLicenses(): void {
        getLicenses(props.huntId, { page: currentPage, q: props.currentSearch, ...props.filters })
            .then(({ data: { num_pages: numPages, licenses } }) => {
                setNumPages(numPages);
                setLicenses(
                    licenses.map((license) => {
                        return { ...license.participant, eliminated: license.eliminated };
                    }),
                );
            })
            .catch(() => createNotification({ type: 'danger', message: 'Failed to load licenses' }));
    }

    // Order of hooks here matters. Must update page number before loading.
    useEffect(() => {
        setCurrentPage(1);
    }, [props.filters, props.currentSearch]);

    useEffect(loadLicenses, [currentPage, props.filters, props.currentSearch]);

    const extraColumn: [string, (participant: ParticipantWithEliminated) => string] = [
        'Eliminated',
        (participant) => {
            return participant.eliminated ? 'Yes' : 'No';
        },
    ];

    const participantsTable: React.ReactNode = (
        <LoadUntilReady isLoaded={!!licenses}>
            <ParticipantsTable<ParticipantWithEliminated>
                participantProperties={props.participantProperties}
                participants={licenses as ParticipantWithEliminated[]}
                extraColumns={[extraColumn]}
            />
        </LoadUntilReady>
    );

    return (
        <PaginatedElement currentPage={currentPage} numPages={numPages} onSetPage={setCurrentPage}>
            {participantsTable}
        </PaginatedElement>
    );
}
