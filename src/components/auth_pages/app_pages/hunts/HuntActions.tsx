import React from 'react';
import { ButtonProps, Container } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import urljoin from 'url-join';
import { HuntWithProperties } from '../../../../models/Hunt';
import * as AppPaths from '../../../../routes/AppPaths';
import RoutedModalPairGenerator, { RoutedModalPair } from '../../../generics/modalPairGenerator';
import Matchmake from '../matches/Matchmake';
import NextRound from '../rounds/NextRound';
import AddParticipantsButton from './AddParticipantsButton';
import ButtonBar from './ButtonBar';

type Props = {
    currentHunt: HuntWithProperties;
    /** Function to be called if this component changes something and hunt data may need to be reloaded.
     * @param updatedHuntProperties The modified portion of the hunt properties.
     */
    onChanged?: (updatedHuntProperties?: Partial<HuntWithProperties>) => void;
};

const BUTTON_VARIANT: ButtonProps['variant'] = 'outline-dark';

export const ACTION_ROUTES = {
    matchmake: AppPaths.MATCHMAKE_EXTENSION,
    nextRound: AppPaths.NEXT_ROUND_EXTENSION,
    newMatch: AppPaths.NEW_MATCH_EXTENSION,
};

export default function HuntActions(props: Props): JSX.Element {
    const [location, history] = [useLocation(), useHistory()];

    /**
     * Gets the path among the provided ones which is currently being shown.
     * Returns undefined if none of the given paths match.
     * @param paths The paths to be tested.
     */
    function currentModalPath(paths?: string | string[]): string | undefined {
        let value: string | undefined;
        if (!paths) {
            value = currentModalPath(Object.values(ACTION_ROUTES));
        } else if (Array.isArray(paths)) {
            // In this case, find should get the first one that doesn't return undefined.
            value = paths.find(currentModalPath);
        } else {
            value = (new RegExp(`${paths}/?`).test(location.pathname) || undefined) && paths;
        }
        return value;
    }

    function pathWithoutModals(): string {
        const currentModal = currentModalPath();
        return currentModal ? location.pathname.replace(currentModal, '') : location.pathname;
    }

    function hideModals(): void {
        const newPath = pathWithoutModals();
        if (newPath != location.pathname) {
            // Just remove the last part of the URL.
            history.push(newPath);
        }
    }

    function showModal(path: string): void {
        if (!currentModalPath(path)) {
            history.push(urljoin(pathWithoutModals(), path));
        }
    }

    function dispatchAndHide(updatedHuntProperties?: Partial<HuntWithProperties>): void {
        props.onChanged?.(updatedHuntProperties);
        hideModals();
    }

    const generator: RoutedModalPairGenerator = new RoutedModalPairGenerator(
        showModal,
        { variant: BUTTON_VARIANT },
        { modalOptions: { size: 'lg', onHide: hideModals }, headerOptions: { closeButton: true } },
    );

    const routedModals: RoutedModalPair[] = [
        generator.generate('Matchmake', {
            content: (
                <Container fluid>
                    <Matchmake hunt={props.currentHunt} onMatchmake={hideModals} />
                </Container>
            ),
            route: ACTION_ROUTES.matchmake,
            modalTitle: 'Matchmake',
        }),
        generator.generate('New Match', {
            content: null,
            route: ACTION_ROUTES.newMatch,
            modalTitle: 'New Match',
        }),
        generator.generate('Next Round', {
            content: (
                <Container fluid>
                    <NextRound hunt={props.currentHunt} onUpdated={dispatchAndHide} />
                </Container>
            ),
            route: ACTION_ROUTES.nextRound,
            modalTitle: 'Next Round',
        }),
    ];

    const modalRoutes = routedModals.map(({ routedModal }, i) => (
        <React.Fragment key={i}>{routedModal}</React.Fragment>
    ));
    const buttons = routedModals.map(({ button }) => button);
    buttons.unshift(<AddParticipantsButton variant={BUTTON_VARIANT} hunt={props.currentHunt} />);

    return (
        <>
            <ButtonBar buttons={buttons} />
            {modalRoutes}
        </>
    );
}
