import React, { useState } from 'react';
import Roster from '../../../models/Roster';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import AppPaths from '../../../routes/AppPaths';
import HuntDetails from './hunts/HuntDetails';
import { HuntWithProperties } from '../../../models/Hunt';
import RostersList from './rosters/RostersList';
import RosterDashboard from './rosters/RosterDashboard';

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
                    path={AppPaths.rostersPath}
                    render={(props) => {
                        return <RostersList {...props} onRosterSelect={(roster) => setNewCurrentRoster(roster)} />;
                    }}
                />
                <Route path={AppPaths.app}>
                    <Redirect to={AppPaths.rostersPath} />
                </Route>
            </Switch>
        </>
    );
}
