import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import License from '../../../../models/License';
import LicenseSearch from './LicenseSearch';

/** Maximum number of licenses to retrieve in a search. */
const RESULTS_LIMIT = 7;

export type LicensePairing = [License, License];

export type Props = {
    /** A function to be called in order to search licenses and retrieve results. */
    search: (query: string, resultLimit: number) => Promise<License[]>;
    pairings: Partial<LicensePairing>[];
    setPairings: (pairings: Partial<LicensePairing>[]) => void;
    onSubmit: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
};

export default function MatchCreateForm({
    search,
    pairings,
    setPairings,
    onSubmit,
    disabled,
    children,
}: Props): JSX.Element {
    function clonePairings(): Partial<LicensePairing>[] {
        return pairings.map((pairing) => pairing.slice() as LicensePairing);
    }

    function updatePairings(license: License | undefined, row: number, column: number): void {
        const pairingsCopy = clonePairings();
        pairingsCopy[row][column] = license;
        setPairings(pairingsCopy);
    }

    function addRow(): void {
        setPairings([...pairings, [undefined, undefined]]);
    }

    function licenseSearch(text: string): Promise<License[]> {
        return search(text, RESULTS_LIMIT);
    }

    function removeRow(row: number): void {
        const pairingsCopy = clonePairings();
        pairingsCopy.splice(row, 1);
        setPairings(pairingsCopy);
    }

    function emptyPairings(): boolean {
        return pairings.length <= 0 || pairings.some((pairing) => pairing.some((pair) => !pair));
    }

    const pairingsEmpty = emptyPairings();

    // Add a row on component mount so the user starts with one.
    useEffect(() => {
        addRow();
    }, []);

    return (
        <>
            {pairings.map((licenses, i) => {
                return (
                    <Row className="py-1" key={i}>
                        {licenses.map((license, j) => {
                            return (
                                <Col key={j}>
                                    {
                                        <LicenseSearch
                                            value={license}
                                            disabled={disabled}
                                            licenseSearcher={licenseSearch}
                                            onLicenseSelected={(license) => updatePairings(license, i, j)}
                                        />
                                    }
                                </Col>
                            );
                        })}
                        <button className="btn-default btn" onClick={() => removeRow(i)}>
                            <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className="bi bi-x"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
                                />
                            </svg>
                        </button>
                    </Row>
                );
            })}
            {children}
            <Row className="py-3 px-5 justify-content-between">
                <Button onClick={onSubmit} disabled={disabled || pairingsEmpty} variant="success">
                    Create
                </Button>
                <button className="btn-default btn" onClick={addRow} disabled={disabled}>
                    <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        className="bi bi-plus-square"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                        />
                    </svg>
                </button>
            </Row>
        </>
    );
}
