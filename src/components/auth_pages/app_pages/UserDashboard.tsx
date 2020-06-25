import React, { useState, useEffect } from 'react';
import Roster from '../../../models/Roster';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import * as AppPaths from '../../../routes/AppPaths';
import HuntDetails from './hunts/HuntDetails';
import { HuntWithProperties } from '../../../models/Hunt';
import RostersList from './rosters/RostersList';
import PermissionsAdapter from './permissions/PermissionsAdapter';
import { Nav } from 'react-bootstrap';
import RosterContext from './rosters/RosterContext';

/**
 * setMenuItem: A function to call to set a menu item for this user's dashboard,
 * so that it displays on top.
 */
type Props = RouteComponentProps & {
    setMenuItem?: (item: React.ReactNode) => void;
};

export default function UserDashboard(props: Props) {
    const [currentRoster, setCurrentRoster] = useState<Roster | undefined>(undefined);
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(undefined);

    function setNewCurrentRoster(roster: Roster): void {
        setCurrentRoster(roster);
    }

    function showRoster(roster: Roster): void {
        setNewCurrentRoster(roster);
        props.history.push(AppPaths.rosterPath(roster));
    }

    function setNewCurrentHunt(hunt: HuntWithProperties): void {
        setCurrentHunt(hunt);
        props.history.push(AppPaths.huntPath(hunt));
    }

    useEffect(() => {
        if (currentRoster) {
            props.setMenuItem?.(
                <>
                    <Nav.Link href={AppPaths.rosterPath(currentRoster)}>{currentRoster.name}</Nav.Link>
                    <Nav.Link href={AppPaths.permissionsPath(currentRoster)}>Permissions</Nav.Link>
                </>,
            );
        }
    }, [currentRoster]);

    return (
        <>
            <Switch>
                <Route path={AppPaths.permissionsPath()} component={PermissionsAdapter} />
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
                        return <HuntDetails hunt={currentHunt} {...props} />;
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
