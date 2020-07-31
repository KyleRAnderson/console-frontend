import urljoin from 'url-join';
import Hunt from '../models/Hunt';
import License from '../models/License';
import Participant from '../models/Participant';
import Permission from '../models/Permission';
import Roster from '../models/Roster';
import getId from '../util/identifiableHelper';

export const CABLE_PATH = '/cable';

export const API_ROOT_PATH = '/api/v1';

export const USERS_LOGIN_PATH: string = urljoin(API_ROOT_PATH, 'login');
export const USERS_LOGOUT_PATH: string = urljoin(API_ROOT_PATH, 'logout');
export const USERS_REGISTRATIONS_PATH: string = urljoin(API_ROOT_PATH, 'signup');
export const USERS_CONFIRMATION_PATH: string = urljoin(API_ROOT_PATH, 'confirmation');
export const USERS_PASSWORD_RESET_PATH: string = urljoin(API_ROOT_PATH, 'password');

export const ROSTERS_PATH: string = urljoin(API_ROOT_PATH, 'rosters');
const PARTICIPANTS_EXTENSION = 'participants';
const PARTICIPANT_UPLOAD_EXTENSION = 'upload';
const HUNTS_EXTENSION = 'hunts';
const ROUNDS_EXTENSION = 'rounds';
const MATCHES_EXTENSION = 'matches';
const LICENSES_EXTENSION = 'licenses';

export function rosterPath(roster: string | Roster): string {
    return urljoin(ROSTERS_PATH, getId(roster));
}

export function participantPath(participant: string | Participant): string {
    return urljoin(API_ROOT_PATH, PARTICIPANTS_EXTENSION, getId(participant));
}

export function participantsPath(roster: string | Roster): string {
    return urljoin(rosterPath(roster), PARTICIPANTS_EXTENSION);
}

export function participantsUploadPath(roster: string | Roster): string {
    return urljoin(participantsPath(roster), PARTICIPANT_UPLOAD_EXTENSION);
}

export function huntPath(hunt: string | Hunt): string {
    return urljoin(API_ROOT_PATH, HUNTS_EXTENSION, getId(hunt));
}

export function huntsPath(roster: string | Roster): string {
    return urljoin(rosterPath(getId(roster)), HUNTS_EXTENSION);
}

export const TEMPLATE_PDF_FORM_KEY = 'template_pdf' as const;
const TEMPLATE_PDF_EXTENSION = 'template_pdf';
export function templatePdfPath(hunt: Hunt | string): string {
    return urljoin(huntPath(hunt), TEMPLATE_PDF_EXTENSION);
}

export function roundsPath(hunt: string | Hunt): string {
    return urljoin(huntPath(getId(hunt)), ROUNDS_EXTENSION);
}

export function roundPath(hunt: string | Hunt, roundNumber: number): string {
    return urljoin(roundsPath(getId(hunt)), roundNumber.toString());
}

export function matchesPath(hunt: string | Hunt): string {
    return urljoin(huntPath(getId(hunt)), MATCHES_EXTENSION);
}

export function matchPath(hunt: string | Hunt, matchNumber: number | string): string {
    return urljoin(matchesPath(getId(hunt)), matchNumber.toString());
}
const MATCHMAKE_EXTENSION = 'matchmake';
export function matchmakePath(hunt: string | Hunt): string {
    return urljoin(matchesPath(hunt), MATCHMAKE_EXTENSION);
}

const EDIT_MATCHES_EXTENSION = 'edit';
export function matchEditPath(hunt: string | Hunt): string {
    return urljoin(matchesPath(hunt), EDIT_MATCHES_EXTENSION);
}

export function licensePath(license: string | Pick<License, 'id'>): string {
    return urljoin(API_ROOT_PATH, LICENSES_EXTENSION, getId(license));
}

export function licensesPath(hunt: string | Hunt): string {
    return urljoin(huntPath(hunt), LICENSES_EXTENSION);
}

const INSTANT_PRINT_EXTENSION = 'print';
export function instantPrintPath(hunt: string | Hunt): string {
    return urljoin(licensesPath(hunt), INSTANT_PRINT_EXTENSION);
}

export const ELIMINATE_ALL_EXTENSION = 'eliminate_all' as const;
export function eliminateAllPath(hunt: string | Hunt): string {
    return urljoin(licensesPath(hunt), ELIMINATE_ALL_EXTENSION);
}

export const ELIMINATE_HALF_EXTENSION = 'eliminate_half' as const;
export function eliminateHalfPath(hunt: string | Hunt): string {
    return urljoin(licensesPath(hunt), ELIMINATE_HALF_EXTENSION);
}

export const BULK_LICENSES_EXTENSION = 'bulk' as const;
export function bulkCreateLicensesPath(hunt: string | Hunt): string {
    return urljoin(licensesPath(hunt), BULK_LICENSES_EXTENSION);
}

const PERMISSION_EXTENSION = 'permissions' as const;
export function permissionsPath(roster: string | Roster): string {
    return urljoin(rosterPath(roster), PERMISSION_EXTENSION);
}

export function permissionPath(permission: string | Permission): string {
    return urljoin(API_ROOT_PATH, PERMISSION_EXTENSION, getId(permission));
}
