import React from 'react';
import { Role, ROLES } from '../../../../models/Permission';
import { Form } from 'react-bootstrap';

export type Props = {
    level: Role;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
