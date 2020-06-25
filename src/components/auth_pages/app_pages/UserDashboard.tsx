import React, { useState } from 'react';
import Roster from '../../../models/Roster';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import * as AppPaths from '../../../routes/AppPaths';
import HuntDetails from './hunts/HuntDetails';
import { HuntWithProperties } from '../../../models/Hunt';
import RostersList from './rosters/RostersList';
import RosterDashboard from './rosters/RosterDashboard';
import PermissionsAdapter from './permissions/PermissionsAdapter';

export default function UserDashboard(props: RouteComponentProps) {
    const [currentRoster, setCurrentRoster] = useState<Roster | undefined>(undefined);
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(undefined);

    function setNewCurrentRoster(roster: Roster): void {
        setCurrentRoster(roster);
        props.history.push(AppPaths.rosterPath(roster));
    }

    function setNewCurrentHunt(hunt: HuntWithProperties): void {
        setCurrentHunt(hunt);
        props.history.push(AppPaths.huntPath(hunt));
    }

    return (
        <>
            <Switch>
                <Route path={AppPaths.permissionsPath()} component={PermissionsAdapter} />
                <Route
                    path={AppPaths.rosterPath()}
                    render={(props) => {
                        return (
                            <RosterDashboard
                                {...props}
                                onSelectHunt={(hunt) => setNewCurrentHunt(hunt)}
                                roster={currentRoster}
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
                        return <RostersList {...props} onRosterSelect={(roster) => setNewCurrentRoster(roster)} />;
                    }}
                />
                <Route path={AppPaths.APP_ROOT}>
                    <Redirect to={AppPaths.ROSTERS_PATH} />
                </Route>
            </Switch>
        </>
    );
}
