import React from 'react';
import { Container } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import { renderPropWrap } from '../../../generics/ModalWrapper';
import RoutedModals, { Props as RouteSwitcherProps } from '../../../generics/RoutedModals';
import Matchmake from '../matches/Matchmake';
import NextRound from '../rounds/NextRound';
import SwitchBar, { Props as SwitchBarProps } from './SwitchBar';

type Props = RouteComponentProps & {
    currentHunt: HuntWithProperties;
    /** Function to be called if this component changes something and hunt data may need to be reloaded.
     * @param updatedHuntProperties The modified portion of the hunt properties.
     */
    onChanged?: (updatedHuntProperties?: Partial<HuntWithProperties>) => void;
};

type Mapping = {
    modal: RouteSwitcherProps['routeMap'][number]['modal'];
    route: RouteSwitcherProps['routeMap'][number]['route'];
    title: React.ReactNode;
};

export const ACTION_ROUTES = {
    addLicenses: AppPaths.ADD_LICENSES_EXTENSION,
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

    function dispatchAndHide(updatedHuntProperties?: Partial<HuntWithProperties>): void {
        props.onChanged?.(updatedHuntProperties);
        hideModals();
    }

    const routeMap: Mapping[] = [
        {
            modal: null,
            route: ACTION_ROUTES.addLicenses,
            title: 'Add Participants',
        },
        {
            modal: renderPropWrap({
                node: (
                    <Container fluid>
                        <Matchmake hunt={props.currentHunt} onMatchmake={hideModals} />
                    </Container>
                ),
                title: 'Matchmake',
            }),
            route: ACTION_ROUTES.matchmake,
            title: 'Matchmake',
        },
        {
            modal: null,
            route: ACTION_ROUTES.newMatch,
            title: 'New Match',
        },
        {
            modal: renderPropWrap({
                node: (
                    <Container fluid>
                        <NextRound hunt={props.currentHunt} onUpdated={dispatchAndHide} />
                    </Container>
                ),
                title: 'Next Round',
            }),
            route: ACTION_ROUTES.nextRound,
            title: 'Next Round',
        },
    ];

    const buttonMappings: SwitchBarProps['buttonMappings'] = routeMap.map(({ route, title }) => {
        return { buttonContent: title, path: route };
    });

    return (
        <>
            <SwitchBar onSelection={showModal} buttonMappings={buttonMappings} />
            <RoutedModals {...props} onHide={hideModals} routeMap={routeMap} />
        </>
    );
}
