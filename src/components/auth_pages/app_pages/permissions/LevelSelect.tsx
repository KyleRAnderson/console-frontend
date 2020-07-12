import React from 'react';
import { Form } from 'react-bootstrap';
import FormControlElement from '../../../../FormControlElement';
import { Role, ROLES } from '../../../../models/Permission';

export type Props = {
    level: Role;
    onChange: (event: React.ChangeEvent<FormControlElement>) => void;
    disabled?: boolean;
};

export default function LevelSelect(props: Props): JSX.Element {
    const { level, onChange, disabled } = props;
    return (
        <Form.Control as="select" value={level} disabled={disabled === true} onChange={onChange}>
            {ROLES.map((role) => {
                return <option key={role}>{role}</option>;
            })}
        </Form.Control>
    );
}
