import React from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import Axios from 'axios';
import { usersLoginPath } from '../routes/ApiPaths';
import { store } from 'react-notifications-component';

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

    render(): React.ReactElement {
        return (
            <div className="vw-100 vh-100 primary-color d-flex">
                <Container className="Login justify-content-center primary-color col-md-5">
                    <Form onSubmit={(event: React.FormEvent<HTMLElement>) => this.handleSubmit(event)}>
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

                        <Button variant="primary" type="submit" className="custom-button">
                            Login
                        </Button>
                    </Form>
                </Container>
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

    handleSubmit(event: React.FormEvent<HTMLElement>): void {
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
            .then(() => {
                this.setState(Object.assign({}, this.state, { success: true, submitted: true }));
                this.sentNotification(true);
            })
            .catch(() => {
                this.setState(Object.assign({}, this.state, { success: false, submitted: true }));
                this.sentNotification(false);
            });
        event.preventDefault();
    }
    sentNotification(succeeded: boolean) {
        store.addNotification({
            message: `Login ${succeeded ? 'Succeessful' : 'Unsuccessful'}`,
            type: `${succeeded ? 'success' : 'danger'}`,
            insert: 'top',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
                duration: 5000,
                onScreen: true,
            },
        });
    }
}

export default Login;
