import React from 'react';
import { Row } from 'react-bootstrap';
import { HuntWithProperties } from '../../../../../models/Hunt';
import InstantPrintLinks from './InstantPrintLinks';
import InstantPrintRequester from './InstantPrintRequester';
import TemplateUploader from './TemplateUploader';

export type Props = {
    hunt: HuntWithProperties;
    onSubmit?: () => void;
    /** Called if the hunt is modified during one of this component's operations.
     * Argument contains the updated properties of the hunt. */
    onHuntUpdated?: (updatedProperties: Partial<HuntWithProperties>) => void;
};

export default function InstantPrint({ hunt, onSubmit, onHuntUpdated }: Props): JSX.Element {
    return (
        <>
            <Row className="py-2">
                <InstantPrintLinks hunt={hunt} />
            </Row>
            <Row className="py-2">
                <TemplateUploader hunt={hunt} onHuntUpdated={onHuntUpdated} />
            </Row>
            <Row className="py-2">
                <InstantPrintRequester hunt={hunt} onSuccess={onSubmit} />
            </Row>
        </>
    );
}
