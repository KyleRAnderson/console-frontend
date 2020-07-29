import React, { useEffect } from 'react';
import { getMatch } from '../../../../../api/matchAPI';
import Hunt from '../../../../../models/Hunt';
import Match from '../../../../../models/Match';
import LoadUntilReady from '../../../../generics/LoadUntilReady';

export type Props = {
    /** Children which will only be displayed if the match has been loaded. */
    children: React.ReactNode;
    matchNumber: string | number;
    /** Hunt object or hunt ID. */
    hunt: Hunt | string;
    isLoaded: boolean;
    /** Function to call with a newly loaded match. */
    onLoaded: (match: Match) => void;
};

export default function MatchLoader({ children, matchNumber, isLoaded, onLoaded, hunt }: Props): JSX.Element {
    function loadMatch(): void {
        getMatch(hunt, matchNumber).then(({ data: match }) => {
            onLoaded(match);
        });
    }

    useEffect(() => {
        !isLoaded && loadMatch();
    }, [isLoaded]);

    return <LoadUntilReady isLoaded={isLoaded}>{children}</LoadUntilReady>;
}
