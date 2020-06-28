import React, { useRef } from 'react';
import ParticipantAdapter from './ParticipantAdapter';
import Roster from '../../../../models/Roster';
import ParticipantsUploader from './ParticipantsUploader';
import { Container, Row } from 'react-bootstrap';
import MiniSignal from 'mini-signals';

type Props = {
    roster: Roster;
};

export default function ParticipantsView(props: Props): JSX.Element {
    const signal = useRef<MiniSignal>(new MiniSignal());

    function onSuccess(): void {
        signal.current.dispatch();
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <ParticipantsUploader onSuccess={onSuccess} roster={props.roster} />
                </Row>
            </Container>
            <ParticipantAdapter roster={props.roster} updateSignal={signal.current} />
        </>
    );
}
