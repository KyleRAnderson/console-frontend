import React, { ReactNode } from 'react';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import { usersLoginPath } from '../routes/ApiPaths';

type State = {
    email: string;
    password: string;
};

class Login extends React.Component<any, State> {
    state: State = {
        email: '',
        password: '',
    };

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {}

    render(): ReactNode {
        return (
            <div className="Login" onSubmit={() => this.handleSubmit()}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            onChange={(e) => this.setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => this.setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }

    setEmail(email: string): void {
        this.setState(Object.assign({}, this.state, { email: email }));
    }

    setPassword(password: string): void {
        this.setState(Object.assign({}, this.state, { password: password }));
    }

    validateForm(): boolean {
        return this.state.email.length > 0 && this.state.password.length > 0; // TODO should have regex validation on email, and query server for min password length
    }

    handleSubmit(): void {
        const token: string | undefined = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        const user = {
            user: {
                email: this.state.email,
                password: this.state.password,
            },
        };
        Axios.post(usersLoginPath, {
            headers: {
                'X-CSRF-Token': token,
                'Content-Type': 'application/json',
            },
            user,
        })
            .then(() => console.log('success'))
            .catch((err) => console.log(err));
    }
}

export default Login;
