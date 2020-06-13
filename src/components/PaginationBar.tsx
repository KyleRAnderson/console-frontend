import React from 'react';
import { Container, Row, Pagination } from 'react-bootstrap';

type Props = {
    onSetPage?: (pageNumber: number) => void;
    includeFirstLast?: boolean;
    numPages: number;
    currentPage?: number;
};

export default function PaginationBar(props: Props): JSX.Element {
    const paginationFirstLast: [React.ReactNode, React.ReactNode] =
        props.includeFirstLast && props.numPages > 0
            ? [
                  <Pagination.First key="first" onClick={() => props.onSetPage?.(1)} />,
                  <Pagination.Last key="last" onClick={() => props.onSetPage?.(props.numPages)} />,
              ]
            : [null, null];

    const paginationItems: React.ReactNode[] = [];

    for (let pageNum = 1; pageNum <= props.numPages; pageNum++) {
        paginationItems.push(
            <Pagination.Item
                key={pageNum}
                onClick={() => props.onSetPage?.(pageNum)}
                active={props.currentPage === pageNum}
            >
                {pageNum}
            </Pagination.Item>,
        );
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Pagination>
                    {paginationFirstLast[0]}
                    {paginationItems}
                    {paginationFirstLast[1]}
                </Pagination>
            </Row>
        </Container>
    );
}
