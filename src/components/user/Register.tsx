import React, { useState } from 'react';
import { createNotification } from '../../notification';
import AuthForm, { AuthData, FieldMappings, emailField, passwordField } from './AuthForm';
import { RouteComponentProps, Redirect, Link } from 'react-router-dom';
import * as AppPaths from '../../routes/AppPaths';
import { register } from '../../api/AuthAPI';
import { isLoggedIn } from '../../auth';

enum SubmissionState {
    PendingSubmission,
    Submitting,
    Failed,
    Success,
}

const EMAIL_KEY = Symbol('email');
const PASSWORD_KEY = Symbol('password');
const PASSWORD_CONFIRMATION_KEY = Symbol('password confirmation');

export default function Register(props: RouteComponentProps): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.PendingSubmission);

    function handleSubmit(data: AuthData): void {
        const email = data.get(EMAIL_KEY);
        const password = data.get(PASSWORD_KEY);
        const passwordConfirmation = data.get(PASSWORD_CONFIRMATION_KEY);
        if (email && password && passwordConfirmation) {
            setSubmissionState(SubmissionState.Submitting);
            register(email, password, passwordConfirmation).then((success) => {
                setSubmissionState(success ? SubmissionState.Success : SubmissionState.Failed);
                if (success) {
                    createNotification({
                        type: 'success',
                        message: 'Account created, check your email.',
                    });
                } else {
                    createNotification({ type: 'danger', message: 'Registration failed' });
                }
            });
        }
    }

    if (submissionState === SubmissionState.Success || isLoggedIn()) {
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
