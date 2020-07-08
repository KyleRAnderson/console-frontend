import React, { useState } from 'react';
import LicensesAdapter, { Props as AdapterProps } from './LicensesAdapter';
import { LicenseFilters } from '../../../../api/licenseAPI';
import LicenseFiltersSelector from './LicenseFiltersSelector';
import { Container } from 'react-bootstrap';

export default function LicensesList(props: Omit<AdapterProps, 'filters'>): JSX.Element {
    const [filters, setFilters] = useState<LicenseFilters>({ eliminated: false });

    return (
        <>
            <Container fluid className="py-1">
                <LicenseFiltersSelector currentFilters={filters} filtersChanged={setFilters} />
            </Container>
            <LicensesAdapter filters={filters} {...props} />
        </>
    );
}
