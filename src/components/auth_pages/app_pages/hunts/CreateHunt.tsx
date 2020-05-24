import React, { useState } from 'react';
import HuntAPI from './huntAPI';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';

type CreateHuntProps = {
    onSubmission?: (hunt: HuntAPI.HuntPost) => void;
};

export default function CreateHunt(props: CreateHuntProps): JSX.Element {
    const [huntName, setHuntName] = useState<string>('');

    function submitForm(event: React.FormEvent<HTMLFormElement>): void {
        props.onSubmission?.({ name: huntName });
        event.preventDefault();
    }

    return (
        <Container className="ml-0 pl-1 pb-3">
            <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => submitForm(event)}>
                <Row>
                    <Col md="9">
                        <Form.Control
                            required
                            placeholder="Hunt Name"
                            onChange={(change) => setHuntName(change.target.value)}
                            value={huntName}
                        />
                    </Col>
                    <Col md="3">
                        <Button variant="primary" type="submit">
                            Create Hunt
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
