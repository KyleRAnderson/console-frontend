import React, { useState } from 'react';
import AuthForm, { FieldMappings, emailField, AuthData } from './AuthForm';
import Auth from '../../auth';
import Notifications from '../../notification';

const EMAIL_KEY: Symbol = Symbol('email');

export default function ResendConfirmation(): JSX.Element {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function onSubmit(data: AuthData): void {
        let email = data.get(EMAIL_KEY);
        if (email) {
            setSubmitting(true);
            Auth.resendConfirmation(email).then((success) => {
                if (success) {
                    Notifications.createNotification({ type: 'success', message: 'Email sent' });
                } else {
                    Notifications.createNotification({ type: 'danger', message: 'Failed to send email.' });
                }
                setSubmitting(false);
            });
        }
    }

    let fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);

    return (
        <AuthForm
            fieldMappings={fieldMappings}
            onSubmit={onSubmit}
            buttonLabel="Resend Confirmation"
            disableSubmit={submitting}
        />
    );
}
