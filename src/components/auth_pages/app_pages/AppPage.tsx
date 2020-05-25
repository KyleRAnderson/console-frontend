import React, { useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import RostersView from './rosters/Rosters';
import AppPaths from '../../../routes/AppPaths';
import Auth from '../../../auth';
import Roster from '../../../models/Roster';
import HuntDetails from './hunts/HuntDetails';

function AppPage(props: RouteComponentProps) {
    const [currentRoster, setCurrentRoster] = useState<Roster | undefined>(undefined);

    return (
        <>
            <Navbar className="primary-color" variant="dark">
                <Navbar.Brand href={AppPaths.root}>Hunt Console</Navbar.Brand>
                <Nav className="mr-auto" activeKey={props.location.pathname}>
                    <Nav.Link href={AppPaths.rostersPath}>Rosters</Nav.Link>
                </Nav>
                <Container className="justify-content-end">
                    <Button
                        className="custom-button"
                        size="sm"
                        type="button"
                        href={AppPaths.root}
                        onClick={() => Auth.logout()}
                    >
                        Logout
                    </Button>
                </Container>
            </Navbar>
            <Switch>
                <Route
                    path={AppPaths.rostersPath}
                    render={(props) => {
                        return (
                            <RostersView
                                {...props}
                                rosterToView={currentRoster}
                                onRosterSelect={(roster) => setCurrentRoster(roster)}
                            />
                        );
                    }}
                />
                <Route
                    path={AppPaths.huntPath()}
                    render={(props) => {
                        return (
                            <HuntDetails participant_properties={currentRoster?.participant_properties} {...props} />
                        );
                    }}
                />
            </Switch>
        </>
    );
}
export default AppPage;
