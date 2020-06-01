import PaginatedResponse from '../models/PaginatedResponse';
import Match, { MatchBase } from '../models/Match';
import ApiRequest from './apiRequests';
import ApiPaths from '../routes/ApiPaths';
import Hunt from '../models/Hunt';
import { AxiosResponse } from 'axios';

namespace MatchAPI {
    type PaginatedMatches = PaginatedResponse & {
        matches: Match[];
    };

    export function getMatches(hunt: Hunt | string, pageParams: ApiRequest.PaginationParams) {
        return ApiRequest.getItem<PaginatedMatches>(ApiPaths.matchesPath(hunt), { params: pageParams });
    }

    export function getMatch(hunt: Hunt | string, matchNumber: number): Promise<AxiosResponse<Match>> {
        return ApiRequest.getItem<Match>(ApiPaths.matchPath(hunt, matchNumber));
    }

    export function deleteMatch(hunt: Hunt | string, matchNumber: number): Promise<AxiosResponse> {
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

    export function matchmake(hunt: Hunt | string, params: MatchmakeParams): Promise<AxiosResponse> {
        return ApiRequest.postItem<RootMatchmakeParams>(ApiPaths.matchmakePath(hunt), {
            matchmake: params,
        });
    }
}

export default MatchAPI;
