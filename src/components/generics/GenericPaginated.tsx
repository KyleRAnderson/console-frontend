import React, { useState } from 'react';
import GenericTable, { GenericTableProps } from './GenericTable';
import PaginatedLoader, { Props as LoaderProps } from './PaginatedLoader';

type Props<Model> = Pick<GenericTableProps<Model>, 'propertyMappings'> &
    Pick<LoaderProps<Model>, 'getValues' | 'updateSignal'>;

/**
 * A generic component for loading paginated data and displaying it using a GenericTable.
 * @param props Component props. See type definition.
 */
export default function GenericPaginated<Model>(props: Props<Model>): JSX.Element {
    const [data, setData] = useState<Model[]>([]);

    const table: React.ReactNode = (
        <GenericTable<Model> striped values={data} propertyMappings={props.propertyMappings} />
    );

    return (
        <PaginatedLoader<Model>
            table={table}
            updateValues={setData}
            getValues={props.getValues}
            updateSignal={props.updateSignal}
        />
    );
}
