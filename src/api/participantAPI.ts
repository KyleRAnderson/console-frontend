import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import Participant, { ParticipantBase } from '../models/Participant';
import PartialBy from '../util/partialBy';
import PaginatedResponse from '../models/PaginatedResponse';
import Roster from '../models/Roster';

export type ParticipantPost = PartialBy<ParticipantBase, 'extras'>;
export type ParticipantPaginatedResponse<U extends ParticipantBase> = PaginatedResponse & {
    participants: U[];
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
    params: ApiRequest.PaginationParams,
    ordering?: ParticipantOrdering,
): Promise<ParticipantPaginatedResponse<Participant>> {
    return ApiRequest.getItem<ParticipantPaginatedResponse<Participant>>(ApiPaths.participantsPath(roster), {
        params: { ...params, ...ordering },
    });
}

export function getParticipant(participantId: string): Promise<Participant> {
    return ApiRequest.getItem<Participant>(ApiPaths.participantPath(participantId));
}

export function createParticipant(roster: Roster | string, participant: ParticipantPost): Promise<Participant> {
    return ApiRequest.postItem(ApiPaths.participantsPath(roster), participant);
}

export function deleteParticipant(participantId: string): Promise<void> {
    return ApiRequest.deleteItem(ApiPaths.participantPath(participantId));
}

export function updateParticipant(participantId: string, participant: ParticipantPost): Promise<Participant> {
    return ApiRequest.updateItem<ParticipantPost, Participant>(ApiPaths.participantPath(participantId), participant);
}

export function uploadParticipants(roster: Roster | string, formData: FormData): Promise<void> {
    return ApiRequest.postItem<FormData>(ApiPaths.participantsUploadPath(roster), formData);
}
