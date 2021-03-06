import React from 'react';
import { Nav } from 'react-bootstrap';

export enum ActiveTab {
    Licenses,
    Matches,
    None,
}

type Props = {
    goTo: (tab: ActiveTab) => void;
    activeTab: ActiveTab;
};

export default function HuntNav(props: Props): JSX.Element {
    return (
        <Nav variant="pills" className="justify-content-around" activeKey={props.activeTab}>
            <Nav.Link eventKey={ActiveTab.Licenses} onClick={() => props.goTo(ActiveTab.Licenses)}>
                Participants
            </Nav.Link>
            <Nav.Link eventKey={ActiveTab.Matches} onClick={() => props.goTo(ActiveTab.Matches)}>
                Matches
            </Nav.Link>
        </Nav>
    );
}
