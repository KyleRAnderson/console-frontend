import React from 'react';
import { Row } from 'react-bootstrap';

export type Props = {
    buttons: React.ReactNode[];
};

export default function ButtonBar({ buttons }: Props): JSX.Element {
    return (
        <Row className="py-1 justify-content-around">
            {buttons.map((button, i) => {
                return <React.Fragment key={i}>{button}</React.Fragment>;
            })}
        </Row>
    );
}
