// All-encompassing view for participants, with API calls and all the surrounding UI.

import React from 'react';
import Roster from '../../../../models/Roster';
import Participant from '../../../../models/Participant';
import Axios from 'axios';
import * as apiPaths from '../../../../routes/ApiPaths';
import ParticipantsTable from './ParticipantsTable';
import { Pagination } from 'react-bootstrap';
import * as Auth from '../../../../auth';

export interface RosterParticipantsProps {
    roster: Roster;
}

interface State extends ParticipantsPaginatedResponse {
    current_page: number;
}

interface ParticipantsPaginatedResponse {
    num_pages: number;
    participants: Participant[];
}

/**
 * Gets the index path of the participants for the given roster.
 * @param rosterID The ID of the roster for which the participants should be collected.
 * @returns The path string.
 */
function getParticipantsPath(rosterID: string): string {
    return `${apiPaths.rostersPath}${rosterID}${apiPaths.participantsExtension}`;
}

export default class RosterParticipantsView extends React.Component<RosterParticipantsProps, State> {
    componentDidMount() {
        this.updateParticipants();
    }

    updateParticipants() {
        Axios.get<ParticipantsPaginatedResponse>(getParticipantsPath(this.props.roster.id), {
            headers: {
                Authorization: Auth.getToken(),
            },
            params: {
                page: this.state.current_page,
            },
        }).then((response) => {
            this.setState(response.data);
        });
    }

    render(): JSX.Element {
        let paginationItems: JSX.Element[] = [<Pagination.First onClick={() => this.setPage(1)} />];
        for (let i = 1; i <= this.state.num_pages; i++) {
            paginationItems.push(
                <Pagination.Item key={i} active={i === this.state.current_page} onClick={() => this.setPage(i)}>
                    {i}
                </Pagination.Item>,
            );
        }
        paginationItems.push(<Pagination.Last onClick={() => this.setPage(this.state.num_pages)} />);

        return (
            <>
                <ParticipantsTable
                    participant_attributes={this.props.roster.participant_properties}
                    participants={this.state.participants}
                />
                <Pagination>{paginationItems}</Pagination>
            </>
        );
    }

    setPage(page: number) {
        let state: State = { ...this.state };
        state.current_page = page;
        this.setState(state, () => this.updateParticipants());
    }
}
