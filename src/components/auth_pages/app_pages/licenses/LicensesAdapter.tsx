import React, { useEffect, useMemo, useState } from 'react';
import { getLicenses, LicenseFilters } from '../../../../api/licenseAPI';
import License from '../../../../models/License';
import { createNotification } from '../../../../notification';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import PaginatedElement from '../../../generics/PaginatedElement';
import ToggleEliminated from './ToggleEliminated';

export type Props = {
    huntId: string;
    participantProperties: string[];
    filters?: LicenseFilters;
    currentSearch?: string;
};

export default function LicensesAdapter(props: Props) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [licenses, setLicenses] = useState<License[]>();

    function loadLicenses(): void {
        getLicenses(props.huntId, { page: currentPage, q: props.currentSearch, ...props.filters })
            .then(({ data: { num_pages: numPages, licenses } }) => {
                setNumPages(numPages);
                setLicenses(licenses);
            })
            .catch(() => createNotification({ type: 'danger', message: 'Failed to load licenses' }));
    }

    function handleUpdate(updatedLicense: License): void {
        if (!licenses) return;

        const index = licenses.findIndex(({ id }) => updatedLicense.id === id);
        if (index >= 0) {
            const licensesCopy = [...licenses];
            licensesCopy[index] = updatedLicense;
            setLicenses(licensesCopy);
        }
    }

    // Order of hooks here matters. Must update page number before loading.
    useEffect(() => {
        setCurrentPage(1);
    }, [props.filters, props.currentSearch]);

    useEffect(loadLicenses, [currentPage, props.filters, props.currentSearch]);

    const propertyMappings = useMemo<PropertyMapping<License>[]>(() => {
        return [
            ['First', ({ participant: { first } }) => first],
            ['Last', ({ participant: { last } }) => last],
            ...props.participantProperties.map(
                (property): PropertyMapping<License> => {
                    return [property, ({ participant: { extras } }) => extras[property]];
                },
            ),
            [
                'Eliminated',
                ({ eliminated }) => {
                    return eliminated ? 'Yes' : 'No';
                },
            ],
            [
                'Toggle',
                (license) => {
                    return (
                        <td key={license.id}>
                            <ToggleEliminated license={license} onUpdated={handleUpdate} />
                        </td>
                    );
                },
            ],
        ];
    }, [props.participantProperties]);

    const participantsTable: React.ReactNode = (
        <LoadUntilReady isLoaded={!!licenses}>
            <GenericTable<License> propertyMappings={propertyMappings} values={licenses || []} />
        </LoadUntilReady>
    );

    return (
        <PaginatedElement currentPage={currentPage} numPages={numPages} onSetPage={setCurrentPage}>
            {participantsTable}
        </PaginatedElement>
    );
}
