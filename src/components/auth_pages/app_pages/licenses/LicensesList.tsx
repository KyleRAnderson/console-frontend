import React, { useState } from 'react';
import { Col, Container } from 'react-bootstrap';
import { LicenseFilters } from '../../../../api/licenseAPI';
import SearchBar from '../../../generics/SearchBar';
import LicenseFiltersSelector from './LicenseFiltersSelector';
import LicensesAdapter, { Props as AdapterProps } from './LicensesAdapter';

export default function LicensesList(props: Omit<AdapterProps, 'filters'>): JSX.Element {
    const [filters, setFilters] = useState<LicenseFilters>({ eliminated: false });
    const [search, setSearch] = useState<string | undefined>();

    return (
        <>
            <Container fluid className="py-1">
                <LicenseFiltersSelector currentFilters={filters} filtersChanged={setFilters}>
                    <Col md="4">
                        <SearchBar onSearch={setSearch} />
                    </Col>
                </LicenseFiltersSelector>
            </Container>
            <LicensesAdapter filters={filters} currentSearch={search} {...props} />
        </>
    );
}
