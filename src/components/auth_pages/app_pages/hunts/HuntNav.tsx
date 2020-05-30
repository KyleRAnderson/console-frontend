import React from 'react';
import { Nav, Container } from 'react-bootstrap';

export enum ActiveTab {
    Licenses,
    Matches,
    None,
}

type Props = {
    goToHunt: () => void;
    goToMatches: () => void;
    activeTab: ActiveTab;
};

export default function HuntNav(props: Props): JSX.Element {
    return (
        <Container fluid className="py-1">
            <Nav variant="pills" className="justify-content-around" activeKey={props.activeTab}>
                <Nav.Link eventKey={ActiveTab.Licenses} onClick={props.goToHunt}>
                    Participants
                </Nav.Link>
                <Nav.Link eventKey={ActiveTab.Matches} onClick={props.goToMatches}>
                    Matches
                </Nav.Link>
            </Nav>
        </Container>
    );
}
