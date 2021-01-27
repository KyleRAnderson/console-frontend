import React, { useState } from 'react';
import { Button, Card, CardColumns, Col, Form, Row } from 'react-bootstrap';
import { MatchmakeParams } from '../../../../api/matchAPI';

export type Props = {
    participantProperties: string[];
    onSubmit?: (matchmakeParams: Required<MatchmakeParams>) => void;
    /** True to disable submission of the form. */
    disabled?: boolean;
};

type PropertyTracker = {
    [property: string]: string;
};

const WITHIN_LABEL = 'Within' as const;
const BETWEEN_LABEL = 'Between' as const;
const NONE_LABEL = 'None' as const;

export default function MatchmakeForm(props: Props): JSX.Element {
    const startingTracker: PropertyTracker = props.participantProperties.reduce<PropertyTracker>((total, property) => {
        total[property] = NONE_LABEL;
        return total;
    }, {});
    const [matchmakingParams, setMatchmakingParams] = useState<PropertyTracker>(startingTracker);

    function onClick(property: string, label: string): void {
        const paramsCopy = { ...matchmakingParams };
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
        if (props.disabled) {
            return;
        }
        const submission: Required<MatchmakeParams> = { within: [], between: [] };
        for (const property in matchmakingParams) {
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
        <>
            <Row className="py-2">
                <Col>
                    <CardColumns id="matchmake-columns">{propertyCards}</CardColumns>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="success" disabled={props.disabled} onClick={() => submitForm()}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </>
    );
}
