import React, { useState } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { PermissionPost } from '../../../../api/permissionAPI';
import LevelSelect from './LevelSelect';
import { Role } from '../../../../models/Permission';
import { EMAIL_REGEX } from '../../../user/AuthForm';
import FormControlElement from '../../../../FormControlElement';

type Props = {
    onSubmit?: (permission: PermissionPost) => void;
};

export default function PermissionForm(props: Props): JSX.Element {
    const [post, setPost] = useState<PermissionPost>({ email: '', level: 'viewer' });
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    function isValid(): boolean {
        return emailValid;
    }

    function emailChanged(event: React.ChangeEvent<FormControlElement>): void {
        setPost({ ...post, email: event.currentTarget.value });
        setEmailValid(EMAIL_REGEX.test(event.currentTarget.value));
    }

    function levelChanged(event: React.ChangeEvent<FormControlElement>): void {
        setPost({ ...post, level: event.currentTarget.value as Role });
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setSubmitted(true);

        if (isValid()) {
            props.onSubmit?.(post);
        }
    }

    return (
        <Container fluid>
            <Form noValidate onSubmit={onSubmit}>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="email" placeholder="Email" onChange={emailChanged} />
                        {!emailValid && (post.email.length > 0 || submitted) ? (
                            <span className="error">Must be a valid email address.</span>
                        ) : null}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <LevelSelect level={post.level} onChange={levelChanged} />
                    </Form.Group>
                    <Col>
                        <Button variant="primary" type="submit">
                            Create Permission
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </Container>
    );
}
