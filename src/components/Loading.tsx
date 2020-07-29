import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

export default function Loading(): JSX.Element {
    return (
        <Container fluid>
            <Row className="align-items-center justify-content-center">
                <Col xs={{ span: 4, offset: 4 }}>
                    <Spinner role="status" animation="grow">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Col>
            </Row>
        </Container>
    );
}
