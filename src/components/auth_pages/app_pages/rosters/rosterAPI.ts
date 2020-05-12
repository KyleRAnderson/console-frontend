import { AxiosResponse, AxiosError } from 'axios';
import Roster from '../../../../models/Roster';
import ApiPaths from '../../../../routes/ApiPaths';
import ApiRequest from '../../../../apiRequests';

namespace RosterAPI {
    export type RosterPost = { name: string; participant_properties: string[] };

    export type RosterErrorResponse = AxiosError<{ roster: string[] }>;

    export function isErrorFormat(error: RosterErrorResponse | any): boolean {
        return (error as RosterErrorResponse).response?.data.roster !== undefined;
    }

    export function asErrorFormat(error: RosterErrorResponse | any): RosterErrorResponse | null {
        return isErrorFormat(error) ? (error as RosterErrorResponse) : null;
    }

    export function getRosters(): Promise<AxiosResponse<Roster[]>> {
        return ApiRequest.getItem<Roster[]>(ApiPaths.rostersPath, undefined, true);
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
