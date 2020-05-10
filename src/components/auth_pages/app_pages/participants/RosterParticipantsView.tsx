// All-encompassing view for participants, with API calls and all the surrounding UI.

import React from 'react';
import Roster from '../../../../models/Roster';
import ParticipantsTable from './ParticipantsTable';
import { Pagination } from 'react-bootstrap';
import ParticipantAPI from './participantAPI';

export interface RosterParticipantsProps {
    roster: Roster;
}

type State = ParticipantAPI.ParticipantPaginatedResponse & {
    current_page: number;
};

export default class RosterParticipantsView extends React.Component<RosterParticipantsProps, State> {
    state: State = {
        current_page: 1,
        num_pages: 0,
        participants: [],
    };

    componentDidMount() {
        this.loadParticipants();
    }

    loadParticipants() {
        ParticipantAPI.getParticipants(this.props.roster.id).then((response) => {
            this.setState({ ...this.state, ...response.data });
        });
    }

    render(): JSX.Element {
        let paginationItems: JSX.Element[] = [];
        for (let i = 1; i <= this.state.num_pages; i++) {
            paginationItems.push(
                <Pagination.Item key={i} active={i === this.state.current_page} onClick={() => this.setPage(i)}>
                    {i}
                </Pagination.Item>,
            );
        }

        return (
            <>
                <ParticipantsTable
                    participant_attributes={this.props.roster.participant_properties}
                    participants={this.state.participants}
                />
                <Pagination>
                    <Pagination.First onClick={() => this.setPage(1)} />
                    {paginationItems}
                    <Pagination.Last onClick={() => this.setPage(this.state.num_pages)} />
                </Pagination>
            </>
        );
    }

    setPage(page: number) {
        let state: State = { ...this.state };
        state.current_page = page;
        this.setState(state, () => this.loadParticipants());
    }
}
