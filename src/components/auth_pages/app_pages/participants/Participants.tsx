// All-encompassing view for participants, with API calls and all the surrounding UI.

import React from 'react';
import ParticipantsTable from './ParticipantsTable';
import { Pagination, Container, Row } from 'react-bootstrap';
import ParticipantAPI from './participantAPI';
import { Redirect } from 'react-router-dom';
import Roster from '../../../../models/Roster';
import AppPaths from '../../../../routes/AppPaths';

type Props = {
    roster: Roster;
};

type State = ParticipantAPI.ParticipantPaginatedResponse & {
    currentPage: number;
    failedToLoadRoster: boolean;
};

/**
 * There are three ways via props that a roster can be provided to this component.
 * Way 1: The component could be passed a roster prop directly, either containing the rosterId or a roster object.
 * Way 2: The component could have a rosterId passed to it as a param in the URL. This will require loading the roster.
 */
class ParticipantsView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: 1,
            num_pages: 1,
            participants: [],
            failedToLoadRoster: false,
        };
    }

    componentDidMount() {
        this.loadParticipants();
    }

    loadParticipants() {
        if (this.props.roster) {
            ParticipantAPI.getParticipants(this.props.roster.id, this.state.currentPage).then((response) => {
                this.setState({ ...this.state, ...response.data });
            });
        }
    }

    render(): JSX.Element {
        if (this.state.failedToLoadRoster) {
            return <Redirect to={AppPaths.rostersPath} />;
        }
        if (this.state.participants.length == 0) {
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
                    participant_attributes={this.props.roster.participant_properties}
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

export default ParticipantsView;
