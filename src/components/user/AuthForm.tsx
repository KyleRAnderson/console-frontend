import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormControlProps } from 'react-bootstrap';
import Auth from '../../auth';

type AcceptedKey = string | Symbol;
/**
 * Returns true for valid, false otherwise.
 */
type Validator = ((value: string) => boolean) | RegExp;
type FieldProperty = {
    label: string;
    type: FormControlProps['type'];
    placeholder?: string;
    validator?: Validator;
    errorMessage?: string;
};
export type AuthData = Map<AcceptedKey, string>;

// From https://emailregex.com/
export const EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailField: FieldProperty = Object.freeze({
    label: 'Email',
    validator: EMAIL_REGEX,
    type: 'email',
    errorMessage: 'Invalid email format.',
    placeholder: 'Email address',
});

export const passwordField: FieldProperty = Object.freeze({
    label: 'Password',
    validator: Auth.PasswordValidation.REGEX,
    type: 'password',
    errorMessage:
        `Between ${Auth.PasswordValidation.MIN_LENGTH} and ` + `${Auth.PasswordValidation.MAX_LENGTH} characters.`,
    placeholder: 'Password',
});

export type FieldMappings = Map<AcceptedKey, FieldProperty>;

type Props = {
    // Using a map here because it preserves insertion order.
    fieldMappings: FieldMappings;
    onSubmit?: (data: AuthData) => void;
    readonly buttonLabel: string;
    disableSubmit?: boolean;
};

export default function AuthForm(props: Props): JSX.Element {
    const initialCredentials = new Map<AcceptedKey, string>();
    const initialErrors = new Map<AcceptedKey, boolean>();
    for (let key of props.fieldMappings.keys()) {
        const initialValue: string = '';
        initialCredentials.set(key, initialValue);
        initialErrors.set(key, !isValid(props.fieldMappings.get(key)?.validator, initialValue));
    }
    const [credentials, setCredentials] = useState<AuthData>(initialCredentials);
    // Map of form {key: boolean} where the boolean value is true if there is an error.
    const [formErrors, setFormErrors] = useState<Map<AcceptedKey, boolean>>(initialErrors);
    // Set to true when submitted, just to show errors.
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

    function formIsValid(): boolean {
        return Array.from(formErrors.values()).every((value) => !value);
    }

    function handleSubmit(event: React.FormEvent<HTMLElement>): void {
        event.preventDefault();
        if (formIsValid()) {
            props.onSubmit?.(credentials);
        }
        setWasSubmitted(true);
    }

    function isValid(validator: Validator | undefined, value: string): boolean {
        // If no validator is provided, then we are valid by default.
        let valid: boolean = validator === undefined;
        if (validator) {
            if (validator instanceof RegExp) {
                valid = validator.test(value);
            } else {
                valid = validator(value);
            }
        }
        return valid;
    }

    function handleValueChanged(key: AcceptedKey, event: React.FormEvent<HTMLInputElement>): void {
        let value: string = event.currentTarget.value;
        setCredentials(new Map(credentials).set(key, value));
        let fieldMapping = props.fieldMappings.get(key);
        setFormErrors(new Map(formErrors).set(key, !isValid(fieldMapping?.validator, value)));
    }

    let formElements: JSX.Element[] = Array.from(props.fieldMappings, ([key, mapping]) => {
        return (
            <Form.Group controlId={`form${key.toString()}`} key={key.toString()}>
                <Form.Label>{mapping.label}</Form.Label>
                <Form.Control
                    type={mapping.type}
                    placeholder={mapping.placeholder}
                    value={credentials.get(key)}
                    onChange={(e) => handleValueChanged(key, e as React.FormEvent<HTMLInputElement>)}
                />
                <span className="error">
                    {/*If form has been submitted, we should show error. Otherwise, if length is not nothing, show error.*/}
                    {(wasSubmitted || credentials.get(key)) && formErrors.get(key)
                        ? props.fieldMappings.get(key)?.errorMessage
                        : null}
                </span>
            </Form.Group>
        );
    });

    return (
        <Container fluid className="vw-100 vh-100  primary-color pt-3">
            <Row className="justify-content-center">
                <Col md="5">
                    <Form onSubmit={(event: React.FormEvent<HTMLElement>) => handleSubmit(event)} noValidate>
                        {formElements}
                        <Button
                            variant="primary"
                            type="submit"
                            className="custom-button"
                            disabled={props.disableSubmit}
                        >
                            {props.buttonLabel}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
