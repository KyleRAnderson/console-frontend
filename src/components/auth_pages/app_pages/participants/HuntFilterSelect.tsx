import React from 'react';
import { Form } from 'react-bootstrap';
import FormControlElement from '../../../../FormControlElement';
import Hunt from '../../../../models/Hunt';

export type Props = {
    /** List of hunts to be displaying options for. */
    hunts: Hunt[];
    /** Currently selected hunt. */
    currentSelection: Hunt | undefined;
    /** Function to call when the selection changes. */
    onChoose: (hunt?: Hunt) => void;
};

export default function HuntFilterSelect(props: Props): JSX.Element {
    function handleChange(changeEvent: React.ChangeEvent<FormControlElement>): void {
        const selectedHuntId = changeEvent.target.value;
        const selectedHunt: Hunt | undefined = props.hunts.find((hunt) => hunt.id === selectedHuntId);
        props.onChoose(selectedHunt);
    }

    return (
        <Form.Control as="select" onChange={handleChange} value={props.currentSelection?.id || ''}>
            <option value="">-</option>
            {props.hunts.map((hunt) => {
                return (
                    <option key={hunt.id} value={hunt.id}>
                        {hunt.name}
                    </option>
                );
            })}
        </Form.Control>
    );
}
