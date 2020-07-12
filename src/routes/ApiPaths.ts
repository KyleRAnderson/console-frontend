import Hunt from '../models/Hunt';
import Roster from '../models/Roster';
import License from '../models/License';
import getId from '../util/identifiableHelper';
import Participant from '../models/Participant';
import Permission from '../models/Permission';

export const CABLE_PATH = '/cable';

export const API_ROOT_PATH = '/api/v1/';

export const USERS_LOGIN_PATH: string = API_ROOT_PATH + 'login/';
export const USERS_LOGOUT_PATH: string = API_ROOT_PATH + 'logout/';
export const USERS_REGISTRATIONS_PATH: string = API_ROOT_PATH + 'signup/';
export const USERS_CONFIRMATION_PATH: string = API_ROOT_PATH + 'confirmation/';
export const USERS_PASSWORD_RESET_PATH: string = API_ROOT_PATH + 'password/';

export const ROSTERS_PATH: string = API_ROOT_PATH + 'rosters/';
const PARTICIPANTS_EXTENSION = 'participants/';
const PARTICIPANT_UPLOAD_EXTENSION = 'upload/';
const HUNTS_EXTENSION = 'hunts/';
const ROUNDS_EXTENSION = 'rounds/';
const MATCHES_EXTENSION = 'matches/';
const LICENSES_EXTENSION = 'licenses/';

export function rosterPath(roster: string | Roster): string {
    return `${ROSTERS_PATH}${getId(roster)}/`;
}

export function participantPath(participant: string | Participant): string {
    return `${API_ROOT_PATH}${PARTICIPANTS_EXTENSION}${getId(participant)}/`;
}

export function participantsPath(roster: string | Roster): string {
    return `${rosterPath(roster)}${PARTICIPANTS_EXTENSION}`;
}

export function participantsUploadPath(roster: string | Roster): string {
    return `${participantsPath(roster)}${PARTICIPANT_UPLOAD_EXTENSION}`;
}

export function huntPath(hunt: string | Hunt): string {
    return `${API_ROOT_PATH}${HUNTS_EXTENSION}${getId(hunt)}/`;
}

export function huntsPath(roster: string | Roster): string {
    return `${rosterPath(getId(roster))}${HUNTS_EXTENSION}`;
}

export function roundsPath(hunt: string | Hunt): string {
    return `${huntPath(getId(hunt))}${ROUNDS_EXTENSION}`;
}

export function roundPath(hunt: string | Hunt, roundNumber: number): string {
    return `${roundsPath(getId(hunt))}${roundNumber}/`;
}

export function matchesPath(hunt: string | Hunt): string {
    return `${huntPath(getId(hunt))}${MATCHES_EXTENSION}`;
}

export function matchPath(hunt: string | Hunt, matchNumber: number): string {
    return `${matchesPath(getId(hunt))}${matchNumber}/`;
}
const matchmakeExtension = 'matchmake/';
export function matchmakePath(hunt: string | Hunt): string {
    return `${matchesPath(hunt)}${matchmakeExtension}`;
}

export function licensePath(license: string | License): string {
    return `${API_ROOT_PATH}${LICENSES_EXTENSION}${getId(license)}/`;
}

export function licensesPath(hunt: string | Hunt): string {
    return `${huntPath(hunt)}${LICENSES_EXTENSION}`;
}

export const ELIMINATE_ALL_EXTENSION = 'eliminate_all/';
export function eliminateAllPath(hunt: string | Hunt): string {
    return `${licensesPath(hunt)}${ELIMINATE_ALL_EXTENSION}`;
}

export const ELIMINATE_HALF_EXTENSION = 'eliminate_half/';
export function eliminateHalfPath(hunt: string | Hunt): string {
    return `${licensesPath(hunt)}${ELIMINATE_HALF_EXTENSION}`;
}

export const BULK_LICENSES_EXTENSION = 'bulk/';
export function bulkCreateLicensesPath(hunt: string | Hunt): string {
    return `${licensesPath(hunt)}${BULK_LICENSES_EXTENSION}`;
}

const PERMISSION_EXTENSION = 'permissions/';
export function permissionsPath(roster: string | Roster): string {
    return `${rosterPath(roster)}${PERMISSION_EXTENSION}`;
}

export function permissionPath(permission: string | Permission): string {
    return `${API_ROOT_PATH}${PERMISSION_EXTENSION}${getId(permission)}`;
}
