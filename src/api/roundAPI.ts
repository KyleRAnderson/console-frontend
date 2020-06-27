import Round, { RoundBase } from '../models/Round';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import PartialBy from '../util/partialBy';

export type RoundPost = PartialBy<RoundBase, 'number'>;

export function getRounds(huntId: string): Promise<Round[]> {
    return ApiRequest.getItem<Round[]>(ApiPaths.roundsPath(huntId));
}

export function getRound(huntId: string, roundNumber: number): Promise<Round> {
    return ApiRequest.getItem<Round>(ApiPaths.roundPath(huntId, roundNumber));
}

export function deleteRound(huntId: string, roundNumber: number): Promise<void> {
    return ApiRequest.deleteItem(ApiPaths.roundPath(huntId, roundNumber));
}

export function createRound(huntId: string, round: RoundPost): Promise<Round> {
    return ApiRequest.postItem<RoundPost, Round>(ApiPaths.roundsPath(huntId), round);
}
