namespace ApiPaths {
    export const apiRootPath: string = '/api/v1/';

    export const usersRootPath: string = apiRootPath + 'users/';
    export const usersLoginPath: string = apiRootPath + 'login/';
    export const usersLogoutPath: string = apiRootPath + 'logout/';
    export const usersRegistrationsPath: string = apiRootPath + 'signup/';
    export const rostersPath: string = apiRootPath + 'rosters/';
    const participantsExtension: string = '/participants/';
    export const huntsPath: string = apiRootPath + 'hunts/';
    const roundsExtension: string = '/rounds/';
    const matchesExtension: string = '/matches/';
    const licensesExtension: string = '/licenses/';

    export function rosterPath(rosterId: string): string {
        return `${rostersPath}${rosterId}`;
    }

    export function participantPath(rosterId: string, participantId: string): string {
        return `${participantsPath(rosterId)}${participantId}`;
    }

    export function participantsPath(rosterId: string): string {
        return `${rosterPath(rosterId)}${participantsExtension}`;
    }

    export namespace ParticipantParams {
        export const page: string = 'page';
        export const perPage: string = 'per_page';
    }

    export function huntPath(huntId: string): string {
        return `${huntsPath}${huntId}`;
    }

    export function roundPath(huntId: string, roundNumber: number): string {
        return `${roundsPath(huntId)}${roundNumber}`;
    }

    export function roundsPath(huntId: string): string {
        return `${huntPath(huntId)}${roundsExtension}`;
    }

    export function matchPath(huntId: string, matchNumber: number): string {
        return `${matchesPath(huntId)}${matchNumber}`;
    }

    export function matchesPath(huntId: string): string {
        return `${huntPath(huntId)}${matchesExtension}`;
    }

    export function licensePath(huntId: string, licenseId: string): string {
        return `${licensesPath(huntId)}${licenseId}`;
    }

    export function licensesPath(huntId: string): string {
        return `${huntPath(huntId)}${licensesExtension}`;
    }
}

export default ApiPaths;
