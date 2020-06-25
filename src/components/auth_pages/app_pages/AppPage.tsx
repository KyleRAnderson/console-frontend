import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import UserNavbar from './UserNavbar';

function AppPage(props: RouteComponentProps) {
    const [extraNavItems, setExtraNavItems] = useState<React.ReactNode>([]);

    return (
        <>
            <UserNavbar {...props}>{extraNavItems}</UserNavbar>
            <UserDashboard {...props} setMenuItem={setExtraNavItems} />
        </>
    );
}
export default AppPage;
