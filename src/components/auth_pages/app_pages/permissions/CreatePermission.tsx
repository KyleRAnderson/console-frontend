import React from 'react';
import Permission from '../../../../models/Permission';
import { PermissionPost, createPermission } from '../../../../api/permissionAPI';
import PermissionForm from './PermissionForm';
import { createNotification, NotificationConfig } from '../../../../notification';
import { asServerError, formatForPrint } from '../../../../models/ServerError';

type Props = {
    onCreate?: (permission: Permission) => void;
    rosterId: string;
};

export default function CreatePermission(props: Props): JSX.Element {
    function postPermission(post: PermissionPost): void {
        createPermission(props.rosterId, post)
            .then(({ data: permission }) => {
                createNotification({ type: 'success', message: 'Permission created!' });
                props.onCreate?.(permission);
            })
            .catch((error) => {
                const errorCasted = asServerError(error);
                let notification: NotificationConfig;
                if (errorCasted) {
                    notification = {
                        type: 'danger',
                        title: 'Failed to Create',
                        message: formatForPrint(errorCasted.detail),
                    };
                } else {
                    notification = { type: 'danger', message: 'Failed to Create' };
                }
                createNotification(notification);
            });
    }

    return <PermissionForm onSubmit={postPermission} />;
}
