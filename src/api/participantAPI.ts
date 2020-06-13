import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import Participant, { ParticipantBase } from '../models/Participant';
import { AxiosResponse } from 'axios';
import PartialBy from '../util/partialBy';
import { ParticipantPaginatedResponse } from '../components/auth_pages/app_pages/participants/ParticipantsHandler';

export type ParticipantPost = PartialBy<ParticipantBase, 'extras'>;
/**
 * The properties that are orderable on the server end for the participant.
 */
export type ParticipantOrdering = {
    first?: string;
    last?: string;
};

export function getParticipants(
    rosterId: string,
    params: ApiRequest.PaginationParams,
    ordering?: ParticipantOrdering,
): Promise<AxiosResponse<ParticipantPaginatedResponse<Participant>>> {
    return ApiRequest.getItem<ParticipantPaginatedResponse<Participant>>(ApiPaths.participantsPath(rosterId), {
        params: { ...params, ...ordering },
    });
}

export function getParticipant(participantId: string): Promise<AxiosResponse<Participant>> {
    return ApiRequest.getItem<Participant>(ApiPaths.participantPath(participantId));
}

export function createParticipant(rosterId: string, participant: ParticipantPost): Promise<AxiosResponse<Participant>> {
    return ApiRequest.postItem(ApiPaths.participantsPath(rosterId), participant);
}

export function deleteParticipant(participantId: string): Promise<AxiosResponse> {
    return ApiRequest.deleteItem(ApiPaths.participantPath(participantId));
}

export function updateParticipant(
    participantId: string,
    participant: ParticipantPost,
): Promise<AxiosResponse<Participant>> {
    return ApiRequest.updateItem<ParticipantPost, Participant>(ApiPaths.participantPath(participantId), participant);
}
