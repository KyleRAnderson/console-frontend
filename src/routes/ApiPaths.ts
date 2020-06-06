import Identifiable from '../models/Identifiable';
import Hunt from '../models/Hunt';
import Roster from '../models/Roster';
import License from '../models/License';
import User from '../models/User';

namespace ApiPaths {
    export const CABLE_PATH: string = '/cable';

    export const API_ROOT_PATH: string = '/api/v1/';

    export const USERS_ROOT_PATH: string = API_ROOT_PATH + 'users/';
    export const USERS_LOGIN_PATH: string = API_ROOT_PATH + 'login/';
    export const USERS_LOGOUT_PATH: string = API_ROOT_PATH + 'logout/';
    export const USERS_REGISTRATIONS_PATH: string = API_ROOT_PATH + 'signup/';
    export const ROSTERS_PATH: string = API_ROOT_PATH + 'rosters/';
    const PARTICIPANTS_EXTENSION: string = 'participants/';
    const HUNTS_EXTENSION: string = 'hunts/';
    const ROUNDS_EXTENSION: string = 'rounds/';
    const MATCHES_EXTENSION: string = 'matches/';
    const LICENSES_EXTENSION: string = 'licenses/';

    function getId<T extends Identifiable>(model: T | string): string {
        return typeof model === 'string' ? model : model.id;
    }

    export function userPath(user: string | User): string {
        return `${USERS_ROOT_PATH}${getId(user)}`;
    }

    export function rosterPath(rosterId: string): string {
        return `${ROSTERS_PATH}${rosterId}/`;
    }

    export function participantPath(participantId: string): string {
        return `${API_ROOT_PATH}${PARTICIPANTS_EXTENSION}${participantId}/`;
    }

    export function participantsPath(rosterId: string): string {
        return `${rosterPath(rosterId)}${PARTICIPANTS_EXTENSION}`;
    }

    export function huntPath(hunt: string | Hunt): string {
        return `${API_ROOT_PATH}${HUNTS_EXTENSION}${getId(hunt)}/`;
    }

    export function huntsPath(roster: string | Roster): string {
        return `${rosterPath(getId(roster))}${HUNTS_EXTENSION}`;
    }

    export function roundPath(hunt: string | Hunt, roundNumber: number): string {
        return `${roundsPath(getId(hunt))}${roundNumber}/`;
    }

    export function roundsPath(hunt: string | Hunt): string {
        return `${huntPath(getId(hunt))}${ROUNDS_EXTENSION}`;
    }

    export function matchPath(hunt: string | Hunt, matchNumber: number): string {
        return `${matchesPath(getId(hunt))}${matchNumber}/`;
    }

    export function matchesPath(hunt: string | Hunt): string {
        return `${huntPath(getId(hunt))}${MATCHES_EXTENSION}`;
    }

    const matchmakeExtension: string = 'matchmake/';
    export function matchmakePath(hunt: string | Hunt): string {
        return `${huntPath(hunt)}${matchmakeExtension}`;
    }

    export function licensePath(license: string | License): string {
        return `${API_ROOT_PATH}${LICENSES_EXTENSION}${getId(license)}/`;
    }

    export function licensesPath(hunt: string | Hunt): string {
        return `${huntPath(getId(hunt))}${LICENSES_EXTENSION}`;
    }
}

export default ApiPaths;
