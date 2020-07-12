import React, { useState } from 'react';
import { Col, Container, Form } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
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

// This is here for safety later on if it were to change.
const QUERY_SEARCH_KEYS: (keyof ParticipantFilters)[] = ['exclude_hunt_id'];

export default function ParticipantsView(props: Props): JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>();
    const [upToDate, setUpToDate] = useState<boolean>(false);

    const history = useHistory();
    const { search } = useLocation();
    const parsedSearch = new URLSearchParams(search);

    function parseSearchToFilters(): ParticipantFilters {
        const filtersInSearch: ParticipantFilters = {};
        for (const key of QUERY_SEARCH_KEYS) {
            filtersInSearch[key] = parsedSearch.get(key) || undefined;
        }
        return filtersInSearch;
    }

    const filters = parseSearchToFilters();

    function setSearchFromFilters(filters: ParticipantFilters): void {
        for (const key of QUERY_SEARCH_KEYS) {
            const value = filters[key];
            if (value) {
                parsedSearch.set(key, value);
            } else {
                parsedSearch.delete(key);
            }
        }
        history.push({ search: parsedSearch.toString() });
    }

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
                                        onChoose={(hunt) =>
                                            setSearchFromFilters({ ...filters, exclude_hunt_id: hunt?.id })
                                        }
                                        currentSelection={
                                            props.hunts.find((hunt) => hunt.id === filters.exclude_hunt_id) || undefined
                                        }
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
