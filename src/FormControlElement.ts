import { Form } from 'react-bootstrap';

type WithGeneric = Parameters<NonNullable<React.ComponentProps<typeof Form.Control>['onChange']>>[0];
type ExtractGeneric<Type> = Type extends React.ChangeEvent<infer X> ? X : never;

type FormControlElement = ExtractGeneric<WithGeneric>;

export default FormControlElement;
