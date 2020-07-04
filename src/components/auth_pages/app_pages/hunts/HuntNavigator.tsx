import React from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import LicensesAdapter from '../licenses/LicensesAdapter';
import HuntNav, { ActiveTab } from './HuntNav';
import MatchesAdapter from '../matches/MatchesAdapter';
import MiniSignal from 'mini-signals';

type Props = RouteComponentProps<{ [AppPaths.HUNT_ID_PARAM]: string }> & {
    currentHunt: HuntWithProperties;
    matchmakingCompleteSignal?: MiniSignal;
};

export default function HuntNavigator(props: Props): JSX.Element {
    const currentHunt = props.currentHunt;
    const matchmakeCompleteSignal = props.matchmakingCompleteSignal;

    const licensesPath: string = AppPaths.huntPath(currentHunt);
    const matchesPath: string = AppPaths.matchesPath(currentHunt);

    function goToHunt(): void {
        props.history.push(licensesPath);
    }

    function goToMatches(): void {
        props.history.push(matchesPath);
    }

    function goTo(tab: ActiveTab): void {
        switch (tab) {
            case ActiveTab.Licenses:
                goToHunt();
                break;
            case ActiveTab.Matches:
                goToMatches();
                break;
        }
    }

    let activeTab: ActiveTab;
    switch (props.location.pathname) {
        case matchesPath:
            activeTab = ActiveTab.Matches;
            break;
        case licensesPath:
            activeTab = ActiveTab.Licenses;
            break;
        default:
            activeTab = ActiveTab.None;
            break;
    }
    const licensesAdapter: React.ReactNode = (
        <LicensesAdapter
            huntId={props.match.params[AppPaths.HUNT_ID_PARAM]}
            participantProperties={currentHunt.roster.participant_properties}
        />
    );

    return (
        <>
            <Container fluid className="py-1">
                <HuntNav activeTab={activeTab} goTo={goTo} />
            </Container>
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
