import React from 'react';
import { Table, TableProps, Container, Row, Col } from 'react-bootstrap';

export type PropertyOfType<U, V> = {
    [P in keyof U]: U[P] extends V ? P : never;
}[keyof U];

export type PropertyMapping<T> = [
    /** The display value for the column's header */
    React.ReactNode,
    /** A binding at which to find the value. This can either be a string key at which to extract the value, or
     * a function that accepts the object type and extracts its value. If the return value of the function is an object,
     * then you will need to wrap a <td> around it with the key.
     */
    PropertyOfType<T, React.ReactNode> | ((value: T) => React.ReactNode),
];

/* Note that T can still have properties that aren't of type React.ReactNode, but they won't be known of
which is fine since for non ReactNode properties, we will want a function to get the value out of the model.*/
export type GenericTableProps<T> = TableProps & {
    propertyMappings: PropertyMapping<T>[];
    values: T[];
};

export default function GenericTable<T>(props: GenericTableProps<T>): JSX.Element {
    function valueEntry(value: T, converter: GenericTableProps<T>['propertyMappings']): React.ReactNode {
        const elements: React.ReactNode = converter.map(([, adapter], i) => {
            let currentValue: T[PropertyOfType<T, React.ReactNode>] | React.ReactNode;
            if (typeof adapter === 'function') {
                currentValue = adapter(value);
            } else {
                currentValue = value[adapter];
            }
            // Should only be an object if it's not a string or a number, in which case
            // it is expected that the returned element has the <td> in it.
            return typeof currentValue === 'object' ? (
                (currentValue as React.ReactNode)
            ) : (
                <td key={i}>{currentValue}</td>
            );
        });
        return elements;
    }

    const tableRows: React.ReactNode = props.values.map((value, i) => {
        return <tr key={i}>{valueEntry(value, props.propertyMappings)}</tr>;
    });
    const { propertyMappings: _propertyMappings, values: _values, ...tableProps }: GenericTableProps<T> = props;

    let noData: React.ReactNode = null;
    if (props.values.length === 0) {
        noData = (
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs="4">
                        <h1 className="text-center">No Data</h1>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <>
            <Table {...tableProps}>
                <thead className="thead-dark">
                    <tr>
                        {props.propertyMappings.map((mapping, i) => {
                            return typeof mapping[0] !== 'object' ? (
                                <th className="text-capitalize" key={i}>
                                    {mapping[0]}
                                </th>
                            ) : (
                                mapping[0]
                            );
                        })}
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </Table>
            {noData}
        </>
    );
}
