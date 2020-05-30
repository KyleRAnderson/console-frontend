import React from 'react';
import { Table, TableProps } from 'react-bootstrap';

export type PropertyOfType<U, V> = {
    [P in keyof U]: U[P] extends V ? P : never;
}[keyof U];

type AllowedPropertyTypes = string | number | JSX.Element | null;

export type PropertyMapping<T> = [
    string | JSX.Element,
    PropertyOfType<T, AllowedPropertyTypes> | ((value: T) => AllowedPropertyTypes),
];

/* Note that T can still have properties that aren't of type string | JSX.Element, but they won't be known of
which is fine since for non string | JSX.Element properties, we will want a function to get the value out of the model.*/
type Props<T> = TableProps & {
    propertyMappings: PropertyMapping<T>[];
    values: T[];
};

export default function GenericTable<T>(props: Props<T>): JSX.Element {
    function valueEntry(value: T, converter: Props<T>['propertyMappings']): JSX.Element[] {
        let elements: JSX.Element[] = converter.map(([, adapter], i) => {
            let currentValue: T[PropertyOfType<T, AllowedPropertyTypes>] | AllowedPropertyTypes;
            if (typeof adapter === 'function') {
                currentValue = adapter(value);
            } else {
                currentValue = value[adapter];
            }
            return <td key={i}>{currentValue}</td>;
        });
        return elements;
    }

    let tableRows: JSX.Element[] = props.values.map((value, i) => {
        return <tr key={i}>{valueEntry(value, props.propertyMappings)}</tr>;
    });
    let { propertyMappings, values, ...tableProps }: Props<T> = props;

    return (
        <Table {...tableProps}>
            <thead className="thead-dark">
                <tr>
                    {props.propertyMappings.map((mapping, i) => {
                        return <th key={i}>{mapping[0]}</th>;
                    })}
                </tr>
            </thead>
            <tbody>{tableRows}</tbody>
        </Table>
    );
}
