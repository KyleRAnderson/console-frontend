import React, { useState } from 'react';
import { Col, Container, Form } from 'react-bootstrap';
import { ParticipantFilters } from '../../../../api/participantAPI';
import Hunt from '../../../../models/Hunt';
import Participant from '../../../../models/Participant';
import Roster from '../../../../models/Roster';
import SearchBar from '../../../generics/SearchBar';
import LicenseBulkCreator from '../licenses/LicenseBulkCreator';
import HuntFilterSelect from './HuntFilterSelect';
import ParticipantAdapter from './ParticipantAdapter';
import ParticipantAdder from './ParticipantAdder';
import ParticipantsUploader from './ParticipantsUploader';

type Props = {
    roster: Roster;
    /** Hunts for which participants may be filtered. */
    hunts?: Hunt[];
};

export default function ParticipantsView(props: Props): JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>();
    const [filters, setFilters] = useState<ParticipantFilters>({});
    const [upToDate, setUpToDate] = useState<boolean>(false);

    function reloadParticipants(): void {
        setUpToDate(false);
    }

    return (
        <>
            <Container className="py-1">
                <Form>
                    <Form.Row className="justify-content-center">
                        <Col lg="4" md="6">
                            <ParticipantsUploader onSuccess={reloadParticipants} roster={props.roster} />
                        </Col>
                        <Col lg="4" md="6">
                            <SearchBar onSearch={setSearchQuery} />
                        </Col>
                        {props.hunts && (
                            <>
                                <Col lg="4" md="6">
                                    <HuntFilterSelect
                                        hunts={props.hunts}
                                        onChoose={(hunt) => setFilters({ ...filters, exclude_hunt_id: hunt?.id })}
                                    />
                                </Col>
                                <Col lg="4" md="6">
                                    <LicenseBulkCreator hunt={filters.exclude_hunt_id} onCreate={reloadParticipants} />
                                </Col>
                            </>
                        )}
                    </Form.Row>
                </Form>
            </Container>
            <ParticipantAdder<Participant> hunt={filters.exclude_hunt_id} onAdded={reloadParticipants}>
                {(extraColumn) => {
                    return (
                        <ParticipantAdapter
                            filters={filters}
                            roster={props.roster}
                            loaded={upToDate}
                            setLoaded={setUpToDate}
                            searchQuery={searchQuery}
                            extraColumns={extraColumn && [extraColumn]}
                        />
                    );
                }}
            </ParticipantAdder>
        </>
    );
}
