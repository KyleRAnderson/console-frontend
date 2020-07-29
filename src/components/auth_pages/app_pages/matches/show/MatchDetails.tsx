import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import License from '../../../../../models/License';
import Match from '../../../../../models/Match';
import ToggleEliminated from '../../licenses/ToggleEliminated';

export type Props = {
    match: Match;
    /** To be called when some property of the match are updated. updatedProperties will only contain modified properties. */
    onMatchUpdated: (updatedProperties: Partial<Match>) => void;
    /** Called when the user attempts to switch the match being displayed. matchNumber is the new match to be rendered. */
    onSwitchMatch: (matchNumber: number) => void;
};

/** Displays information for a single match. */
export default function MatchDetails({ match, onMatchUpdated, onSwitchMatch }: Props): JSX.Element {
    function columnFor(
        license: Match['licenses'][number],
        identifier: string,
        children: React.ReactNode,
    ): React.ReactNode {
        return <Col key={`${license.id}_${identifier}`}>{children}</Col>;
    }

    function mapProperties(license: Match['licenses'][number]): React.ReactNode {
        return (
            <ul>
                {Object.keys(license.participant.extras).map((property) => {
                    return <li key={property}>{license.participant.extras[property]}</li>;
                })}
            </ul>
        );
    }

    function mapMatches(license: Match['licenses'][number]): React.ReactNode {
        return (
            <ul>
                {license.match_numbers.map((matchNumber) => {
                    return (
                        <li key={matchNumber}>
                            <Button
                                variant="link"
                                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                    event.preventDefault();
                                    onSwitchMatch(matchNumber);
                                }}
                            >
                                {matchNumber}
                            </Button>
                        </li>
                    );
                })}
            </ul>
        );
    }

    function handleUpdated(updatedRecord: License): void {
        const index = match.licenses.findIndex((license) => license.id === updatedRecord.id);
        if (index >= 0) {
            const licensesCopy = [...match.licenses];
            licensesCopy[index] = updatedRecord;
            onMatchUpdated({ licenses: licensesCopy });
        }
    }

    const licensesDisplay: React.ReactNode[][] = match.licenses.map((license) => {
        return [
            columnFor(
                license,
                'fullName',
                <h4>
                    {license.participant.first} {license.participant.last}
                </h4>,
            ),
            columnFor(license, 'properties', mapProperties(license)),
            columnFor(license, 'matches', mapMatches(license)),
            columnFor(license, 'eliminateButton', <ToggleEliminated license={license} onUpdated={handleUpdated} />),
        ];
    });

    return (
        <>
            {/* Full Name */}
            <Row>{licensesDisplay.map(([first]) => first)}</Row>
            {/* Properties */}
            <Row>{licensesDisplay.map(([, second]) => second)}</Row>
            {/* Matches */}
            <Row>{licensesDisplay.map(([, , third]) => third)}</Row>
            {/* Eliminate Button */}
            <Row>{licensesDisplay.map(([, , , fourth]) => fourth)}</Row>
        </>
    );
}
