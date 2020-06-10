import React, { useState } from 'react';
import Notifications from '../notification';
import AuthForm, { AuthData, FieldMappings, emailField, passwordField } from './user/AuthForm';
import Auth from '../auth';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import AppPaths from '../routes/AppPaths';

enum SubmissionState {
    PendingSubmission,
    Submitting,
    Failed,
    Success,
}

const EMAIL_KEY: Symbol = Symbol('email');
const PASSWORD_KEY: Symbol = Symbol('password');
const PASSWORD_CONFIRMATION_KEY: Symbol = Symbol('password confirmation');

export default function Register(props: RouteComponentProps): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.PendingSubmission);

    function handleSubmit(data: AuthData): void {
        let email = data.get(EMAIL_KEY);
        let password = data.get(PASSWORD_KEY);
        let passwordConfirmation = data.get(PASSWORD_CONFIRMATION_KEY);
        if (email && password && passwordConfirmation) {
            Auth.register(email, password, passwordConfirmation).then((success) => {
                setSubmissionState(success ? SubmissionState.Success : SubmissionState.Failed);
                if (success) {
                    Notifications.createNotification({ type: 'success', message: 'Logged in' });
                } else {
                    Notifications.createNotification({ type: 'danger', message: 'Authentication failed' });
                }
            });
        }
    }

    if (submissionState === SubmissionState.Success || Auth.isLoggedIn()) {
        props.history.goBack();
        return <Redirect to={props.history.location || AppPaths.app} />;
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);
    fieldMappings.set(PASSWORD_KEY, passwordField);
    fieldMappings.set(PASSWORD_CONFIRMATION_KEY, {
        type: 'password',
        label: 'Password Confirmation',
        errorMessage: 'Confirmation must match password',
        validator: (value, data) => {
            return value === data.get(PASSWORD_KEY);
        },
        validateWith: [PASSWORD_KEY],
    });

    return (
        <AuthForm
            buttonLabel="Login"
            fieldMappings={fieldMappings}
            disableSubmit={submissionState === SubmissionState.Submitting}
            onSubmit={handleSubmit}
        />
    );
}
