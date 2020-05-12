// All-encompassing view for participants, with API calls and all the surrounding UI.

import React from 'react';
import ParticipantsTable from './ParticipantsTable';
import { Pagination, Container, Row } from 'react-bootstrap';
import ParticipantAPI from './participantAPI';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import Roster from '../../../../models/Roster';
import AppPaths from '../../../../routes/AppPaths';
import RosterAPI from '../rosters/rosterAPI';

type RosterParticipantsProps = RouteComponentProps<{ [key: string]: string }, any, { roster?: Roster }> & {
    roster?: Roster | string;
};

type State = ParticipantAPI.ParticipantPaginatedResponse & {
    currentPage: number;
    currentRoster: Roster | null;
    failedToLoadRoster: boolean;
};

/**
 * There are three ways via props that a roster can be provided to this component.
 * Way 1: The component could be passed a roster prop directly, either containing the rosterId or a roster object.
 * Way 2: The component could have a rosterId passed to it as a param in the URL. This will require loading the roster.
 * Way 3: Upon redirect, there may be a roster provided if the place of redirection had them loaded.
 */
class RosterParticipantsView extends React.Component<RosterParticipantsProps, State> {
    constructor(props: RosterParticipantsProps) {
        super(props);
        this.state = {
            currentPage: 1,
            num_pages: 1,
            participants: [],
            currentRoster: null,
            failedToLoadRoster: false,
        };
    }

    componentDidMount() {
        let roster: Roster | string = '';

        // Check the roster prop, as first priority.
        if (this.props.roster) {
            roster = this.props.roster;
        }
        // Then check the redirect param.
        else if (this.props.location.state.roster) {
            roster = this.props.location.state.roster;
        }
        // Last check the URL param.
        else if (this.props.match.params[AppPaths.rosterIdParam]) {
            roster = this.props.match.params[AppPaths.rosterIdParam];
        }
        // Otherwise the roster shall remain null and we have to redirect out of here.

        if (typeof roster === 'string') {
            this.loadRoster(roster);
        } else {
            this.setState({ ...this.state, currentRoster: roster }, () => this.loadParticipants());
        }
    }

    loadRoster(rosterId: string): void {
        RosterAPI.getRoster(rosterId)
            .then((response) => {
                this.setState({ ...this.state, currentRoster: response.data }, () => this.loadParticipants());
            })
            .catch(() => {
                this.setState({ ...this.state, failedToLoadRoster: true });
            });
    }

    loadParticipants() {
        if (this.state.currentRoster) {
            ParticipantAPI.getParticipants(this.state.currentRoster.id, this.state.currentPage).then((response) => {
                this.setState({ ...this.state, ...response.data });
            });
        }
    }

    render(): JSX.Element {
        if (this.state.failedToLoadRoster) {
            return <Redirect to={AppPaths.rostersPath} />;
        } else if (!this.state.currentRoster) {
            return <h1>Loading...</h1>;
        }

        let paginationItems: JSX.Element[] = [];
        for (let i = 1; i <= this.state.num_pages; i++) {
            paginationItems.push(
                <Pagination.Item key={i} active={i === this.state.currentPage} onClick={() => this.setPage(i)}>
                    {i}
                </Pagination.Item>,
            );
        }

        return (
            <>
                <ParticipantsTable
                    participant_attributes={this.state.currentRoster.participant_properties}
                    participants={this.state.participants}
                />
                <Container>
                    <Row className="justify-content-center">
                        <Pagination>
                            <Pagination.First onClick={() => this.setPage(1)} />
                            {paginationItems}
                            <Pagination.Last onClick={() => this.setPage(this.state.num_pages)} />
                        </Pagination>
                    </Row>
                </Container>
            </>
        );
    }

    setPage(page: number) {
        let state: State = { ...this.state };
        state.currentPage = page;
        this.setState(state, () => this.loadParticipants());
    }
}

export default RosterParticipantsView;
