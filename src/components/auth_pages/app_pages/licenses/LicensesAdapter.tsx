import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { getLicenses, LicenseFilters } from '../../../../api/licenseAPI';
import License from '../../../../models/License';
import { createNotification } from '../../../../notification';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import PaginatedElement from '../../../generics/PaginatedElement';
import ToggleEliminated from './ToggleEliminated';
import { ButtonGroup } from 'react-bootstrap';
import DeleteButton from './DeleteButton';
import MatchesPopover from './MatchesPopover';

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

    const findIndexById = useCallback(
        function findIndexById(licenseId: string): number {
            return licenses ? licenses.findIndex(({ id }) => licenseId === id) : -1;
        },
        [licenses],
    );

    const handleUpdate = useCallback(
        function handleUpdate(updatedLicense: License): void {
            const index = findIndexById(updatedLicense.id);
            if (index >= 0) {
                const licensesCopy = [...(licenses as License[])]; // findIndexById returns -1 if licenses not defined.
                licensesCopy[index] = updatedLicense;
                setLicenses(licensesCopy);
            }
        },
        [findIndexById],
    );

    const handleRemoved = useCallback(
        function handleRemoved(removedLicenseId: string): void {
            const index = findIndexById(removedLicenseId);
            if (index >= 0) {
                const licensesCopy = [...(licenses as License[])]; // findIndexById returns -1 if licenses not defined.
                licensesCopy.splice(index, 1);
                setLicenses(licensesCopy);
            }
        },
        [findIndexById],
    );

    // Order of hooks here matters. Must update page number before loading.
    useEffect(() => {
        setCurrentPage(1);
    }, [props.filters, props.currentSearch]);

    useEffect(loadLicenses, [currentPage, props.filters, props.currentSearch]);

    const generateActionButtons = useCallback(
        function generateActionButtons(license: License): React.ReactNode {
            return (
                <td key={license.id}>
                    <ButtonGroup>
                        <ToggleEliminated license={license} onUpdated={handleUpdate} />
                        <DeleteButton license={license} onDelete={handleRemoved} />
                        <MatchesPopover
                            hunt={props.huntId}
                            licenseId={license.id}
                            matchNumbers={license.match_numbers}
                        />
                    </ButtonGroup>
                </td>
            );
        },
        [handleUpdate, handleRemoved],
    );

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
            ['Actions', generateActionButtons],
        ];
    }, [props.participantProperties, generateActionButtons]);

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
