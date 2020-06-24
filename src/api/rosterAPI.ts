import { AxiosResponse } from 'axios';
import Roster, { RosterBase } from '../models/Roster';
import * as ApiPaths from '../routes/ApiPaths';
import * as ApiRequest from './apiRequests';
import ServerError, { asServerError } from '../models/ServerError';
import PartialBy from '../util/partialBy';

export type RosterPost = Omit<PartialBy<RosterBase, 'participant_properties'>, 'user_id'>;
export type RosterErrorResponse = ServerError<{ roster: string[] }>;

export function asRosterError(error: RosterErrorResponse | unknown): RosterErrorResponse | undefined {
    return asServerError<{ roster: string[] }>(error, (data) => 'roster' in data);
}

export function getRosters(): Promise<AxiosResponse<Roster[]>> {
    return ApiRequest.getItem<Roster[]>(ApiPaths.ROSTERS_PATH);
}

export function getRoster(rosterId: string): Promise<AxiosResponse<Roster>> {
    return ApiRequest.getItem<Roster>(ApiPaths.rosterPath(rosterId));
}

export function deleteRoster(rosterId: string): Promise<AxiosResponse> {
    return ApiRequest.deleteItem(ApiPaths.rosterPath(rosterId));
}

export function createRoster(roster: RosterPost): Promise<AxiosResponse<Roster>> {
    return ApiRequest.postItem<RosterPost, Roster>(ApiPaths.ROSTERS_PATH, roster);
}

export function updateRoster(roster: Roster): Promise<AxiosResponse<Roster>> {
    const post: RosterPost = { name: roster.name, participant_properties: roster.participant_properties };
    return ApiRequest.updateItem(ApiPaths.rosterPath(roster), post);
}
