import React from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';
import { HuntWithProperties } from '../../../../models/Hunt';
import AppPaths from '../../../../routes/AppPaths';
import LicensesAdapter from '../licenses/LicensesAdapter';
import HuntNav, { ActiveTab } from './HuntNav';
import MatchesAdapter from '../matches/MatchesAdapter';
import Matchmake from '../matches/Matchmake';
import * as MiniSignal from 'mini-signals';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    currentHunt: HuntWithProperties;
    matchmakingCompleteSignal?: MiniSignal;
};

export default function HuntNavigator(props: Props): JSX.Element {
    const currentHunt = props.currentHunt;
    const matchmakeCompleteSignal = props.matchmakingCompleteSignal;

    function goTo(tab: ActiveTab): void {
        switch (tab) {
            case ActiveTab.Licenses:
                goToHunt();
                break;
            case ActiveTab.Matches:
                goToMatches();
                break;
            case ActiveTab.Matchmake:
                goToMatchmake();
                break;
        }
    }

    const licensesPath: string = AppPaths.huntPath(currentHunt);
    const matchesPath: string = AppPaths.matchesPath(currentHunt);
    const matchmakePath: string = AppPaths.matchmakePath(currentHunt);

    function goToHunt(): void {
        props.history.push(licensesPath);
    }

    function goToMatches(): void {
        props.history.push(matchesPath);
    }

    function goToMatchmake(): void {
        props.history.push(matchmakePath);
    }

    let activeTab: ActiveTab = ActiveTab.None;
    switch (props.location.pathname) {
        case matchesPath:
            activeTab = ActiveTab.Matches;
            break;
        case licensesPath:
            activeTab = ActiveTab.Licenses;
            break;
        case matchmakePath:
            activeTab = ActiveTab.Matchmake;
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
            <HuntNav activeTab={activeTab} goTo={goTo} />
            <Switch>
                <Route
                    exact
                    path={matchesPath}
                    render={(props) => {
                        return (
                            <MatchesAdapter
                                matchmakingCompleteSignal={matchmakeCompleteSignal}
                                hunt={currentHunt}
                                {...props}
                            />
                        );
                    }}
                />
                <Route
                    exact
                    path={matchmakePath}
                    render={() => {
                        return <Matchmake hunt={currentHunt} />;
                    }}
                />
                <Route>
                    {props.match.isExact ? licensesAdapter : <Redirect to={AppPaths.huntPath(currentHunt)} />}
                </Route>
            </Switch>
        </>
    );
}