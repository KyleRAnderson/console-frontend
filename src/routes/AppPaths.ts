import Roster from '../models/Roster';
import Hunt from '../models/Hunt';

namespace AppPaths {
    export const root: string = '/';
    export const usersRoot: string = '/users';
    export const loginUrl: string = '/login';
    export const registerUrl: string = '/register';
    export const app: string = '/app';

    export const rostersPath: string = app + '/rosters/';
    export const rosterIdParam: string = 'rosterId';
    export function rosterPath(roster: Roster | string = `:${rosterIdParam}`): string {
        const rosterId: string = typeof roster == 'string' ? roster : roster.id;
        return `${rostersPath}${rosterId}/`;
    }

    export const huntIdParam: string = 'huntId';
    const huntsExtension: string = '/hunts/';
    export function huntPath(hunt: Hunt | string = `:${huntIdParam}`): string {
        const huntId: string = typeof hunt == 'string' ? hunt : hunt.id;
        return `${app}${huntsExtension}${huntId}/`;
    }

    export const matchesExtension: string = 'matches/';
    export function matchesPath(hunt?: Hunt | string): string {
        return `${huntPath(hunt)}${matchesExtension}`;
    }
}
export default AppPaths;
