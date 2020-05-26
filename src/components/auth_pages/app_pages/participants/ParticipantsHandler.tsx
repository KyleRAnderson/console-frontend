// All-encompassing view for participants, with API calls and all the surrounding UI.

import React from 'react';
import ParticipantsTable, { ParticipantsProps } from './ParticipantsTable';
import { Pagination, Container, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AppPaths from '../../../../routes/AppPaths';
import { ParticipantBase } from '../../../../models/Participant';

export type ParticipantPaginatedResponse<U extends ParticipantBase> = {
    participants: U[];
    num_pages: number;
};

type Props<T extends ParticipantBase> = {
    participantProperties: string[];
    getParticipants: (currentPage: number, recordsPerPage?: number) => Promise<ParticipantPaginatedResponse<T>>;
    participantTable?: (
        tableProps: Pick<ParticipantsProps<T>, 'participantProperties' | 'participants'>,
    ) => JSX.Element;
};

type State<T extends ParticipantBase> = {
    participants: T[];
    currentPage: number;
    failedToLoadRoster: boolean;
    num_pages: number;
};

/**
 * There are three ways via props that a roster can be provided to this component.
 * Way 1: The component could be passed a roster prop directly, either containing the rosterId or a roster object.
 * Way 2: The component could have a rosterId passed to it as a param in the URL. This will require loading the roster.
 */
class ParticipantsHandler<T extends ParticipantBase> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
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
        this.props.getParticipants(this.state.currentPage).then((response) => {
            this.setState({ ...this.state, ...response });
        });
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

        const defaultTable: JSX.Element = (
            <ParticipantsTable
                participantProperties={this.props.participantProperties}
                participants={this.state.participants}
            />
        );

        return (
            <>
                {this.props.participantTable?.({
                    participantProperties: this.props.participantProperties,
                    participants: this.state.participants,
                }) || defaultTable}

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
        this.setState({ ...this.state, currentPage: page }, () => this.loadParticipants());
    }
}

export default ParticipantsHandler;
