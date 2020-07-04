import React, { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';

export enum CloseMethod {
    EliminateAll,
    CoinToss,
    EliminateNone,
}

export type Props = {
    onSubmit: (closeMethod: CloseMethod) => void;
};

export default function NextRoundForm(props: Props): JSX.Element {
    const [closeMethod, setCloseMethod] = useState<CloseMethod>();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        closeMethod !== undefined && props.onSubmit(closeMethod);
        event.preventDefault();
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="justify-content-around">
                <Button type="submit" onClick={() => setCloseMethod(CloseMethod.EliminateAll)}>
                    Eliminate All
                </Button>
                <Button type="submit" onClick={() => setCloseMethod(CloseMethod.CoinToss)}>
                    Coin Toss
                </Button>
                <Button type="submit" onClick={() => setCloseMethod(CloseMethod.EliminateNone)}>
                    Eliminate None
                </Button>
            </Row>
        </Form>
    );
}
