import React, { useMemo } from 'react';
import { Button, ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import { OverlayChildren } from 'react-bootstrap/Overlay';
import { useHistory } from 'react-router-dom';
import Hunt from '../../../../models/Hunt';
import License from '../../../../models/License';
import { matchPath } from '../../../../routes/AppPaths';

export type Props = {
    matchNumbers: License['match_numbers'];
    licenseId: string;
    hunt: string | Hunt;
};

/**
 * A popover list of matches for a license. Includes links to navigate to the details page for each one.
 */
export default function MatchesPopover({ hunt, matchNumbers, licenseId }: Props): JSX.Element {
    // Direct reference to matchNumbers doesn't work here, so we use the lambda.
    const sortedMatches: number[] = useMemo(() => matchNumbers.sort(), [matchNumbers]);
    const history = useHistory();

    function handleItemClick(clickedMatch: number): void {
        history.push(matchPath(hunt, clickedMatch.toString()));
    }

    const popover: OverlayChildren = (
        <Popover id={`${licenseId}_matches_list_popout`}>
            <Popover.Title>Matches</Popover.Title>
            <Popover.Content>
                {sortedMatches.length > 0 ? (
                    <ListGroup>
                        {sortedMatches.map((matchNumber) => {
                            return (
                                <ListGroup.Item key={matchNumber} action onClick={() => handleItemClick(matchNumber)}>
                                    {matchNumber}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                ) : (
                    'No matches'
                )}
            </Popover.Content>
        </Popover>
    );
    return (
        <OverlayTrigger trigger="click" placement="left" overlay={popover}>
            <Button variant="info">Matches</Button>
        </OverlayTrigger>
    );
}
