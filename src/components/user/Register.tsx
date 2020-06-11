import React, { useState } from 'react';
import Notifications from '../../notification';
import AuthForm, { AuthData, FieldMappings, emailField, passwordField } from './AuthForm';
import Auth from '../../auth';
import { RouteComponentProps, Redirect, Link } from 'react-router-dom';
import AppPaths from '../../routes/AppPaths';

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
            setSubmissionState(SubmissionState.Submitting);
            Auth.register(email, password, passwordConfirmation).then((success) => {
                setSubmissionState(success ? SubmissionState.Success : SubmissionState.Failed);
                if (success) {
                    Notifications.createNotification({
                        type: 'success',
                        message: 'Account created, check your email.',
                    });
                } else {
                    Notifications.createNotification({ type: 'danger', message: 'Registration failed' });
                }
            });
        }
    }

    if (submissionState === SubmissionState.Success || Auth.isLoggedIn()) {
        props.history.goBack();
        return <Redirect to={AppPaths.loginUrl} />;
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);
    fieldMappings.set(PASSWORD_KEY, passwordField);
    fieldMappings.set(PASSWORD_CONFIRMATION_KEY, {
        type: 'password',
        label: 'Password Confirmation',
        errorMessage: 'Confirmation must match password',
        placeholder: 'Confirmation',
        validator: (value, data) => {
            return value === data.get(PASSWORD_KEY);
        },
        validateWith: [PASSWORD_KEY],
    });

    return (
        <AuthForm
            buttonLabel="Register"
            fieldMappings={fieldMappings}
            disableSubmit={submissionState === SubmissionState.Submitting}
            onSubmit={handleSubmit}
        >
            <Link to={AppPaths.confirmationBasePath}>Resend Confirmation Email</Link>
        </AuthForm>
    );
}
