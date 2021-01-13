import { AxiosResponse } from 'axios';
import PaginatedResponse from '../models/PaginatedResponse';
import Participant, { ParticipantBase } from '../models/Participant';
import Roster from '../models/Roster';
import * as ApiPaths from '../routes/ApiPaths';
import PartialBy from '../util/partialBy';
import * as ApiRequest from './apiRequests';

export type ParticipantPost = PartialBy<ParticipantBase, 'extras'>;
export type ParticipantPaginatedResponse<U extends ParticipantBase> = PaginatedResponse & {
    participants: U[];
};
export type ParticipantFilters = {
    /** ID of the hunt of which to show affiliated participants. */
    exclude_hunt_id?: string;
};

/**
 * The properties that are orderable on the server end for the participant.
 */
export type ParticipantOrdering = {
    first?: string;
    last?: string;
};

export function getParticipants(
    roster: Roster | string,
    params: ApiRequest.SearchPaginationParams & Partial<ParticipantFilters>,
    ordering?: ParticipantOrdering,
): Promise<AxiosResponse<ParticipantPaginatedResponse<Participant>>> {
    return ApiRequest.getItem<ParticipantPaginatedResponse<Participant>>(ApiPaths.participantsPath(roster), {
        params: { ...params, ...ordering },
    });
}

export function getParticipant(participantId: string): Promise<AxiosResponse<Participant>> {
    return ApiRequest.getItem<Participant>(ApiPaths.participantPath(participantId));
}

export function createParticipant(
    roster: Roster | string,
    participant: ParticipantPost,
): Promise<AxiosResponse<Participant>> {
    return ApiRequest.postItem<ParticipantPost, Participant>(ApiPaths.participantsPath(roster), participant);
}

export function deleteParticipant(participantId: string): Promise<AxiosResponse<void>> {
    return ApiRequest.deleteItem(ApiPaths.participantPath(participantId));
}

export function updateParticipant(
    participantId: string,
    participant: ParticipantPost,
): Promise<AxiosResponse<Participant>> {
    return ApiRequest.patchItem<ParticipantPost, Participant>(ApiPaths.participantPath(participantId), participant);
}

export function uploadParticipants(roster: Roster | string, formData: FormData): Promise<AxiosResponse<void>> {
    return ApiRequest.postItem<FormData>(ApiPaths.participantsUploadPath(roster), formData);
}
