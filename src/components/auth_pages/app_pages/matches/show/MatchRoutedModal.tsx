import React, { useCallback, useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import Hunt from '../../../../../models/Hunt';
import Match from '../../../../../models/Match';
import { matchPath } from '../../../../../routes/AppPaths';
import MatchDetails, { Props as MatchDetailsProps } from './MatchDetails';
import MatchRouteLoader from './MatchRouteLoader';

export type Props = Pick<MatchDetailsProps, 'onSwitchMatch'> & {
    /** Hunt or hunt ID. */
    hunt: Hunt | string;
    /** Function to call when the modal needs to hide. */
    onHide: () => void;
    /** A pre-loaded match, so that we can skip loading this one. */
    match?: Match | null;
    /** Called when the match is loaded. */
    setMatch: (loadedMatch: Match | undefined | null) => void;
};

/** Routed modal for displaying a match. */
export default function MatchRoutedModal({ hunt, onHide, match, setMatch, ...matchDetailsProps }: Props): JSX.Element {
    const [showModal, setShowModal] = useState<boolean>(true);

    useEffect(() => {
        setShowModal(true);
    }, [match]);

    const onReload = useCallback(() => {
        setMatch(null);
    }, [setMatch]);

    return (
        <Route
            exact
            path={matchPath(hunt)}
            render={() => {
                return (
                    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} onExited={onHide}>
                        <Modal.Header closeButton>
                            <Modal.Title>Match {match?.local_id || 'Loading...'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <MatchRouteLoader hunt={hunt} onLoaded={setMatch} isLoaded={!!match} onReload={onReload}>
                                {match && (
                                    <Container fluid>
                                        <MatchDetails
                                            match={match}
                                            onMatchUpdated={(updatedProperties) => {
                                                setMatch({ ...match, ...updatedProperties });
                                            }}
                                            {...matchDetailsProps}
                                        />
                                    </Container>
                                )}
                            </MatchRouteLoader>
                        </Modal.Body>
                    </Modal>
                );
            }}
        />
    );
}
