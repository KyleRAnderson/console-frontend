import Hunt from '../models/Hunt';
import Roster from '../models/Roster';
import urljoin from 'url-join';

// Root paths (ones that need the leading / for matching)
export const ROOT = '/';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const UPDATE_PASSWORD_PATH = '/password/update';

export const CONFIRMATION_TOKEN_PARAM = 'confirmationToken' as const;
export const CONFIRMATION_BASE_PATH = '/confirmation';
export function confirmationPath(token = `:${CONFIRMATION_TOKEN_PARAM}`): string {
    return urljoin(CONFIRMATION_BASE_PATH, token);
}

export const PASSWORD_RESET_TOKEN_PARAM = 'resetToken' as const;
export const RESET_PASSWORD_BASE_PATH = '/reset_password';
export function resetPasswordPath(resetToken = `:${PASSWORD_RESET_TOKEN_PARAM}`): string {
    return urljoin(RESET_PASSWORD_BASE_PATH, resetToken);
}

export const APP_ROOT = '/app';

export const ROSTERS_PATH: string = urljoin(APP_ROOT, 'rosters');
export const ROSTER_ID_PARAM = 'rosterId' as const;
export function rosterPath(roster: Roster | string = `:${ROSTER_ID_PARAM}`): string {
    const rosterId: string = typeof roster == 'string' ? roster : roster.id;
    return urljoin(ROSTERS_PATH, rosterId);
}

export const PERMISSION_ID_PARAM = 'permissionId' as const;
export const PERMISSIONS_EXTENSION = 'permissions';
/**
 * Gets the app path for the permissions for the given roster.
 * @param roster The roster for which the permissions should be fetched. If not set,
 * then gets the generic AppPath with the param for the roster.
 * @return The string path for the permissions for the given roster.
 */
export function permissionsPath(roster?: string | Roster): string {
    return urljoin(rosterPath(roster), PERMISSIONS_EXTENSION);
}

export const HUNT_ID_PARAM = 'huntId' as const;
const HUNTS_EXTENSION = 'hunts';
export function huntPath(hunt: Hunt | string = `:${HUNT_ID_PARAM}`): string {
    const huntId: string = typeof hunt == 'string' ? hunt : hunt.id;
    return urljoin(APP_ROOT, HUNTS_EXTENSION, huntId);
}

export const MATCHES_EXTENSION = 'matches';
export function matchesPath(hunt?: Hunt | string): string {
    return urljoin(huntPath(hunt), MATCHES_EXTENSION);
}

export const MATCH_NUMBER_PARAM = 'matchNumber' as const;
export function matchPath(hunt: Hunt | string, matchNumber = `:${MATCH_NUMBER_PARAM}`): string {
    return urljoin(matchesPath(hunt), 'show', matchNumber);
}

export const MATCHMAKE_EXTENSION = 'matchmake';
export const NEW_MATCH_EXTENSION = 'new_match';
export const NEXT_ROUND_EXTENSION = 'next_round';
export const INSTANT_PRINT_EXTENSION = 'instant_print';
