import React, { useState } from 'react';
import AuthForm, { FieldMappings, passwordField, AuthData } from './AuthForm';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import Auth from '../../auth';
import Notifications from '../../notification';
import AppPaths from '../../routes/AppPaths';

enum SubmissionState {
    Pending,
    Submitting,
    SubmissionSuccess,
    SubmissionFailed,
}

const PASSWORD_KEY: Symbol = Symbol('password');
const PASSWORD_CONFIRMATION_KEY: Symbol = Symbol('password_confirmation');

export default function ResetPassword(props: RouteComponentProps<{ [key: string]: string }>): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.Pending);

    const resetToken: string = props.match.params[AppPaths.passwordResetTokenParam];

    function onSubmit(data: AuthData): void {
        let newPassword = data.get(PASSWORD_KEY);
        let passwordConfirmation = data.get(PASSWORD_CONFIRMATION_KEY);
        if (newPassword && passwordConfirmation) {
            setSubmissionState(SubmissionState.Submitting);
            Auth.resetPassword(resetToken, newPassword, passwordConfirmation).then((success) => {
                setSubmissionState(success ? SubmissionState.SubmissionSuccess : SubmissionState.SubmissionFailed);
                if (success) {
                    Notifications.createNotification({ type: 'success', message: 'Password set' });
                } else {
                    Notifications.createNotification({ type: 'danger', message: 'Error resetting password' });
                }
            });
        }
    }

    if (submissionState === SubmissionState.SubmissionSuccess || Auth.isLoggedIn()) {
        return <Redirect to={AppPaths.loginUrl} />;
    }

    let fieldMappings: FieldMappings = new Map();
    fieldMappings.set(PASSWORD_KEY, passwordField);
    fieldMappings.set(PASSWORD_CONFIRMATION_KEY, {
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirmation',
        validateWith: [PASSWORD_KEY],
        errorMessage: 'Must match password',
        validator: (value, formData) => {
            return value === formData.get(PASSWORD_KEY);
        },
    });

    return (
        <AuthForm
            buttonLabel="Set Password"
            fieldMappings={fieldMappings}
            disableSubmit={submissionState === SubmissionState.Submitting}
            onSubmit={onSubmit}
        />
    );
}
