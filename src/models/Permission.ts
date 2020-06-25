import Identifiable from './Identifiable';
import Timestamps from './Timestamps';
import { UserBase } from './User';

const ROLES = ['owner', 'administrator', 'operator', 'viewer'] as const;
type Role = typeof ROLES[number];

type PermissionBase = {
    level: Role;
};

type Permission = Identifiable & Timestamps & PermissionBase & { email: Pick<UserBase, 'email'> };

export default Permission;
export { ROLES, Role, PermissionBase };
