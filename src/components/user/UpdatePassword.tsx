import React, { useState } from 'react';
import { FieldMappings, passwordField, AuthData } from './AuthForm';
import { createNotification } from '../../notification';
import { updatePassword } from '../../api/AuthAPI';
import SubmissionState from './SubmissionState';
import AuthPage from './AuthPage';
import { LOGIN_PATH } from '../../routes/AppPaths';
import { Redirect } from 'react-router-dom';

const OLD_PASSWORD_KEY = Symbol('old_password');
const PASSWORD_KEY = Symbol('password');
const PASSWORD_CONFIRMATION_KEY = Symbol('password_confirmation');

export type Props = {
    /** Function to be called when the form is submitted. */
    onSubmit?: () => void;
};

export default function UpdatePassword(props: Props): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.Pending);

    function onSubmit(data: AuthData): void {
        const oldPassword = data.get(OLD_PASSWORD_KEY);
        const newPassword = data.get(PASSWORD_KEY);
        const passwordConfirmation = data.get(PASSWORD_CONFIRMATION_KEY);
        if (oldPassword && newPassword && passwordConfirmation) {
            setSubmissionState(SubmissionState.Submitting);
            updatePassword(oldPassword, newPassword, passwordConfirmation)
                .then(() => {
                    setSubmissionState(SubmissionState.SubmissionSuccess);
                    createNotification({ type: 'success', message: 'Password set' });
                })
                .catch(() => {
                    setSubmissionState(SubmissionState.SubmissionFailed);
                    createNotification({ type: 'danger', message: 'Error setting password' });
                })
                .finally(() => {
                    props.onSubmit?.();
                });
        }
    }

    if (submissionState === SubmissionState.SubmissionSuccess) {
        return <Redirect to={LOGIN_PATH} push />;
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(OLD_PASSWORD_KEY, passwordField);
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
        <AuthPage
            buttonLabel="Set Password"
            fieldMappings={fieldMappings}
            disableSubmit={submissionState === SubmissionState.Submitting}
            onSubmit={onSubmit}
        />
    );
}
