import React from 'react';
import { Col } from 'react-bootstrap';
import Hunt from '../../../../../models/Hunt';

export default function InstantPrintLinks({ hunt }: { hunt: Hunt }) {
    const noPrintout = !hunt.attachment_urls.printout;
    const noTemplate = !hunt.attachment_urls.template_pdf;

    return (
        <>
            <Col>
                {noTemplate ? (
                    <p className="text-center">No template PDF, please upload one.</p>
                ) : (
                    <a href={hunt.attachment_urls.template_pdf as string} target="_blank" rel="noreferrer">
                        Download Template
                    </a>
                )}
            </Col>
            <Col>
                {noPrintout ? (
                    <p className="text-center">No previous printout. Try printing first.</p>
                ) : (
                    <a href={hunt.attachment_urls.printout as string} target="_blank" rel="noreferrer">
                        Download Last Print
                    </a>
                )}
            </Col>
        </>
    );
}
