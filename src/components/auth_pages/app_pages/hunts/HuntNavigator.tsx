import React from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';
import { HuntWithProperties } from '../../../../models/Hunt';
import AppPaths from '../../../../routes/AppPaths';
import LicensesAdapter from '../licenses/LicensesAdapter';
import HuntNav, { ActiveTab } from './HuntNav';
import MatchesAdapter from '../matches/MatchesAdapter';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    currentHunt: HuntWithProperties;
};

export default function HuntNavigator(props: Props): JSX.Element {
    const currentHunt = props.currentHunt;

    function goToHunt(): void {
        props.history.push(AppPaths.huntPath(currentHunt));
    }

    function goToMatches(): void {
        props.history.push(AppPaths.matchesPath(currentHunt));
    }

    const licensesPath: string = AppPaths.huntPath(currentHunt);
    const matchesPath: string = AppPaths.matchesPath(currentHunt);

    let activeTab: ActiveTab = ActiveTab.None;
    switch (props.location.pathname) {
        case matchesPath:
            activeTab = ActiveTab.Matches;
            break;
        case licensesPath:
            activeTab = ActiveTab.Licenses;
            break;
    }
    const licensesAdapter: JSX.Element = (
        <LicensesAdapter
            huntId={props.match.params[AppPaths.huntIdParam]}
            participantProperties={currentHunt.roster.participant_properties}
        />
    );

    return (
        <>
            <HuntNav activeTab={activeTab} goToHunt={goToHunt} goToMatches={goToMatches} />
            <Switch>
                <Route
                    exact
                    path={matchesPath}
                    render={(props) => {
                        return <MatchesAdapter hunt={currentHunt} {...props} />;
                    }}
                />
                <Route>
                    {props.match.isExact ? licensesAdapter : <Redirect to={AppPaths.huntPath(currentHunt)} />}
                </Route>
            </Switch>
        </>
    );
}
