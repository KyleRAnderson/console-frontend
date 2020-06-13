import React, { useState } from 'react';
import MatchAPI from '../../../../api/matchAPI';
import { Container, Card, Form, Button, Row, CardColumns, Col } from 'react-bootstrap';

export type Props = {
    participantProperties: string[];
    onSubmit?: (matchmakeParams: Required<MatchAPI.MatchmakeParams>) => void;
};

type PropertyTracker = {
    [property: string]: string;
};

const WITHIN_LABEL: string = 'Within';
const BETWEEN_LABEL: string = 'Between';
const NONE_LABEL: string = 'None';

export default function MatchmakeForm(props: Props): JSX.Element {
    const startingTracker: PropertyTracker = props.participantProperties.reduce<PropertyTracker>((total, property) => {
        total[property] = NONE_LABEL;
        return total;
    }, {});
    const [matchmakingParams, setMatchmakingParams] = useState<PropertyTracker>(startingTracker);

    function onClick(property: string, label: string): void {
        let paramsCopy = { ...matchmakingParams };
        paramsCopy[property] = label;
        setMatchmakingParams(paramsCopy);
    }

    function generatePropertyCard(property: string): React.ReactNode {
        function generateRadioCheck(label: string): React.ReactNode {
            return (
                <Form.Check
                    name={`${property}_checkboxes`}
                    inline
                    label={label}
                    type="radio"
                    key={`${property}_${label}`}
                    checked={matchmakingParams[property] === label}
                    onChange={() => onClick(property, label)}
                />
            );
        }

        return (
            <Card key={property}>
                <Card.Body>
                    <Card.Title>{property}</Card.Title>
                    {[NONE_LABEL, WITHIN_LABEL, BETWEEN_LABEL].map(generateRadioCheck)}
                </Card.Body>
            </Card>
        );
    }

    function resetForm(): void {
        setMatchmakingParams(startingTracker);
    }

    function submitForm(): void {
        let submission: Required<MatchAPI.MatchmakeParams> = { within: [], between: [] };
        for (let property in matchmakingParams) {
            switch (matchmakingParams[property]) {
                case WITHIN_LABEL:
                    submission.within.push(property);
                    break;
                case BETWEEN_LABEL:
                    submission.between.push(property);
                    break;
            }
        }
        props.onSubmit?.(submission);
        resetForm();
    }

    const propertyCards: React.ReactNode = props.participantProperties.map(generatePropertyCard);

    return (
        <Container fluid>
            <Row>
                <Col>
                    <CardColumns>{propertyCards}</CardColumns>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="success" onClick={() => submitForm()}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
