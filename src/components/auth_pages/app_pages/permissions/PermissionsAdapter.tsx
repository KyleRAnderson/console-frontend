import React, { useState } from 'react';
import PaginatedLoader from '../../../generics/PaginatedLoader';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import Permission, { ROLES, Role } from '../../../../models/Permission';
import {
    PermissionPaginatedResponse,
    getPermissions,
    updatePermission as patchPermission,
} from '../../../../api/permissionAPI';
import { Form } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';

type Props = RouteComponentProps<{ [ROSTER_ID_PARAM]: string }>;

export default function PermissionsAdapter(props: Props): JSX.Element {
    const [changingPermissions, setChangingPermissions] = useState<{ [permissionId: string]: boolean }>({});
    const [permissions, setPermissions] = useState<Permission[]>([]);

    async function getValues(currentPage: number, recordsPerPage?: number): Promise<[Permission[], number]> {
        const response: PermissionPaginatedResponse = await getPermissions(props.match.params[ROSTER_ID_PARAM], {
            page: currentPage,
            per_page: recordsPerPage,
        });
        return [response.permissions, response.num_pages];
    }

    // Known issue: This will not update the current owner if they promote someone else.
    function updatePermission(event: React.ChangeEvent<HTMLInputElement>, permission: Permission): void {
        function setPermissionChanging(permission: Permission, changing: boolean): void {
            setChangingPermissions({ ...changingPermissions, [permission.id]: changing });
        }

        setPermissionChanging(permission, true);
        patchPermission({ ...permission, level: event.currentTarget.value as Role })
            .then((updated) => {
                const permissionsCopy = [...permissions];
                permissionsCopy[permissionsCopy.indexOf(permission)] = updated;
                setPermissions(permissionsCopy);
                setPermissionChanging(permission, false);
            })
            .catch(() => setPermissionChanging(permission, false));
    }

    function getLevelSelection(permission: Permission): React.ReactNode {
        return (
            <td key={permission.level}>
                <Form.Group>
                    <Form.Control
                        as="select"
                        value={permission.level}
                        disabled={
                            /* May have a key in changingPermissions, may be undefined.*/
                            changingPermissions[permission.id]
                        }
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => updatePermission(event, permission)}
                    >
                        {ROLES.map((role) => {
                            return <option key={role}>{role}</option>;
                        })}
                    </Form.Control>
                </Form.Group>
            </td>
        );
    }

    const propertyMappings: PropertyMapping<Permission>[] = [
        ['Email', 'email'],
        ['Level', getLevelSelection],
    ];

    const table: React.ReactNode = (
        <GenericTable<Permission> striped propertyMappings={propertyMappings} values={permissions} />
    );

    return <PaginatedLoader<Permission> getValues={getValues} table={table} updateValues={setPermissions} />;
}
