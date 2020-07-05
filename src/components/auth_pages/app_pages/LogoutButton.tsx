import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import * as AppPaths from '../../../routes/AppPaths';
import { Redirect } from 'react-router-dom';
import { logout } from '../../../api/AuthAPI';

export default function LogoutButton(): JSX.Element {
    const [loggedOut, setLoggedOut] = useState<boolean>(false);

    function logoutButtonClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        logout().then(() => setLoggedOut(true));
    }

    const logoutButton: React.ReactNode = (
        <Button
            variant="link"
            size="sm"
            type="button"
            className="danger-link"
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => logoutButtonClicked(event)}
        >
            Logout
        </Button>
    );
    return loggedOut ? <Redirect to={AppPaths.ROOT} push /> : <>{logoutButton}</>;
}
