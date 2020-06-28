import React from 'react';
import { Container, Row, Pagination } from 'react-bootstrap';

// Largest amount of pages to show on either side of the current page.
const MAX_NUMBERS = 3;

type Props = {
    onSetPage?: (pageNumber: number) => void;
    includeFirstLast?: boolean;
    includeNextPrevious?: boolean;
    numPages: number;
    currentPage: number;
};

export default function PaginationBar(props: Props): JSX.Element {
    function createPage(page: number): React.ReactNode {
        return (
            <Pagination.Item key={page} onClick={() => props.onSetPage?.(page)} active={props.currentPage === page}>
                {page}
            </Pagination.Item>
        );
    }

    const paginationFirstLast: [React.ReactNode, React.ReactNode] =
        props.includeFirstLast && props.numPages > 0
            ? [
                  <Pagination.First
                      key="first"
                      disabled={props.currentPage == 1}
                      onClick={() => props.onSetPage?.(1)}
                  />,
                  <Pagination.Last
                      key="last"
                      disabled={props.currentPage === props.numPages}
                      onClick={() => props.onSetPage?.(props.numPages)}
                  />,
              ]
            : [null, null];

    const paginationNextPrevious: [React.ReactNode, React.ReactNode] =
        props.includeNextPrevious && props.numPages > 0
            ? [
                  <Pagination.Prev
                      key="previous"
                      disabled={props.currentPage == 1}
                      onClick={() => props.onSetPage?.(props.currentPage - 1)}
                  />,
                  <Pagination.Next
                      key="next"
                      disabled={props.currentPage === props.numPages}
                      onClick={() => props.onSetPage?.(props.currentPage + 1)}
                  />,
              ]
            : [null, null];

    const paginationItems: React.ReactNode[] = [];

    let pageStart = props.currentPage - MAX_NUMBERS;
    let pageEnd = props.currentPage + MAX_NUMBERS;
    const startEllipsis = pageStart > 1;
    const endEllipsis = pageEnd < props.numPages;
    // Basically Math.min and Math.max here, but need the above intermediary booleans for other purposes.
    if (pageStart <= 1) {
        // Start at 2 because we render 1 no matter what.
        pageStart = 2;
    }
    if (pageEnd >= props.numPages) {
        // Start at second last because we render the last no matter what.
        pageEnd = props.numPages - 1;
    }
    paginationItems.push(createPage(1));
    if (startEllipsis) {
        paginationItems.push(<Pagination.Ellipsis key="startEllipsis" />);
    }
    for (let pageNum = pageStart; pageNum <= pageEnd; pageNum++) {
        paginationItems.push(createPage(pageNum));
    }
    if (endEllipsis) {
        paginationItems.push(<Pagination.Ellipsis key="endEllipsis" />);
    }
    paginationItems.push(createPage(props.numPages));

    return (
        <Container>
            <Row className="justify-content-center">
                <Pagination>
                    {paginationFirstLast[0]}
                    {paginationNextPrevious[0]}
                    {paginationItems}
                    {paginationNextPrevious[1]}
                    {paginationFirstLast[1]}
                </Pagination>
            </Row>
        </Container>
    );
}
