import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, FormControlProps } from 'react-bootstrap';
import Auth from '../../auth';

type AcceptedKey = string | Symbol;
/**
 * Returns true for valid, false otherwise.
 */
type Validator = ((value: string, data: Readonly<AuthData>) => boolean) | RegExp;
type FieldProperty = {
    label: string;
    type: FormControlProps['type'];
    placeholder?: string;
    validator?: Validator;
    errorMessage?: string;
    // Other keys that this property should be validated with.
    validateWith?: AcceptedKey[];
};
export type AuthData = Map<AcceptedKey, string>;

export type FieldMappings = Map<AcceptedKey, FieldProperty>;

type Props = {
    // Using a map here because it preserves insertion order.
    fieldMappings: FieldMappings;
    onSubmit?: (data: AuthData) => void;
    readonly buttonLabel: string;
    disableSubmit?: boolean;
    children?: React.ReactNode;
};

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

export default function AuthForm(props: Props): JSX.Element {
    let initialCredentials = new Map<AcceptedKey, string>();
    let initialErrors = new Map<AcceptedKey, boolean>();
    let initialValidators: Map<AcceptedKey, [AcceptedKey, Validator][]> = new Map();

    for (let key of props.fieldMappings.keys()) {
        initialCredentials.set(key, '');
        // By default invalid until component mounts.
        initialErrors.set(key, true);
    }

    const [credentials, setCredentials] = useState<AuthData>(initialCredentials);
    // Map of form {key: boolean} where the boolean value is true if there is an error.
    const [formErrors, setFormErrors] = useState<Map<AcceptedKey, boolean>>(initialErrors);
    // Set to true when submitted, just to show errors.
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);
    // Essentially a map of the validators for each property.
    // Format: {keyToWatch: [[keyToUpdate, validator], [anotherKeyToUpdate, validator]], ...}
    const validators = useRef<ReadonlyMap<AcceptedKey, [AcceptedKey, Validator][]>>(initialValidators);

    useEffect(() => {
        initialCredentials = new Map<AcceptedKey, string>();
        initialErrors = new Map<AcceptedKey, boolean>();
        const initialValue: string = '';
        for (let [key, mapping] of props.fieldMappings.entries()) {
            initialCredentials.set(key, initialValue);
            initialErrors.set(key, !isValid(props.fieldMappings.get(key)?.validator, initialValue));

            addValidator(key, key, mapping.validator);
            mapping.validateWith?.forEach((listenKey) => addValidator(listenKey, key, mapping.validator));
        }
        setCredentials(initialCredentials);
        setFormErrors(initialErrors);
    }, []);

    /**
     * Adds a validation listener for the listenKey to update the validity of the property at the updateKey.
     * @param listenKey The key for which an update means the updateKey property should be checked again.
     * @param updateKey The key to update the validity status for.
     * @param validator The validator to be used.
     */
    function addValidator(listenKey: AcceptedKey, updateKey: AcceptedKey, validator: Validator | undefined): void {
        if (!validator) return;
        let currentValidators = initialValidators.get(listenKey);
        if (!currentValidators) {
            currentValidators = [];
            initialValidators.set(listenKey, currentValidators);
        }
        currentValidators.push([updateKey, validator]);
    }

    /**
     * Determines whether or not the whole form is valid.
     * @return True if the entire form is valid, false otherwise.
     */
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

    /**
     * Determines if the given value is valid according to the validator function.
     * @param validator The validator (function or regex) to be evaluated with the current values. If undefined, then valid is true.
     * @param value The current or new value of the thing which has been updated. If undefined, then valid is true.
     * @param newCredentials The new credentials map, since the key which was updated would not have been updated yet.
     */
    function isValid(
        validator: Validator | undefined,
        value: string | undefined,
        newCredentials: Map<AcceptedKey, string> = credentials,
    ): boolean {
        // If no validator is provided, then we are valid by default.
        let valid: boolean = validator === undefined || value === undefined;
        if (!valid) {
            validator = validator as Validator;
            value = value as string;
            if (validator instanceof RegExp) {
                valid = validator.test(value);
            } else {
                valid = validator(value, Object.freeze(newCredentials));
            }
        }
        return valid;
    }

    function handleValueChanged(key: AcceptedKey, event: React.FormEvent<HTMLInputElement>): void {
        let value: string = event.currentTarget.value;
        let newCredentials = new Map(credentials).set(key, value);
        setCredentials(newCredentials);

        let newFormErrors: Map<AcceptedKey, boolean> = new Map(formErrors);
        let associatedValidators = validators.current.get(key);
        associatedValidators?.forEach(([updateKey, validator]) => {
            newFormErrors.set(updateKey, !isValid(validator, newCredentials.get(updateKey), newCredentials));
        });
        setFormErrors(newFormErrors);
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
            <Row className="justify-content-center py-3">
                <Col md="5">{props.children}</Col>
            </Row>
        </Container>
    );
}
