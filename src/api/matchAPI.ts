import PaginatedResponse from '../models/PaginatedResponse';
import Match, { MatchBase } from '../models/Match';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import Hunt from '../models/Hunt';
type PaginatedMatches = PaginatedResponse & {
    matches: Match[];
};
export type MatchFilters = {
    ongoing?: boolean;
    round?: number | number[];
};

export function getMatches(hunt: Hunt | string, pageParams: ApiRequest.PaginationParams, filters?: MatchFilters) {
    return ApiRequest.getItem<PaginatedMatches>(ApiPaths.matchesPath(hunt), { params: { ...pageParams, ...filters } });
}

export function getMatch(hunt: Hunt | string, matchNumber: number) {
    return ApiRequest.getItem<Match>(ApiPaths.matchPath(hunt, matchNumber));
}

export function deleteMatch(hunt: Hunt | string, matchNumber: number) {
    return ApiRequest.deleteItem(ApiPaths.matchPath(hunt, matchNumber));
}

export function postMatch(hunt: Hunt | string, match: MatchBase) {
    return ApiRequest.postItem<MatchBase, Match>(ApiPaths.matchesPath(hunt), match);
}

export type MatchmakeParams = {
    within?: string[];
    between?: string[];
};

type RootMatchmakeParams = {
    matchmake: MatchmakeParams;
};

export function matchmake(hunt: Hunt | string, params: MatchmakeParams) {
    return ApiRequest.postItem<RootMatchmakeParams>(ApiPaths.matchmakePath(hunt), {
        matchmake: params,
    });
}
