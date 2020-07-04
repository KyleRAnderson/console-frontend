import React from 'react';
import { Row, Button } from 'react-bootstrap';

export type Props = {
    /** Function to be called when one of the buttons is clicked and needs to show its action. */
    onSelection: (path: string) => void;
    buttonMappings: {
        /** The element to be rendered inside of the button for this selection. */
        buttonContent: React.ReactNode;
        /** Path to be rendered when the button is clicked. Set to undefined to render nothing. */
        path?: string;
    }[];
};

export default function SwitchBar(props: Props): JSX.Element {
    return (
        <Row className="py-1 justify-content-around">
            {props.buttonMappings.map(({ path, buttonContent }, i) => {
                return (
                    <Button key={i} variant="outline-dark" onClick={path ? () => props.onSelection(path) : undefined}>
                        {buttonContent}
                    </Button>
                );
            })}
        </Row>
    );
}
