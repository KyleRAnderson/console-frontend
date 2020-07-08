import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { LicenseFilters } from '../../../../api/licenseAPI';

export type Props = {
    /** Function to call with the new updated filters. */
    filtersChanged: (newFilters: LicenseFilters) => void;
    currentFilters: LicenseFilters;
};

export default function LicenseFiltersSelector(props: Props): JSX.Element {
    const eliminatedValue: string =
        typeof props.currentFilters.eliminated === 'boolean' ? props.currentFilters.eliminated.toString() : '';

    function handleEliminatedChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let newValue: boolean | undefined = undefined;
        if (event.target.value === 'true' || event.target.value === 'false') {
            newValue = event.target.value === 'true';
        }
        props.filtersChanged({ ...props.currentFilters, eliminated: newValue });
    }

    return (
        <Form inline>
            <Form.Row>
                <Col md="4">
                    <Form.Group controlId="eliminatedFilter">
                        <Form.Label>Eliminated</Form.Label>
                        <Form.Control as="select" value={eliminatedValue} onChange={handleEliminatedChange}>
                            <option value="">All</option>
                            <option value="true">Eliminated</option>
                            <option value="false">Not Eliminated</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Form.Row>
        </Form>
    );
}
