import React from 'react';
import ParticipantAdapter from './ParticipantAdapter';
import Roster from '../../../../models/Roster';
import ParticipantsUploader from './ParticipantsUploader';
import { Container, Row } from 'react-bootstrap';

type Props = {
    roster: Roster;
};

export default function ParticipantsView(props: Props): JSX.Element {
    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <ParticipantsUploader roster={props.roster} />
                </Row>
            </Container>
            <ParticipantAdapter roster={props.roster} />
        </>
    );
}
