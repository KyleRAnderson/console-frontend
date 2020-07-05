import React from 'react';
import { Button } from 'react-bootstrap';
import { UPDATE_PASSWORD_PATH } from '../../../routes/AppPaths';

export default function ChangePasswordButton(): JSX.Element {
    return (
        <>
            <Button size="sm" type="button" variant="warning" href={UPDATE_PASSWORD_PATH}>
                Change Password
            </Button>
        </>
    );
}
