import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { InstantPrintArgs } from '../../../../../api/licenseAPI';
import { HuntWithProperties } from '../../../../../models/Hunt';

export type Props = {
    hunt: HuntWithProperties;
    onSubmit?: (printArgs?: InstantPrintArgs) => void;
    disabled?: boolean;
};

export default function InstantPrintForm(props: Props): JSX.Element {
    const [orderings, setOrderings] = useState<InstantPrintArgs>(new Map());

    function getRemainingOrderingOptions(): string[] {
        return props.hunt.roster.participant_properties.filter((property) => !orderings.has(property));
    }

    const remainingOptions = getRemainingOrderingOptions();
    const areRemainingOptions = remainingOptions.length > 0;

    const [selection, setSelection] = useState<string>(remainingOptions[0]);

    function addOrdering(): void {
        if (areRemainingOptions) {
            const newOrderings = new Map(orderings);
            newOrderings.set(remainingOptions[0], 'asc');
            setOrderings(newOrderings);
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        props.onSubmit?.(orderings);
    }

    function withNewOrderings(callable: (newOrdering: Map<string, 'asc' | 'desc'>) => void) {
        const newOrderings = new Map(orderings);
        callable(newOrderings);
        setOrderings(newOrderings);
    }

    function removeOrdering(propertyName: string): void {
        withNewOrderings((newOrderings) => newOrderings.delete(propertyName));
    }

    function setOrdering(propertyName: string, direction: 'asc' | 'desc'): void {
        withNewOrderings((newOrderings) => newOrderings.set(propertyName, direction));
    }

    return (
        <Form onSubmit={handleSubmit}>
            {Array.from(orderings).map(([propertyName, direction]) => {
                return (
                    <Form.Row key={propertyName} className="py-1">
                        <Form.Group>
                            <Col>
                                <Form.Label>{propertyName}</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={direction}
                                    onChange={(event) =>
                                        setOrdering(propertyName, event.target.value as 'asc' | 'desc')
                                    }
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </Form.Control>
                            </Col>
                            <Col>
                                <button className="btn btn-default" onClick={() => removeOrdering(propertyName)}>
                                    <svg
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 16 16"
                                        className="bi bi-x"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
                                        />
                                    </svg>
                                </button>
                            </Col>
                        </Form.Group>
                    </Form.Row>
                );
            })}
            <Form.Row className="justify-content-between py-1">
                {areRemainingOptions && (
                    <Col>
                        <Form.Control
                            as="select"
                            value={selection}
                            onChange={(event) => setSelection(event.target.value)}
                        >
                            {remainingOptions.map((option) => {
                                return (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Col>
                )}
                <Col>
                    <Button
                        variant="outline-primary"
                        type="button"
                        onClick={addOrdering}
                        disabled={!areRemainingOptions}
                    >
                        Add Ordering
                    </Button>
                </Col>
            </Form.Row>
            <Form.Row className="py-1">
                <Button variant="success" type="submit" disabled={props.disabled}>
                    Generate
                </Button>
            </Form.Row>
        </Form>
    );
}
