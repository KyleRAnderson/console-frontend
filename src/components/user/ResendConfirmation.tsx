import React, { useState } from 'react';
import AuthForm, { FieldMappings, emailField, AuthData } from './AuthForm';
import { createNotification } from '../../notification';
import { resendConfirmation } from '../../api/authAPI';

const EMAIL_KEY = Symbol('email');

export default function ResendConfirmation(): JSX.Element {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function onSubmit(data: AuthData): void {
        const email = data.get(EMAIL_KEY);
        if (email) {
            setSubmitting(true);
            resendConfirmation(email).then((success) => {
                if (success) {
                    createNotification({ type: 'success', message: 'Email sent' });
                } else {
                    createNotification({ type: 'danger', message: 'Failed to send email.' });
                }
                setSubmitting(false);
            });
        }
    }

    const fieldMappings: FieldMappings = new Map();
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
