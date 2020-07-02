import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import * as AppPaths from '../../routes/AppPaths';
import Loading from '../Loading';
import { createNotification } from '../../notification';
import { confirm } from '../../api/AuthAPI';

enum SubmissionState {
    Pending,
    FailedConfirmation,
    ConfirmationSuccess,
}

export default function UserConfirmation(
    props: RouteComponentProps<{ [AppPaths.CONFIRMATION_TOKEN_PARAM]: string }>,
): JSX.Element {
    const [submissionState, setSubmissionState] = useState<SubmissionState>(SubmissionState.Pending);

    function sendConfirmation(): void {
        confirm(props.match.params[AppPaths.CONFIRMATION_TOKEN_PARAM]).then((success) => {
            setSubmissionState(success ? SubmissionState.ConfirmationSuccess : SubmissionState.FailedConfirmation);
        });
    }

    useEffect(() => {
        sendConfirmation();
    }, []);

    let element: React.ReactNode;
    switch (submissionState) {
        case SubmissionState.ConfirmationSuccess:
            createNotification({ type: 'success', message: 'User Confirmed!' });
            element = <Redirect to={AppPaths.LOGIN_PATH} />;
            break;
        case SubmissionState.FailedConfirmation:
            createNotification({
                type: 'danger',
                message: 'Failed to confirm user, token may have expired.',
            });
            element = <Redirect to={AppPaths.ROOT} />;
            break;
        default:
            element = <Loading />;
            break;
    }
    return <>{element}</>;
}
