import React, { useState } from 'react';
import MatchAPI from '../../../../api/matchAPI';
import { Container, Card, Form, Button } from 'react-bootstrap';

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

    function generatePropertyCard(property: string): JSX.Element {
        function generateRadioCheck(label: string): JSX.Element {
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
        const submission = Object.entries(matchmakingParams).reduce<Required<MatchAPI.MatchmakeParams>>(
            (total, [property, value]) => {
                switch (value) {
                    case WITHIN_LABEL:
                        total.within.push(property);
                        break;
                    case BETWEEN_LABEL:
                        total.between.push(property);
                        break;
                }
                return total;
            },
            { within: [], between: [] },
        );
        props.onSubmit?.(submission);
        resetForm();
    }

    const propertyCards: JSX.Element[] = props.participantProperties.map(generatePropertyCard);

    return (
        <Container fluid>
            {propertyCards}
            <Button variant="success" onClick={() => submitForm()}>
                Submit
            </Button>
        </Container>
    );
}
