import React from 'react';
import Loading from '../Loading';

type Props = {
    children: React.ReactNode;
    /** True if loading is done, false otherwise. */
    isLoaded: boolean;
};

/**
 * Component that simply doesn't show its children until the data has been loaded.
 */
export default function LoadUntilReady({ isLoaded, children }: Props) {
    return isLoaded ? <>{children}</> : <Loading />;
}
