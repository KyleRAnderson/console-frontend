namespace AppPaths {
    export const root: string = '/';
    export const usersRoot: string = '/users';
    export const loginUrl: string = '/login';
    export const registerUrl: string = '/register';
    export const app: string = '/app';
    export const rostersPath: string = app + '/rosters';

    export const rosterIdParam: string = 'rosterId';

    export function rosterPath(rosterId: string = `:${rosterIdParam}`): string {
        return `${rostersPath}/${rosterId}`;
    }
}
export default AppPaths;
