import React, { useState } from 'react';
import { createNotification } from '../../notification';
import AuthPage, { AuthData, FieldMappings, emailField, passwordField } from './AuthPage';
import { Redirect, Link } from 'react-router-dom';
import * as AppPaths from '../../routes/AppPaths';
import { isLoggedIn } from '../../auth';
import { register } from '../../api/AuthAPI';
import SubmissionState from './SubmissionState';

const EMAIL_KEY = Symbol('email');
const PASSWORD_KEY = Symbol('password');
const PASSWORD_CONFIRMATION_KEY = Symbol('password confirmation');

export default function Register(): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.Pending);

    function handleSubmit(data: AuthData): void {
        const email = data.get(EMAIL_KEY);
        const password = data.get(PASSWORD_KEY);
        const passwordConfirmation = data.get(PASSWORD_CONFIRMATION_KEY);
        if (email && password && passwordConfirmation) {
            setSubmissionState(SubmissionState.Submitting);
            register(email, password, passwordConfirmation)
                .then(() => {
                    setSubmissionState(SubmissionState.SubmissionSuccess);
                    createNotification({
                        type: 'success',
                        message: 'Account created, check your email.',
                    });
                })
                .catch(() => {
                    setSubmissionState(SubmissionState.SubmissionFailed);
                    createNotification({ type: 'danger', message: 'Registration failed' });
                });
        }
    }

    if (submissionState === SubmissionState.SubmissionSuccess || isLoggedIn()) {
        return <Redirect to={AppPaths.LOGIN_PATH} push />;
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
        <AuthPage
            buttonLabel="Register"
            fieldMappings={fieldMappings}
            disableSubmit={submissionState === SubmissionState.Submitting}
            onSubmit={handleSubmit}
        >
            <Link to={AppPaths.CONFIRMATION_BASE_PATH}>Resend Confirmation Email</Link>
        </AuthPage>
    );
}
