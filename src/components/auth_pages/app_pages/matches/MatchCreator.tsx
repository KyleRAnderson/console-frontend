import React, { useState } from 'react';
import { getLicenses } from '../../../../api/licenseAPI';
import { asMatchErrorResponse, EditMatchErrorResponse, editMatches } from '../../../../api/matchAPI';
import Hunt from '../../../../models/Hunt';
import License from '../../../../models/License';
import { createNotification } from '../../../../notification';
import MatchCreateErrors from './MatchCreateErrors';
import MatchCreateForm, { LicensePairing } from './MatchCreateForm';

export type Props = {
    /** The hunt (either object or ID) for which to create the matches. */
    hunt: Hunt | string;
    /** Called when the request to create matches has succeeded. */
    onSuccess?: () => void;
};

export default function MatchCreator(props: Props): JSX.Element {
    const [currentErrors, setCurrentErrors] = useState<EditMatchErrorResponse | undefined>();
    const [pairings, setPairings] = useState<Partial<LicensePairing>[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function handleSubmit(): void {
        if (pairings.every((pairing) => pairing.every((license) => license !== undefined))) {
            setIsSubmitting(true);
            editMatches(props.hunt, {
                pairings: (pairings as LicensePairing[]).map(
                    (licenses) => licenses.map((license) => license.id) as [string, string],
                ),
            })
                .then(() => {
                    createNotification({ type: 'success', message: 'Match creation in progress 👍' });
                    props.onSuccess?.();
                })
                .catch((error) => {
                    const castedError = asMatchErrorResponse(error);
                    castedError && setCurrentErrors(castedError);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    }

    async function handleSearch(term: string, limit: number): Promise<License[]> {
        const {
            data: { licenses },
        } = await getLicenses(props.hunt, { q: term, page: 1, per_page: limit });
        return licenses;
    }

    return (
        <MatchCreateForm
            pairings={pairings}
            setPairings={setPairings}
            search={handleSearch}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
        >
            <MatchCreateErrors errors={currentErrors} />
        </MatchCreateForm>
    );
}
