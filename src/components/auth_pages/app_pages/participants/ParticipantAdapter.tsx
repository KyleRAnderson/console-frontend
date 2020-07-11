import MiniSignal from 'mini-signals';
import React, { useEffect, useState } from 'react';
import { getParticipants } from '../../../../api/participantAPI';
import Participant from '../../../../models/Participant';
import Roster from '../../../../models/Roster';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import PaginatedElement from '../../../generics/PaginatedElement';
import ParticipantsTable, { ParticipantsProps } from './ParticipantsTable';

type Props = {
    roster: Roster;
    updateSignal?: MiniSignal;
    /** The text to search for. */
    searchQuery?: string;
    extraColumns: ParticipantsProps<Participant>['extraColumns'];
};

export default function ParticipantAdapter(props: Props): JSX.Element {
    const [participants, setParticipants] = useState<Participant[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);

    function loadParticipants(): void {
        getParticipants(props.roster.id, {
            page: currentPage,
            q: props.searchQuery,
        }).then(({ participants, num_pages: numPages }) => {
            setParticipants(participants);
            setNumPages(numPages);
        });
    }

    // Order of useEffect matters, must set the page to 1 before loading again.
    useEffect(() => {
        setCurrentPage(1);
    }, [props.searchQuery]);
    useEffect(loadParticipants, [props.searchQuery, props.roster, currentPage]);

    props.updateSignal?.add(loadParticipants);

    const participantsTable: React.ReactNode = (
        <LoadUntilReady isLoaded={!!participants}>
            <ParticipantsTable
                participantProperties={props.roster.participant_properties}
                participants={participants as Participant[]}
                extraColumns={props.extraColumns}
            />
        </LoadUntilReady>
    );

    return (
        <PaginatedElement currentPage={currentPage} numPages={numPages} onSetPage={setCurrentPage}>
            {participantsTable}
        </PaginatedElement>
    );
}
