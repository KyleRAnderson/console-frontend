import Roster, { RosterBase } from '../models/Roster';
import * as ApiPaths from '../routes/ApiPaths';
import * as ApiRequest from './apiRequests';
import PartialBy from '../util/partialBy';

export type RosterPost = Omit<PartialBy<RosterBase, 'participant_properties'>, 'user_id'>;

export function getRosters() {
    return ApiRequest.getItem<Roster[]>(ApiPaths.ROSTERS_PATH);
}

export function getRoster(rosterId: string) {
    return ApiRequest.getItem<Roster>(ApiPaths.rosterPath(rosterId));
}

export function deleteRoster(rosterId: string) {
    return ApiRequest.deleteItem(ApiPaths.rosterPath(rosterId));
}

export function createRoster(roster: RosterPost) {
    return ApiRequest.postItem<RosterPost, Roster>(ApiPaths.ROSTERS_PATH, roster);
}

export function updateRoster(roster: Roster) {
    const post: RosterPost = { name: roster.name, participant_properties: roster.participant_properties };
    return ApiRequest.patchItem(ApiPaths.rosterPath(roster), post);
}
