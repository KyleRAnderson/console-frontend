import React from 'react';
import { Container } from 'react-bootstrap';
import AuthForm, { Props as AuthFormProps } from './AuthForm';

export default function AuthPage(props: AuthFormProps): JSX.Element {
    return (
        <Container fluid className="vw-100 vh-100  primary-color pt-3">
            <AuthForm {...props} />
        </Container>
    );
}

export * from './AuthForm';
