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

export function getPermissions(
    roster: string | Roster,
    params: ApiRequest.PaginationParams,
): Promise<PermissionPaginatedResponse> {
    return ApiRequest.getItem<PermissionPaginatedResponse>(ApiPaths.permissionsPath(roster), { params: params });
}

export function getPermission(permissionId: string): Promise<Permission> {
    return ApiRequest.getItem<Permission>(ApiPaths.permissionPath(permissionId));
}

export function deletePermission(permissionId: string): Promise<void> {
    return ApiRequest.deleteItem(ApiPaths.permissionPath(permissionId));
}

export function createPermission(roster: string | Roster, permission: PermissionPost): Promise<Permission> {
    return ApiRequest.postItem<PermissionPost, Permission>(ApiPaths.permissionsPath(roster), permission);
}

export function updatePermission(permission: Permission): Promise<Permission> {
    const post: PermissionPatch = { level: permission.level };
    return ApiRequest.updateItem(ApiPaths.permissionPath(permission), post);
}
