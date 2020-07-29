import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { updateLicense } from '../../../../api/licenseAPI';
import License from '../../../../models/License';

export type Props = {
    license: Pick<License, 'id' | 'eliminated'>;
    /** Function to be called when a license object is updated. Argument is a full new license object. */
    onUpdated?: (updatedRecord: License) => void;
};

export default function ToggleEliminated({ license: { id, eliminated }, onUpdated }: Props): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        updateLicense(id, { eliminated: !eliminated })
            .then(({ data: updatedRecord }) => {
                onUpdated?.(updatedRecord);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    return (
        <Button type="button" variant={eliminated ? 'success' : 'danger'} onClick={handleClick} disabled={isSubmitting}>
            {eliminated ? 'Revive' : 'Eliminate'}
        </Button>
    );
}
