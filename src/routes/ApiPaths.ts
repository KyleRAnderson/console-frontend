import Identifiable from '../models/Identifiable';
import Hunt from '../models/Hunt';
import Roster from '../models/Roster';
import License from '../models/License';
import User from '../models/User';

namespace ApiPaths {
    export const apiRootPath: string = '/api/v1/';

    export const usersRootPath: string = apiRootPath + 'users/';
    export const usersLoginPath: string = apiRootPath + 'login/';
    export const usersLogoutPath: string = apiRootPath + 'logout/';
    export const usersRegistrationsPath: string = apiRootPath + 'signup/';
    export const rostersPath: string = apiRootPath + 'rosters/';
    const participantsExtension: string = 'participants/';
    const huntsExtension: string = 'hunts/';
    const roundsExtension: string = 'rounds/';
    const matchesExtension: string = 'matches/';
    const licensesExtension: string = 'licenses/';

    function getId<T extends Identifiable>(model: T | string): string {
        return typeof model === 'string' ? model : model.id;
    }

    export function userPath(user: string | User): string {
        return `${usersRootPath}${getId(user)}`;
    }

    export function rosterPath(rosterId: string): string {
        return `${rostersPath}${rosterId}/`;
    }

    export function participantPath(participantId: string): string {
        return `${apiRootPath}${participantsExtension}${participantId}/`;
    }

    export function participantsPath(rosterId: string): string {
        return `${rosterPath(rosterId)}${participantsExtension}`;
    }

    export function huntPath(hunt: string | Hunt): string {
        return `${apiRootPath}${huntsExtension}${getId(hunt)}/`;
    }

    export function huntsPath(roster: string | Roster): string {
        return `${rosterPath(getId(roster))}${huntsExtension}`;
    }

    export function roundPath(hunt: string | Hunt, roundNumber: number): string {
        return `${roundsPath(getId(hunt))}${roundNumber}/`;
    }

    export function roundsPath(hunt: string | Hunt): string {
        return `${huntPath(getId(hunt))}${roundsExtension}`;
    }

    export function matchPath(hunt: string | Hunt, matchNumber: number): string {
        return `${matchesPath(getId(hunt))}${matchNumber}/`;
    }

    export function matchesPath(hunt: string | Hunt): string {
        return `${huntPath(getId(hunt))}${matchesExtension}`;
    }

    const matchmakeExtension: string = 'matchmake/';
    export function matchmakePath(hunt: string | Hunt): string {
        return `${huntPath(hunt)}${matchmakeExtension}`;
    }

    export function licensePath(license: string | License): string {
        return `${apiRootPath}${licensesExtension}${getId(license)}/`;
    }

    export function licensesPath(hunt: string | Hunt): string {
        return `${huntPath(getId(hunt))}${licensesExtension}`;
    }
}

export default ApiPaths;
