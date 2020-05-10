import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Auth from '../auth';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import AppPaths from '../routes/AppLocations';

type State = {
    email: string;
    password: string;
    success: boolean;
    submitted: boolean;
};

class Login extends React.Component<RouteComponentProps<{}, any, { from: string }>, State> {
    state: State = {
        email: '',
        password: '',
        success: false,
        submitted: false,
    };

    render() {
        if ((this.state.submitted && this.state.success) || Auth.isLoggedIn()) {
            return <Redirect to={this.props.location.state?.from || AppPaths.app} />;
        }

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

    setEmail(email: string) {
        this.setState(Object.assign({}, this.state, { email: email }));
    }

    setPassword(password: string) {
        this.setState(Object.assign({}, this.state, { password: password }));
    }

    validateForm(): boolean {
        return this.state.email.length > 0 && this.state.password.length > 0; // TODO should have regex validation on email, and query server for min password length
    }

    handleSubmit(event: React.FormEvent<HTMLElement>) {
        let stateCopy: State = { ...this.state, submitted: true };
        Auth.login(this.state.email, this.state.password, (success) => {
            stateCopy.success = success;
            this.setState(stateCopy);
            this.sendNotification(success);
        });
        event.preventDefault();
    }

    sendNotification(succeeded: boolean) {
        store.addNotification({
            message: `Login ${succeeded ? 'Successful' : 'Unsuccessful'}`,
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
