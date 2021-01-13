import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Hunt from '../models/Hunt';
import Match, { MatchBase } from '../models/Match';
import PaginatedResponse from '../models/PaginatedResponse';
import * as ApiPaths from '../routes/ApiPaths';
import * as ApiRequest from './apiRequests';
type PaginatedMatches = PaginatedResponse & {
    matches: Match[];
};
export type MatchFilters = {
    ongoing?: boolean;
    round?: number | number[];
};

export function getMatches(
    hunt: Hunt | string,
    pageParams: ApiRequest.PaginationParams,
    filters?: MatchFilters,
): Promise<AxiosResponse<PaginatedMatches>> {
    return ApiRequest.getItem<PaginatedMatches>(ApiPaths.matchesPath(hunt), { params: { ...pageParams, ...filters } });
}

export function getMatch(hunt: Hunt | string, matchNumber: number | string): Promise<AxiosResponse<Match>> {
    return ApiRequest.getItem<Match>(ApiPaths.matchPath(hunt, matchNumber));
}

export function deleteMatch(hunt: Hunt | string, matchNumber: number): Promise<AxiosResponse<void>> {
    return ApiRequest.deleteItem(ApiPaths.matchPath(hunt, matchNumber));
}

export function postMatch(hunt: Hunt | string, match: MatchBase): Promise<AxiosResponse<Match>> {
    return ApiRequest.postItem<MatchBase, Match>(ApiPaths.matchesPath(hunt), match);
}

export type MatchmakeParams = {
    within?: string[];
    between?: string[];
};

type RootMatchmakeParams = {
    matchmake: MatchmakeParams;
};

export function matchmake(hunt: Hunt | string, params: MatchmakeParams): Promise<AxiosResponse<void>> {
    return ApiRequest.postItem<RootMatchmakeParams>(ApiPaths.matchmakePath(hunt), {
        matchmake: params,
    });
}

export type EditMatchParams = {
    /** Pairs of license IDs to make matches with. */
    pairings: [string, string][];
};

export type EditMatchErrorResponse = {
    /** Error messages. */
    messages: string[];
    /** Array of duplicate license IDs that were in the input. */
    duplicates: string[];
};

function isMatchErrorResponse(error: unknown): boolean {
    const tryType = error as EditMatchErrorResponse;
    return 'messages' in tryType && 'duplicates' in tryType;
}

export function asMatchErrorResponse(error: unknown): EditMatchErrorResponse | undefined {
    const casted = error as AxiosError<EditMatchErrorResponse>;
    return isMatchErrorResponse(casted.response?.data) ? (casted.response?.data as EditMatchErrorResponse) : undefined;
}

export function editMatches(
    hunt: Hunt | string,
    params: EditMatchParams,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> {
    return ApiRequest.postItem<EditMatchParams>(ApiPaths.matchEditPath(hunt), params, config);
}
