import { AxiosError } from 'axios';
import React from 'react';
import { Form } from 'react-bootstrap';
import { attachTemplatePdf } from '../../../../../api/huntAPI';
import Hunt from '../../../../../models/Hunt';
import { createNotification } from '../../../../../notification';
import { TEMPLATE_PDF_FORM_KEY } from '../../../../../routes/ApiPaths';

export type Props = {
    hunt: Hunt;
    /** Called if the hunt object is modified. Argument contains the updated values of the hunt only. */
    onHuntUpdated?: (updatedAttributes: Partial<Hunt>) => void;
};

export default function TemplateUploader({ hunt, onHuntUpdated }: Props): JSX.Element {
    function uploadFile(file: File): void {
        const formData = new FormData();
        formData.set(TEMPLATE_PDF_FORM_KEY, file);
        attachTemplatePdf(hunt, formData)
            .then(({ data: { url } }) => {
                createNotification({ type: 'success', message: 'Template Uploaded' });
                onHuntUpdated?.({ attachment_urls: { ...hunt.attachment_urls, template_pdf: url } });
            })
            .catch((error) => {
                let message = 'Failed to upload template';
                let title: string | undefined;
                if (typeof (error as AxiosError).response?.data === 'string') {
                    title = message;
                    message = error.response?.data;
                }
                createNotification({ type: 'danger', message: message, title: title });
            });
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            uploadFile(file);
            event.target.value = '';
        }
    }

    return (
        <Form>
            <Form.File custom onChange={handleChange} id="templateUpload" label="Upload Template"></Form.File>
        </Form>
    );
}
