import React from 'react';
import PaginationBar, { Props as PaginationBarProps } from '../PaginationBar';

export type PaginatedElementProps = Pick<PaginationBarProps, 'onSetPage' | 'currentPage' | 'numPages'> & {
    children?: React.ReactNode;
};

/**
 * Component for showing a pagination bar at the bottom of some child element.
 */
export default function PaginatedElement({ children, ...paginationProps }: PaginatedElementProps): JSX.Element {
    const paginationBar: React.ReactNode = <PaginationBar {...paginationProps} includeFirstLast includeNextPrevious />;

    return (
        <>
            {children}
            {paginationBar}
        </>
    );
}
