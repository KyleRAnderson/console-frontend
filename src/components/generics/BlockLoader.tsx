import React from 'react';
import GenericLoader, { Props as LoaderProps } from './GenericLoader';

const LOADER_PROPS = ['loadFunction', 'onError', 'onLoaded'] as const;
type SharedLoadProps<Record> = Pick<LoaderProps<Record>, typeof LOADER_PROPS[number]>;
export type Props<Record> = SharedLoadProps<Record> & {
    /** True to assert that the data has been loaded, false otherwise. */
    isLoaded: boolean;
    /** View to be shown when isLoaded is true. */
    children?: React.ReactNode;
};

/**
 * Wrapper for the GenericLoader to block its child components from being
 * viewed until the desired records have loaded.
 * @param props Component props, see type definitions.
 */
export default function BlockLoader<Record>(props: Props<Record>): JSX.Element {
    const { isLoaded, children, ...sharedProps } = props;

    if (!isLoaded) {
        return <GenericLoader<Record> {...sharedProps} />;
    }

    return <>{children}</>;
}
