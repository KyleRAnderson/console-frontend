import { AxiosResponse } from 'axios';
import Roster from '../../../../models/Roster';
import ApiPaths from '../../../../routes/ApiPaths';
import ApiRequest from '../../../../apiRequests';

namespace RosterAPI {
    export type RosterPost = { name: string; participant_properties: string[] };

    export function getRosters(): Promise<AxiosResponse<Roster[]>> {
        return ApiRequest.getItem<Roster[]>(ApiPaths.rostersPath, true);
    }

    export function getRoster(rosterId: string): Promise<AxiosResponse<Roster>> {
        return ApiRequest.getItem<Roster>(ApiPaths.rosterPath(rosterId));
    }

    export function deleteRoster(rosterId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.rosterPath(rosterId));
    }

    export function createRoster(roster: RosterPost): Promise<AxiosResponse<Roster>> {
        return ApiRequest.postItem(ApiPaths.rostersPath, roster);
    }
}

export default RosterAPI;
