import React, { useState } from 'react';
import AuthPage, { FieldMappings, passwordField, AuthData } from './AuthPage';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { createNotification } from '../../notification';
import * as AppPaths from '../../routes/AppPaths';
import { resetPassword } from '../../api/AuthAPI';
import { isLoggedIn } from '../../auth';
import SubmissionState from './SubmissionState';

const PASSWORD_KEY = Symbol('password');
const PASSWORD_CONFIRMATION_KEY = Symbol('password_confirmation');

export default function ResetPassword(
    props: RouteComponentProps<{ [AppPaths.PASSWORD_RESET_TOKEN_PARAM]: string }>,
): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.Pending);

    const resetToken: string = props.match.params[AppPaths.PASSWORD_RESET_TOKEN_PARAM];

    function onSubmit(data: AuthData): void {
        const newPassword = data.get(PASSWORD_KEY);
        const passwordConfirmation = data.get(PASSWORD_CONFIRMATION_KEY);
        if (newPassword && passwordConfirmation) {
            setSubmissionState(SubmissionState.Submitting);
            resetPassword(resetToken, newPassword, passwordConfirmation).then((success) => {
                setSubmissionState(success ? SubmissionState.SubmissionSuccess : SubmissionState.SubmissionFailed);
                if (success) {
                    createNotification({ type: 'success', message: 'Password set' });
                } else {
                    createNotification({ type: 'danger', message: 'Error resetting password' });
                }
            });
        }
    }

    if (submissionState === SubmissionState.SubmissionSuccess || isLoggedIn()) {
        return <Redirect to={AppPaths.LOGIN_PATH} />;
    }

    const fieldMappings: FieldMappings = new Map();
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
