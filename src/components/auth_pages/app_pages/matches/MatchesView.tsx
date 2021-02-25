import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Match from '../../../../models/Match';
import { matchesPath, matchPath } from '../../../../routes/AppPaths';
import MatchesList, { Props as MatchesListProps } from './MatchesList';
import MatchRoutedModal from './show/MatchRoutedModal';

export type Props = Omit<MatchesListProps, 'onMatchesLoaded'> & {
    /** Function which accepts a boolean of whether or not matches are currently up-to-date.
     * Passing false to this should reload matches and eventually down the line it should be set to true.
     */
    setAreMatchesLoaded: (areLoaded: boolean) => void;
};

/** View component for a match list and any other match items. */
export default function MatchesView({ setAreMatchesLoaded, ...matchesListProps }: Props): JSX.Element {
    const [currentMatch, setCurrentMatch] = useState<Match | undefined | null>();
    const history = useHistory();

    function handleOnHide(): void {
        setCurrentMatch(null);
        history.push(matchesPath(matchesListProps.hunt));
        setAreMatchesLoaded(false);
    }

    function switchMatch(newMatchNumber: number): void {
        if (newMatchNumber === currentMatch?.local_id) return; // No need to switch to where we already are.

        setCurrentMatch(null); // Clear so that nobody thinks this has been preloaded.
        history.push(matchPath(matchesListProps.hunt, newMatchNumber.toString()));
    }

    useEffect(() => {
        if (currentMatch) {
            const newPath = matchPath(matchesListProps.hunt, currentMatch.local_id.toString());
            if (history.location.pathname !== newPath) {
                history.push(newPath);
            }
        }
    }, [currentMatch]);

    return (
        <>
            <MatchRoutedModal
                hunt={matchesListProps.hunt}
                match={currentMatch}
                setMatch={setCurrentMatch}
                onHide={handleOnHide}
                onSwitchMatch={switchMatch}
            />
            <MatchesList
                onMatchSelected={setCurrentMatch}
                {...matchesListProps}
                onMatchesLoaded={() => setAreMatchesLoaded(true)}
            />
        </>
    );
}
