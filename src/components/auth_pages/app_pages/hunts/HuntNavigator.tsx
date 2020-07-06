import MiniSignal from 'mini-signals';
import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import LicensesList from '../licenses/LicensesList';
import MatchesAdapter from '../matches/MatchesAdapter';
import HuntActions, { ACTION_ROUTES } from './HuntActions';
import HuntNav, { ActiveTab } from './HuntNav';

type Props = RouteComponentProps<{ [AppPaths.HUNT_ID_PARAM]: string }> & {
    currentHunt: HuntWithProperties;
    matchmakingCompleteSignal?: MiniSignal;
};

export default function HuntNavigator(props: Props): JSX.Element {
    const updateSignal = useRef<MiniSignal>(new MiniSignal());
    const currentHunt = props.currentHunt;

    const licensesPath: string = AppPaths.huntPath(currentHunt);
    const matchesPath: string = AppPaths.matchesPath(currentHunt);

    // Relay through the matchmaking complete signal.
    props.matchmakingCompleteSignal?.add(() => updateSignal.current.dispatch());

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
    const licensesView: React.ReactNode = (
        <LicensesList
            huntId={props.match.params[AppPaths.HUNT_ID_PARAM]}
            participantProperties={currentHunt.roster.participant_properties}
            updateSignal={updateSignal.current}
        />
    );

    const possibleRouteExtensions = `(${Object.values(ACTION_ROUTES).join('|')})?`;
    return (
        <>
            <Container fluid className="py-1">
                <HuntNav activeTab={activeTab} goTo={goTo} />
            </Container>
            <Container fluid className="py-1">
                <Route>
                    <HuntActions
                        onChanged={() => updateSignal.current.dispatch()}
                        {...props}
                        currentHunt={currentHunt}
                    />
                </Route>
            </Container>
            <Switch>
                <Route
                    exact
                    path={`${matchesPath}${possibleRouteExtensions}`}
                    render={(props) => {
                        return (
                            <>
                                <MatchesAdapter updateSignal={updateSignal.current} hunt={currentHunt} {...props} />
                            </>
                        );
                    }}
                />
                <Route exact path={`${licensesPath}${possibleRouteExtensions}`}>
                    {licensesView}
                </Route>
                <Route>
                    <Redirect to={AppPaths.huntPath(currentHunt)} />
                </Route>
            </Switch>
        </>
    );
}
