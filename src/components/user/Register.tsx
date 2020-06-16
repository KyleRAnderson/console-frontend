import React, { useState } from 'react';
import { createNotification } from '../../notification';
import AuthForm, { AuthData, FieldMappings, emailField, passwordField } from './AuthForm';
import { RouteComponentProps, Redirect, Link } from 'react-router-dom';
import * as AppPaths from '../../routes/AppPaths';
import { isLoggedIn } from '../../auth';
import { register } from '../../api/authAPI';

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
        return <Redirect to={AppPaths.LOGIN_PATH} />;
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
            <Link to={AppPaths.CONFIRMATION_BASE_PATH}>Resend Confirmation Email</Link>
        </AuthForm>
    );
}
