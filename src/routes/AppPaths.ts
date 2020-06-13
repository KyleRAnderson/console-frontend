import Roster from '../models/Roster';
import Hunt from '../models/Hunt';

export const ROOT = '/';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';

export const APP_ROOT = '/app';

export const ROSTERS_PATH: string = APP_ROOT + '/rosters/';
export const ROSTER_ID_PARAM = 'rosterId';
export function rosterPath(roster: Roster | string = `:${ROSTER_ID_PARAM}`): string {
    const rosterId: string = typeof roster == 'string' ? roster : roster.id;
    return `${ROSTERS_PATH}${rosterId}/`;
}

export const HUNT_ID_PARAM = 'huntId';
const HUNTS_EXTENSION = '/hunts/';
export function huntPath(hunt: Hunt | string = `:${HUNT_ID_PARAM}`): string {
    const huntId: string = typeof hunt == 'string' ? hunt : hunt.id;
    return `${APP_ROOT}${HUNTS_EXTENSION}${huntId}/`;
}

export const MATCHES_EXTENSION = 'matches/';
export function matchesPath(hunt?: Hunt | string): string {
    return `${huntPath(hunt)}${MATCHES_EXTENSION}`;
}

export const MATCHMAKE_EXTENSION = 'matchmake/';
export function matchmakePath(hunt: Hunt | string): string {
    return `${huntPath(hunt)}${MATCHMAKE_EXTENSION}`;
}

export const CONFIRMATION_TOKEN_PARAM = 'confirmationToken';
export const CONFIRMATION_BASE_PATH = '/confirmation/';
export function confirmationPath(token = `:${CONFIRMATION_TOKEN_PARAM}`): string {
    return `${CONFIRMATION_BASE_PATH}${token}`;
}

export const PASSWORD_RESET_TOKEN_PARAM = 'resetToken';
export const RESET_PASSWORD_BASE_PATH = '/reset_password/';
export function resetPasswordPath(resetToken = `:${PASSWORD_RESET_TOKEN_PARAM}`): string {
    return `${RESET_PASSWORD_BASE_PATH}${resetToken}`;
}
