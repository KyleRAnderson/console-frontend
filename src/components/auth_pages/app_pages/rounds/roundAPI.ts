import Round, { RoundBase } from '../../../../models/Round';
import ApiRequest from '../../../../apiRequests';
import ApiPaths from '../../../../routes/ApiPaths';
import { AxiosResponse } from 'axios';
import PartialBy from '../../../../util/partialBy';

namespace RoundAPI {
    export type RoundPost = PartialBy<RoundBase, 'number'>;

    export function getRounds(huntId: string): Promise<AxiosResponse<Round[]>> {
        return ApiRequest.getItem<Round[]>(ApiPaths.roundsPath(huntId));
    }

    export function getRound(huntId: string, roundNumber: number): Promise<AxiosResponse<Round>> {
        return ApiRequest.getItem<Round>(ApiPaths.roundPath(huntId, roundNumber));
    }

    export function deleteRound(huntId: string, roundNumber: number): Promise<AxiosResponse> {
        return ApiRequest.deleteItem(ApiPaths.roundPath(huntId, roundNumber));
    }

    export function createRound(huntId: string, round: RoundPost): Promise<AxiosResponse<Round>> {
        return ApiRequest.postItem<RoundPost, Round>(ApiPaths.roundsPath(huntId), round);
    }
}

export default RoundAPI;
