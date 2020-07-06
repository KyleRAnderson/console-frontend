import React from 'react';
import SwitchBar, { Props as SwitchBarProps } from './SwitchBar';
import RoutedModals, { Props as RouteSwitcherProps } from '../../../generics/RoutedModals';
import { RouteComponentProps } from 'react-router-dom';
import Matchmake from '../matches/Matchmake';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import { Container } from 'react-bootstrap';
import NextRound from '../rounds/NextRound';

type Props = RouteComponentProps & {
    currentHunt: HuntWithProperties;
    /** Function to be called if this component changes something and hunt data may need to be reloaded. */
    onChanged?: () => void;
};

export const ACTION_ROUTES = {
    matchmake: AppPaths.MATCHMAKE_EXTENSION,
    nextRound: AppPaths.NEXT_ROUND_EXTENSION,
    newMatch: AppPaths.NEW_MATCH_EXTENSION,
};

export default function HuntActions(props: Props): JSX.Element {
    function isShowingModal(paths?: string | string[]): boolean {
        let value: boolean;
        if (!paths) {
            value = isShowingModal(Object.values(ACTION_ROUTES));
        } else if (Array.isArray(paths)) {
            value = paths.some(isShowingModal);
        } else {
            value = new RegExp(`${paths.replace('/', '')}\/?`).test(props.location.pathname);
        }
        return value;
    }

    function pathWithoutModals(): string {
        return isShowingModal() ? props.location.pathname.replace(/[^\/]+\/?$/, '') : props.location.pathname;
    }

    function hideModals(): void {
        const newPath = pathWithoutModals();
        if (newPath != props.location.pathname) {
            // Just remove the last part of the URL.
            props.history.push(newPath);
        }
    }

    function showModal(path: string): void {
        if (!isShowingModal(path)) {
            props.history.push(`${pathWithoutModals()}${path}`);
        }
    }

    function dispatchAndHide(): void {
        props.onChanged?.();
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