import Permission, { PermissionBase } from '../models/Permission';
import Roster from '../models/Roster';
import * as ApiRequest from './apiRequests';
import * as ApiPaths from '../routes/ApiPaths';
import { UserBase } from '../models/User';
import PaginatedResponse from '../models/PaginatedResponse';

export type PermissionPost = PermissionBase & Pick<UserBase, 'email'>;
export type PermissionPatch = PermissionBase;
export type PermissionPaginatedResponse = PaginatedResponse & {
    permissions: Permission[];
};

export function getPermissions(roster: string | Roster, params: ApiRequest.PaginationParams) {
    return ApiRequest.getItem<PermissionPaginatedResponse>(ApiPaths.permissionsPath(roster), { params: params });
}

export function getPermission(permissionId: string) {
    return ApiRequest.getItem<Permission>(ApiPaths.permissionPath(permissionId));
}

export function deletePermission(permission: string | Permission) {
    return ApiRequest.deleteItem(ApiPaths.permissionPath(permission));
}

export function createPermission(roster: string | Roster, permission: PermissionPost) {
    return ApiRequest.postItem<PermissionPost, Permission>(ApiPaths.permissionsPath(roster), permission);
}

export function updatePermission(permission: Permission) {
    const post: PermissionPatch = { level: permission.level };
    return ApiRequest.patchItem<PermissionPatch, Permission>(ApiPaths.permissionPath(permission), post);
}
