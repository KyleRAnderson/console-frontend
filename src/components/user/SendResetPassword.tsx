import React, { useState } from 'react';
import AuthForm, { AuthData, FieldMappings, emailField } from './AuthForm';
import { createNotification } from '../../notification';
import { sendPasswordResetRequest } from '../../api/authAPI';

const EMAIL_KEY = Symbol('email');
export default function SendResetPassword(): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function onSubmit(data: AuthData): void {
        const email = data.get(EMAIL_KEY);
        if (email) {
            setIsSubmitting(true);
            sendPasswordResetRequest(email).then((success) => {
                setIsSubmitting(false);
                if (success) {
                    createNotification({ type: 'success', message: 'Email sent' });
                } else {
                    createNotification({ type: 'danger', message: 'Failed to send email' });
                }
            });
        }
    }

    const fieldMappings: FieldMappings = new Map();
    fieldMappings.set(EMAIL_KEY, emailField);

    return (
        <AuthForm
            buttonLabel="Reset Password"
            fieldMappings={fieldMappings}
            disableSubmit={isSubmitting}
            onSubmit={onSubmit}
        />
    );
}
