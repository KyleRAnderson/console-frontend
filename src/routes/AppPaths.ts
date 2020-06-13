import Roster from '../models/Roster';
import Hunt from '../models/Hunt';

export const root = '/';
export const loginUrl = '/login';
export const registerUrl = '/register';
export const app = '/app';

export const rostersPath: string = app + '/rosters/';
export const rosterIdParam = 'rosterId';
export function rosterPath(roster: Roster | string = `:${rosterIdParam}`): string {
    const rosterId: string = typeof roster == 'string' ? roster : roster.id;
    return `${rostersPath}${rosterId}/`;
}

export const huntIdParam = 'huntId';
const huntsExtension = '/hunts/';
export function huntPath(hunt: Hunt | string = `:${huntIdParam}`): string {
    const huntId: string = typeof hunt == 'string' ? hunt : hunt.id;
    return `${app}${huntsExtension}${huntId}/`;
}

export const matchesExtension = 'matches/';
export function matchesPath(hunt?: Hunt | string): string {
    return `${huntPath(hunt)}${matchesExtension}`;
}

export const matchmakeExtension = 'matchmake/';
export function matchmakePath(hunt: Hunt | string): string {
    return `${huntPath(hunt)}${matchmakeExtension}`;
}

export const confirmationTokenParam = 'confirmationToken';
export const confirmationBasePath = '/confirmation/';
export function confirmationPath(token = `:${confirmationTokenParam}`): string {
    return `${confirmationBasePath}${token}`;
}

export const passwordResetTokenParam = 'resetToken';
export const resetPasswordBasePath = '/reset_password/';
export function resetPasswordPath(resetToken = `:${passwordResetTokenParam}`): string {
    return `${resetPasswordBasePath}${resetToken}`;
}
