import React, { useRef, useState } from 'react';
import ParticipantAdapter from './ParticipantAdapter';
import Roster from '../../../../models/Roster';
import ParticipantsUploader from './ParticipantsUploader';
import { Container, Row, Col } from 'react-bootstrap';
import MiniSignal from 'mini-signals';
import SearchBar from '../../../generics/SearchBar';

type Props = {
    roster: Roster;
};

export default function ParticipantsView(props: Props): JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>();
    const signal = useRef<MiniSignal>(new MiniSignal());

    function onSuccess(): void {
        signal.current.dispatch();
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col lg="4" md="6">
                        <ParticipantsUploader onSuccess={onSuccess} roster={props.roster} />
                    </Col>
                    <Col lg="4" md="6">
                        <SearchBar onSearch={setSearchQuery} />
                    </Col>
                </Row>
            </Container>
            <ParticipantAdapter roster={props.roster} updateSignal={signal.current} searchQuery={searchQuery} />
        </>
    );
}
