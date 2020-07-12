import React from 'react';
import { Container } from 'react-bootstrap';
import PaginationBar, { Props as PaginationBarProps } from '../PaginationBar';

export type PaginatedElementProps = Pick<PaginationBarProps, 'onSetPage' | 'currentPage' | 'numPages'> & {
    children?: React.ReactNode;
};

/**
 * Component for showing a pagination bar at the bottom of some child element.
 */
export default function PaginatedElement({ children, ...paginationProps }: PaginatedElementProps): JSX.Element {
    const paginationBar: React.ReactNode = (
        <Container>
            <PaginationBar {...paginationProps} includeFirstLast includeNextPrevious />
        </Container>
    );

    return (
        <>
            {children}
            {paginationBar}
        </>
    );
}
