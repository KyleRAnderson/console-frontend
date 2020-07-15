import React from 'react';
import { Container } from 'react-bootstrap';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import urljoin from 'url-join';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import LicensesList from '../licenses/LicensesList';
import MatchesList from '../matches/MatchesList';
import HuntActions, { ACTION_ROUTES } from './HuntActions';
import HuntNav, { ActiveTab } from './HuntNav';

type Props = {
    currentHunt: HuntWithProperties;
    onHuntPropertiesUpdated: (newHuntProperties?: Partial<HuntWithProperties>) => void;
    /** True if there are new matches to be loaded, false otherwise. */
    newMatches?: boolean;
    /** Function to set whether or not there are new matches. Should be provided if setNewMatches is provided. */
    setNewMatches?: (newMatches: boolean) => void;
};

export default function HuntNavigator(props: Props): JSX.Element {
    const currentHunt = props.currentHunt;
    const history = useHistory();
    const location = useLocation();

    const licensesPath: string = AppPaths.huntPath(currentHunt);
    const matchesPath: string = AppPaths.matchesPath(currentHunt);

    function goToHunt(): void {
        history.push(licensesPath);
    }

    function goToMatches(): void {
        history.push(matchesPath);
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
    switch (location.pathname) {
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
        <LicensesList huntId={currentHunt.id} participantProperties={currentHunt.roster.participant_properties} />
    );

    const possibleRouteExtensions = `(${Object.values(ACTION_ROUTES).join('|')})?`;
    return (
        <>
            <Container fluid className="py-1">
                <HuntNav activeTab={activeTab} goTo={goTo} />
            </Container>
            <Container fluid className="py-1">
                <Route>
                    <HuntActions onChanged={props.onHuntPropertiesUpdated} currentHunt={currentHunt} />
                </Route>
            </Container>
            <Switch>
                <Route
                    exact
                    path={urljoin(matchesPath, possibleRouteExtensions)}
                    render={(routeProps) => {
                        return (
                            <>
                                <MatchesList
                                    onMatchesLoaded={() => props.setNewMatches?.(false)}
                                    newMatches={props.newMatches}
                                    hunt={currentHunt}
                                    {...routeProps}
                                />
                            </>
                        );
                    }}
                />
                <Route exact path={urljoin(licensesPath, possibleRouteExtensions)}>
                    {licensesView}
                </Route>
                <Route>
                    <Redirect to={AppPaths.huntPath(currentHunt)} />
                </Route>
            </Switch>
        </>
    );
}
