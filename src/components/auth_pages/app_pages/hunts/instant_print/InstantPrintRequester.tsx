import React, { useEffect, useState } from 'react';
import { asInstantPrintError, instantPrint, InstantPrintArgs } from '../../../../../api/licenseAPI';
import { HuntWithProperties } from '../../../../../models/Hunt';
import { createNotification } from '../../../../../notification';
import InstantPrintForm from './InstantPrintForm';

export type Props = {
    hunt: HuntWithProperties;
    onSuccess?: (printArgs?: InstantPrintArgs) => void;
};

/**
 * Component wrapper for the InstantPrintForm which handles making requests to actually begin instant printing.
 */
export default function InstantPrintRequester({ hunt, onSuccess }: Props): JSX.Element {
    const [hasTemplate, setHasTemplate] = useState<boolean>(!!hunt.attachment_urls.template_pdf);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        setHasTemplate(!!hunt.attachment_urls.template_pdf);
    }, [hunt]);

    function handleSubmit(printArgs?: InstantPrintArgs): void {
        setIsSubmitting(true);
        instantPrint(hunt, printArgs)
            .finally(() => {
                setIsSubmitting(false);
            })
            .then(() => {
                createNotification({ type: 'info', message: 'Printing in progress...' });
                onSuccess?.(printArgs);
            })
            .catch((error) => {
                let message = 'Failed to start the press';
                let title: string | undefined;
                const errorMessage = asInstantPrintError(error);
                if (errorMessage) {
                    title = message;
                    message = errorMessage;
                }
                createNotification({ type: 'danger', message: message, title: title });
            });
    }

    return <InstantPrintForm hunt={hunt} onSubmit={handleSubmit} disabled={!hasTemplate || isSubmitting} />;
}
