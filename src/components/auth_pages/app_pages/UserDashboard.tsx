import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { HuntWithProperties } from '../../../models/Hunt';
import Roster from '../../../models/Roster';
import * as AppPaths from '../../../routes/AppPaths';
import HuntLoader from './hunts/HuntLoader';
import PermissionsPage from './permissions/PermissionsPage';
import RosterContext from './rosters/RosterContext';
import RostersList from './rosters/RostersList';

/**
 * setMenuItem: A function to call to set a menu item for this user's dashboard,
 * so that it displays on top.
 */
type UserDashboardProps = {
    setMenuItem?: (item: React.ReactNode) => void;
};

export default function UserDashboard({ setMenuItem }: UserDashboardProps): JSX.Element {
    const [currentRoster, setCurrentRoster] = useState<Roster | undefined>(undefined);
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(undefined);
    const history = useHistory();

    function setNewCurrentRoster(roster: Roster): void {
        setCurrentRoster(roster);
    }

    function showRoster(roster: Roster): void {
        setNewCurrentRoster(roster);
        history.push(AppPaths.rosterPath(roster));
    }

    function setNewCurrentHunt(hunt: HuntWithProperties): void {
        setCurrentHunt(hunt);
        history.push(AppPaths.huntPath(hunt));
    }

    useEffect(() => {
        if (currentRoster) {
            setMenuItem?.(
                <>
                    <Nav.Link href={AppPaths.rosterPath(currentRoster)}>{currentRoster.name}</Nav.Link>
                    <Nav.Link href={AppPaths.permissionsPath(currentRoster)}>Permissions</Nav.Link>
                </>,
            );
        }
    }, [currentRoster, setMenuItem]);

    return (
        <>
            <Switch>
                <Route path={AppPaths.permissionsPath()} component={PermissionsPage} />
                <Route
                    path={AppPaths.rosterPath()}
                    render={(props) => {
                        return (
                            <RosterContext
                                {...props}
                                dashboardProps={{
                                    onSelectHunt: (hunt) => setNewCurrentHunt(hunt),
                                }}
                                roster={currentRoster}
                                onLoadRoster={setNewCurrentRoster}
                            />
                        );
                    }}
                />
                <Route
                    path={AppPaths.huntPath()}
                    render={(props) => {
                        return <HuntLoader hunt={currentHunt} {...props} />;
                    }}
                />
                <Route
                    path={AppPaths.ROSTERS_PATH}
                    render={(props) => {
                        return <RostersList {...props} onRosterSelect={(roster) => showRoster(roster)} />;
                    }}
                />
                <Route path={AppPaths.APP_ROOT}>
                    <Redirect to={AppPaths.ROSTERS_PATH} />
                </Route>
            </Switch>
        </>
    );
}
