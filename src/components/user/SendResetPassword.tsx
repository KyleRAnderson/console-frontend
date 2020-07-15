import React, { useState } from 'react';
import AuthPage, { AuthData, FieldMappings, emailField } from './AuthPage';
import { createNotification } from '../../notification';
import { sendPasswordResetRequest } from '../../api/AuthAPI';

const EMAIL_KEY = Symbol('email');
export default function SendResetPassword(): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function onSubmit(data: AuthData): void {
        const email = data.get(EMAIL_KEY);
        if (email) {
            setIsSubmitting(true);
            sendPasswordResetRequest(email)
                // Using full function body intentionally instead of single line, since that would create a new promise.
                .finally(() => {
                    setIsSubmitting(false);
                })
                .then(() => {
                    createNotification({ type: 'success', message: 'Email sent' });
                })
                .catch(() => {
                    createNotification({ type: 'danger', message: 'Failed to send email' });
                });
        }
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);

    return (
        <AuthPage
            buttonLabel="Reset Password"
            fieldMappings={fieldMappings}
            disableSubmit={isSubmitting}
            onSubmit={onSubmit}
        />
    );
}
