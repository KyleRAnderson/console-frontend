import React, { useState } from 'react';
import { login } from '../../api/AuthAPI';
import { RouteComponentProps, Redirect, Link } from 'react-router-dom';
import * as AppPaths from '../../routes/AppPaths';
import { isLoggedIn } from '../../auth';
import { createNotification } from '../../notification';
import AuthPage, { AuthData, FieldMappings, emailField, passwordField } from './AuthPage';
import SubmissionState from './SubmissionState';

const EMAIL_KEY = Symbol('email');
const PASSWORD_KEY = Symbol('password');

export default function Login(props: RouteComponentProps<{}, never, { from: string }>): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.Pending);

    function handleSubmit(data: AuthData): void {
        const email = data.get(EMAIL_KEY);
        const password = data.get(PASSWORD_KEY);
        if (email && password) {
            login(email, password).then((success) => {
                setSubmissionState(success ? SubmissionState.SubmissionSuccess : SubmissionState.SubmissionFailed);
                if (success) {
                    createNotification({ type: 'success', message: 'Logged in' });
                } else {
                    createNotification({ type: 'danger', message: 'Authentication failed' });
                }
            });
        }
    }

    if (submissionState === SubmissionState.SubmissionSuccess || isLoggedIn()) {
        return <Redirect to={props.location.state?.from || AppPaths.APP_ROOT} />;
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);
    fieldMappings.set(PASSWORD_KEY, passwordField);

    return (
        <>
            <AuthPage
                buttonLabel="Login"
                fieldMappings={fieldMappings}
                disableSubmit={submissionState === SubmissionState.Submitting}
                onSubmit={handleSubmit}
            >
                <Link to={AppPaths.RESET_PASSWORD_BASE_PATH}>Forgot password?</Link>
            </AuthPage>
        </>
    );
}
