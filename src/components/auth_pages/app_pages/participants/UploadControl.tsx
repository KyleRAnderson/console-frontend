import React from 'react';
import { Form } from 'react-bootstrap';

export type Props = {
    onUpload: (data: FormData) => void;
};

export default function UploadControl(props: Props): JSX.Element {
    function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            const data: FormData = new FormData();
            data.append('file', file);
            props.onUpload?.(data);
            event.target.value = ''; // Clear everything
        }
    }

    return <Form.File id="participantsFileUpload" label="Upload Participants" custom onChange={onChange} />;
}
