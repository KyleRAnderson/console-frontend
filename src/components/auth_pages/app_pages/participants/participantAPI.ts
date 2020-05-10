import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';
import Participant from '../../../../models/Participant';
import { AxiosResponse } from 'axios';

namespace ParticipantAPI {
    export type ParticipantPost = { first: string; last: string; extras: { [property: string]: string } };

    export type ParticipantPaginatedResponse = {
        participants: Participant[];
        num_pages: number;
    };

    export function getParticipants(rosterId: string): Promise<AxiosResponse<ParticipantPaginatedResponse[]>> {
        return ApiRequest.getItem(ApiPaths.participantsPath(rosterId));
    }

    export function getParticipant(rosterId: string, participantId: string): Promise<AxiosResponse<Participant>> {
        return ApiRequest.getItem<Participant>(ApiPaths.participantPath(rosterId, participantId));
    }

    export function createParticipant(
        rosterId: string,
        participant: ParticipantPost,
    ): Promise<AxiosResponse<Participant>> {
        return ApiRequest.postItem(ApiPaths.participantsPath(rosterId), participant);
    }

    export function deleteParticipant(rosterId: string, participantId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.participantPath(rosterId, participantId));
    }

    export function editParticipant(rosterId: string, participant: Participant): Promise<AxiosResponse<Participant>> {
        throw 'Edit participant not implemented.';
    }
}

export default ParticipantAPI;
