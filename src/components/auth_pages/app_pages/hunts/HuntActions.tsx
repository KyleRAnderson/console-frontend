import React from 'react';
import { Container } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import RoutedModals, { Props as RouteSwitcherProps } from '../../../generics/RoutedModals';
import Matchmake from '../matches/Matchmake';
import NextRound from '../rounds/NextRound';
import SwitchBar, { Props as SwitchBarProps } from './SwitchBar';

type Props = {
    currentHunt: HuntWithProperties;
    /** Function to be called if this component changes something and hunt data may need to be reloaded.
     * @param updatedHuntProperties The modified portion of the hunt properties.
     */
    onChanged?: (updatedHuntProperties?: Partial<HuntWithProperties>) => void;
};

export const ACTION_ROUTES = {
    matchmake: AppPaths.MATCHMAKE_EXTENSION,
    nextRound: AppPaths.NEXT_ROUND_EXTENSION,
    newMatch: AppPaths.NEW_MATCH_EXTENSION,
};

export default function HuntActions(props: Props): JSX.Element {
    const [location, history] = [useLocation(), useHistory()];

    function isShowingModal(paths?: string | string[]): boolean {
        let value: boolean;
        if (!paths) {
            value = isShowingModal(Object.values(ACTION_ROUTES));
        } else if (Array.isArray(paths)) {
            value = paths.some(isShowingModal);
        } else {
            value = new RegExp(`${paths.replace('/', '')}\/?`).test(location.pathname);
        }
        return value;
    }

    function pathWithoutModals(): string {
        return isShowingModal() ? location.pathname.replace(/[^\/]+\/?$/, '') : location.pathname;
    }

    function hideModals(): void {
        const newPath = pathWithoutModals();
        if (newPath != location.pathname) {
            // Just remove the last part of the URL.
            history.push(newPath);
        }
    }

    function showModal(path: string): void {
        if (!isShowingModal(path)) {
            history.push(`${pathWithoutModals()}${path}`);
        }
    }

    function dispatchAndHide(updatedHuntProperties?: Partial<HuntWithProperties>): void {
        props.onChanged?.(updatedHuntProperties);
        hideModals();
    }

    const routeMap: RouteSwitcherProps['routeMap'] = [
        {
            elementInModal: (
                <Container fluid>
                    <Matchmake hunt={props.currentHunt} onMatchmake={hideModals} />
                </Container>
            ),
            route: ACTION_ROUTES.matchmake,
            modalTitle: 'Matchmake',
        },
        {
            elementInModal: null,
            route: ACTION_ROUTES.newMatch,
            modalTitle: 'New Match',
        },
        {
            elementInModal: (
                <Container fluid>
                    <NextRound hunt={props.currentHunt} onUpdated={dispatchAndHide} />
                </Container>
            ),
            route: ACTION_ROUTES.nextRound,
            modalTitle: 'Next Round',
        },
    ];

    const buttonMappings: SwitchBarProps['buttonMappings'] = routeMap.map(({ route, modalTitle: modalHeader }) => {
        return { buttonContent: modalHeader, path: route };
    });

    return (
        <>
            <SwitchBar onSelection={showModal} buttonMappings={buttonMappings} />
            <RoutedModals {...props} onHide={hideModals} routeMap={routeMap} />
        </>
    );
}
