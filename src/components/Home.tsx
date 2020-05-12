import React from 'react';
import { Link } from 'react-router-dom';
import AppPaths from '../routes/AppPaths';
import { Button } from 'react-bootstrap';

export default () => (
    <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
            <div className="container secondary-color">
                <h1 className="display-4">Reindeer Hunt Console</h1>
                <p className="lead">For managing the Reindeer Hunt and similar competitions.</p>
                <hr className="my-4 secondary-color" />
                <Button href={AppPaths.registerUrl} size="lg" className="custom-button" type="button">
                    Get Started
                </Button>
                <br />
                <Link to={AppPaths.loginUrl}>or, Login</Link>
            </div>
        </div>
    </div>
);
