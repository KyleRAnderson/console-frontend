namespace ApiPaths {
    export const apiRootPath: string = '/api/v1/';

    export const usersRootPath: string = apiRootPath + 'users/';
    export const usersLoginPath: string = apiRootPath + 'login/';
    export const usersLogoutPath: string = apiRootPath + 'logout/';
    export const usersRegistrationsPath: string = apiRootPath + 'signup/';
    export const rostersPath: string = apiRootPath + 'rosters/';
    const participantsExtension: string = '/participants/';

    export function rosterPath(rosterId: string): string {
        return `${rostersPath}${rosterId}`;
    }

    export function participantPath(rosterId: string, participantId: string): string {
        return `${rosterPath(rosterId)}${participantsExtension}${participantId}`;
    }

    export function participantsPath(rosterId: string): string {
        return `${rosterPath(rosterId)}${participantsExtension}`;
    }

    export namespace ParticipantParams {
        export const page: string = 'page';
        export const perPage: string = 'per_page';
    }
}

export default ApiPaths;
