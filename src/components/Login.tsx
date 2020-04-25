import React, { ReactNode } from 'react';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import { usersLoginPath } from '../routes/ApiPaths';

type State = {
    email: string;
    password: string;
    success: boolean;
    submitted: boolean;
};

type LoginProps = {
    onTokenReceived: (token: string) => void;
};

interface ServerResponse {
    headers: ServerResponseHeader;
}

interface ServerResponseHeader {
    authorization: string;
}

class Login extends React.Component<LoginProps, State> {
    state: State = {
        email: '',
        password: '',
        success: false,
        submitted: false,
    };

    constructor(props: LoginProps) {
        super(props);
    }

    componentDidMount() {}

    render(): ReactNode {
        const message: string = this.state.success ? 'Successful!' : 'Failed';
        const alertClass: string = this.state.success ? 'alert-success' : 'alert-danger';
        const popupMessage: ReactNode = (
            <div className={`alert ${alertClass}`} role="alert">
                Authentication {message}
            </div>
        );

        return (
            <div className="Login col-md-5">
                {this.state.submitted && popupMessage}
                <Form onSubmit={() => this.handleSubmit()}>
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
        Axios.post<ServerResponseHeader>(usersLoginPath, {
            headers: {
                'X-CSRF-Token': token,
                'Content-Type': 'application/json',
            },
            user: {
                email: this.state.email,
                password: this.state.password,
            },
            transformResponse: (r: ServerResponse) => r.headers,
        })
            .then((response: ServerResponse) => {
                this.setState(Object.assign({}, this.state, { success: true, submitted: true }));
                // this.props.onTokenReceived(response.headers.authorization);
            })
            .catch(() => {
                this.setState(Object.assign({}, this.state, { success: false, submitted: true }));
            });
    }
}

export default Login;
