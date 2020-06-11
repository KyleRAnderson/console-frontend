import React, { useState } from 'react';
import Auth from '../auth';
import { RouteComponentProps, Redirect, Link } from 'react-router-dom';
import AppPaths from '../routes/AppPaths';
import Notifications from '../notification';
import AuthForm, { AuthData, FieldMappings, emailField, passwordField } from './user/AuthForm';

const EMAIL_KEY: Symbol = Symbol('email');
const PASSWORD_KEY: Symbol = Symbol('password');

enum SubmissionState {
    PendingSubmission,
    Submitting,
    Failed,
    Success,
}

export default function Login(props: RouteComponentProps<{}, any, { from: string }>): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.PendingSubmission);

    function handleSubmit(data: AuthData): void {
        let email = data.get(EMAIL_KEY);
        let password = data.get(PASSWORD_KEY);
        if (email && password) {
            Auth.login(email, password).then((success) => {
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
        return <Redirect to={props.location.state?.from || AppPaths.app} />;
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);
    fieldMappings.set(PASSWORD_KEY, passwordField);

    return (
        <>
            <AuthForm
                buttonLabel="Login"
                fieldMappings={fieldMappings}
                disableSubmit={submissionState === SubmissionState.Submitting}
                onSubmit={handleSubmit}
            >
                <Link to={AppPaths.resetPasswordBasePath}>Forgot password?</Link>
            </AuthForm>
        </>
    );
}
