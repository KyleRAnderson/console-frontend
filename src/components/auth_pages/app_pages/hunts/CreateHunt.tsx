import React, { useState } from 'react';
import HuntAPI from './huntAPI';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';

type CreateHuntProps = {
    onSubmission?: (hunt: HuntAPI.HuntPost) => void;
};

export default function CreateHunt(props: CreateHuntProps): JSX.Element {
    const [huntName, setHuntName] = useState<string>('');

    function clearForm(): void {
        setHuntName('');
    }

    function submitForm(event: React.FormEvent<HTMLFormElement>): void {
        props.onSubmission?.({ name: huntName });
        clearForm();
        event.preventDefault();
    }

    return (
        <Container fluid className="ml-0 pl-1 pb-3">
            <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => submitForm(event)}>
                <Row className="justify-content-around">
                    <Col md="6">
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
