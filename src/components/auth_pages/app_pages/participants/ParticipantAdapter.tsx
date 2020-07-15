import React, { useEffect, useState } from 'react';
import { getParticipants, ParticipantFilters } from '../../../../api/participantAPI';
import Participant from '../../../../models/Participant';
import Roster from '../../../../models/Roster';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import PaginatedElement from '../../../generics/PaginatedElement';
import ParticipantsTable, { ParticipantsProps } from './ParticipantsTable';

type Props = Pick<ParticipantsProps<Participant>, 'extraColumns'> & {
    roster: Roster;
    /** The text to search for. */
    searchQuery?: string;
    filters?: ParticipantFilters;
    loaded: boolean;
    setLoaded: (loaded: Props['loaded']) => void;
};

export default function ParticipantAdapter({
    roster,
    searchQuery,
    filters,
    extraColumns,
    loaded,
    setLoaded,
}: Props): JSX.Element {
    const [participants, setParticipants] = useState<Participant[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);

    function loadParticipants(): void {
        getParticipants(roster.id, {
            page: currentPage,
            q: searchQuery,
            ...filters,
        }).then(({ data: { participants, num_pages: numPages } }) => {
            setParticipants(participants);
            setNumPages(numPages);
            setLoaded(true);
        });
    }

    // Order of useEffect matters, must set the page to 1 before loading again.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);
    useEffect(loadParticipants, [searchQuery, roster, filters, currentPage]);
    useEffect(() => {
        !loaded && loadParticipants();
    }, [loaded]);

    const participantsTable: React.ReactNode = (
        <LoadUntilReady isLoaded={!!participants}>
            <ParticipantsTable
                participantProperties={roster.participant_properties}
                participants={participants as Participant[]}
                extraColumns={extraColumns}
            />
        </LoadUntilReady>
    );

    return (
        <PaginatedElement currentPage={currentPage} numPages={numPages} onSetPage={setCurrentPage}>
            {participantsTable}
        </PaginatedElement>
    );
}
