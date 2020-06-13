import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function NotFound(props: RouteComponentProps): JSX.Element {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <h1 className="text-center">{`The page you are looking for doesn't exist: ${props.location.pathname}`}</h1>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
