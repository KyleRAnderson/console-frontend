import React from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import Notifications from '../../../../notification';
import RosterAPI from './rosterAPI';
import Roster from '../../../../models/Roster';

interface State {
    name: string;
    participant_properties: string;
}

type Props = {
    onSuccessfulCreate?: (newRoster: Roster) => void;
    onFailureToCreate?: () => void;
};

export default class CreateRoster extends React.Component<Props, State> {
    static defaultState: State = { name: '', participant_properties: '' };

    state: State = { ...CreateRoster.defaultState };

    render() {
        return (
            <Form onSubmit={(event: React.FormEvent<HTMLFormElement>) => this.submitForm(event)}>
                <Row>
                    <Col md="3">
                        <Form.Control
                            required
                            placeholder="Roster Name"
                            onChange={(change) => this.updateRosterName(change.target.value)}
                            value={this.state.name}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            placeholder="Participant Properties (comma-separated)"
                            onChange={(change) => this.updateParticipantProperties(change.target.value)}
                            value={this.state.participant_properties}
                        />
                    </Col>
                    <Col md="3">
                        <Button variant="primary" type="submit">
                            Create Roster{' '}
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
    submitForm(event: React.FormEvent<HTMLFormElement>): void {
        const form = event.currentTarget;
        event.preventDefault();
        if (!form.checkValidity()) {
            event.stopPropagation();
        } else {
            let participant_properties: string[] = this.state.participant_properties
                .split(',')
                .filter((property) => property.length !== 0);
            participant_properties = participant_properties.map((property) => property.trim());
            const name: string = this.state.name.trim();
            this.makeRequest(name, participant_properties);
        }
    }
    updateParticipantProperties(value: string): void {
        this.setState({ ...this.state, participant_properties: value });
    }
    updateRosterName(value: string): void {
        this.setState({ ...this.state, name: value });
    }

    clearForm() {
        this.setState({ ...CreateRoster.defaultState });
    }

    notifySuccess(success: boolean = true) {
        Notifications.createNotification({
            message: success ? 'Roster Created' : 'Error Creating Roster',
            type: success ? 'success' : 'danger',
        });
    }

    makeRequest(rosterName: string, participant_properties: string[]) {
        RosterAPI.createRoster({ name: rosterName, participant_properties: participant_properties })
            .then((response) => {
                this.clearForm();
                this.props.onSuccessfulCreate?.(response.data);
            })
            .catch(() => this.props.onFailureToCreate?.());
    }
}
