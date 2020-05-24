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

    export function getParticipants(
        rosterId: string,
        page: number,
        participantsPerPage?: number,
    ): Promise<AxiosResponse<ParticipantPaginatedResponse>> {
        let params: { [key: string]: string } = {};
        params[ApiPaths.ParticipantParams.page] = page.toString();
        if (participantsPerPage) {
            params[ApiPaths.ParticipantParams.perPage] = participantsPerPage.toString();
        }
        return ApiRequest.getItem<ParticipantPaginatedResponse>(ApiPaths.participantsPath(rosterId), {
            params: params,
        });
    }

    export function getParticipant(participantId: string): Promise<AxiosResponse<Participant>> {
        return ApiRequest.getItem<Participant>(ApiPaths.participantPath(participantId));
    }

    export function createParticipant(
        rosterId: string,
        participant: ParticipantPost,
    ): Promise<AxiosResponse<Participant>> {
        return ApiRequest.postItem(ApiPaths.participantsPath(rosterId), participant);
    }

    export function deleteParticipant(participantId: string): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.participantPath(participantId));
    }

    export function updateParticipant(
        participantId: string,
        participant: ParticipantPost,
    ): Promise<AxiosResponse<Participant>> {
        return ApiRequest.updateItem<ParticipantPost, Participant>(
            ApiPaths.participantPath(participantId),
            participant,
        );
    }
}

export default ParticipantAPI;
