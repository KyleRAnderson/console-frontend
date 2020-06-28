import React from 'react';
import ErrorParticipant from '../../../../models/ErrorParticipant';
import { toSentenceArray } from '../../../../models/ServerError';
import { Container, Row } from 'react-bootstrap';

type Props = {
    errors: ErrorParticipant[];
};

export default function ParticipantErrors(props: Props): JSX.Element {
    return (
        <Container fluid>
            {props.errors.map((participant, i) => {
                return (
                    <React.Fragment key={i}>
                        <Row>
                            <h5 className="text-capitalize">
                                {participant.first} {participant.last}
                            </h5>
                        </Row>
                        <Row>
                            <ul>
                                {toSentenceArray(participant.errors).map((sentence, j) => {
                                    return <li key={j}>{sentence}</li>;
                                })}
                            </ul>
                        </Row>
                    </React.Fragment>
                );
            })}
        </Container>
    );
}
