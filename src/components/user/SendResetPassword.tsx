import React, { useState } from 'react';
import AuthForm, { AuthData, FieldMappings, emailField } from './AuthForm';
import Auth from '../../auth';
import Notifications from '../../notification';

const EMAIL_KEY: Symbol = Symbol('email');
export default function SendResetPassword(): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function onSubmit(data: AuthData): void {
        let email = data.get(EMAIL_KEY);
        if (email) {
            setIsSubmitting(true);
            Auth.sendPasswordResetRequest(email).then((success) => {
                setIsSubmitting(false);
                if (success) {
                    Notifications.createNotification({ type: 'success', message: 'Email sent' });
                } else {
                    Notifications.createNotification({ type: 'danger', message: 'Failed to send email' });
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
