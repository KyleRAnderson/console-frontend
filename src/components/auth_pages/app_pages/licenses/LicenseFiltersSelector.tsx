import React from 'react';
import { LicenseFilters } from '../../../../api/licenseAPI';
import { Form, Row, Col } from 'react-bootstrap';

export type Props = {
    filtersChanged: (filterChange: Partial<LicenseFilters>) => void;
    currentFilters: LicenseFilters;
};

export default function LicenseFiltersSelector(props: Props): JSX.Element {
    const eliminatedValue: string =
        typeof props.currentFilters.eliminated === 'boolean' ? props.currentFilters.eliminated.toString() : '';

    function handleEliminatedChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        let newValue: boolean | undefined = undefined;
        if (event.target.value === 'true' || event.target.value === 'false') {
            newValue = event.target.value === 'true';
        }
        props.filtersChanged({ eliminated: newValue });
    }

    return (
        <Form inline>
            <Row>
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
            </Row>
        </Form>
    );
}
