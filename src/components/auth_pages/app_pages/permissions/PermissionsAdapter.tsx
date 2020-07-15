import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import {
    deletePermission as deletePermissionAPI,
    getPermissions,
    updatePermission as patchPermission,
} from '../../../../api/permissionAPI';
import FormControlElement from '../../../../FormControlElement';
import Permission, { Role } from '../../../../models/Permission';
import { createNotification } from '../../../../notification';
import * as AppPaths from '../../../../routes/AppPaths';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import PaginatedLoader, { Props as PaginationProps } from '../../../generics/PaginatedLoader';
import LevelSelect from './LevelSelect';

export type Props = RouteComponentProps<{ [ROSTER_ID_PARAM]: string }> &
    Pick<PaginationProps<Permission>, 'updateSignal'>;

export default function PermissionsAdapter(props: Props): JSX.Element {
    const [changingPermissions, setChangingPermissions] = useState<{ [permissionId: string]: boolean }>({});
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [notFound, setNotFound] = useState<boolean>(false);

    async function getValues(currentPage: number, recordsPerPage?: number): Promise<[Permission[], number]> {
        const { data: response } = await getPermissions(props.match.params[ROSTER_ID_PARAM], {
            page: currentPage,
            per_page: recordsPerPage,
        });
        return [response.permissions, response.num_pages];
    }

    // Known issue: This will not update the current owner if they promote someone else.
    function updatePermission(event: React.ChangeEvent<FormControlElement>, permission: Permission): void {
        function setPermissionChanging(permission: Permission, changing: boolean): void {
            setChangingPermissions({ ...changingPermissions, [permission.id]: changing });
        }

        setPermissionChanging(permission, true);
        patchPermission({ ...permission, level: event.currentTarget.value as Role })
            .then(({ data: updated }) => {
                const permissionsCopy = [...permissions];
                permissionsCopy[permissionsCopy.indexOf(permission)] = updated;
                setPermissions(permissionsCopy);
                setPermissionChanging(permission, false);
            })
            .catch(() => {
                setPermissionChanging(permission, false);
                createNotification({
                    type: 'warning',
                    message: "Couldn't change permission, you may not be authorized.",
                });
            });
    }

    function deletePermission(permission: Permission): void {
        deletePermissionAPI(permission)
            .then(() => {
                setPermissions(permissions.filter((perm) => perm.id != permission.id));
                createNotification({ type: 'success', message: 'User removed' });
            })
            .catch(() => createNotification({ type: 'warning', message: 'Failed to remove user.' }));
    }

    function getLevelSelection(permission: Permission): React.ReactNode {
        return (
            <td key={`${permission.id}_level`}>
                <LevelSelect
                    onChange={(event) => updatePermission(event, permission)}
                    disabled={
                        /* May have a key in changingPermissions, may be undefined.*/
                        changingPermissions[permission.id]
                    }
                    level={permission.level}
                />
            </td>
        );
    }

    function getActions(permission: Permission): React.ReactNode {
        return (
            <td key={`${permission.id}_delete`}>
                <Button type="button" variant="danger" onClick={() => deletePermission(permission)}>
                    Remove
                </Button>
            </td>
        );
    }

    function onError(reason: unknown): void {
        let message = 'Error loading permissions';
        if ((reason as AxiosError).response?.status == 404) {
            setNotFound(true);
            message = 'Not found';
        }
        createNotification({ type: 'danger', message: message });
    }

    // Redirect out of here when not able to load.
    if (notFound) {
        return <Redirect to={AppPaths.ROSTERS_PATH} />;
    }

    const propertyMappings: PropertyMapping<Permission>[] = [
        ['Email', 'email'],
        ['Level', getLevelSelection],
        ['Actions', getActions],
    ];

    const table: React.ReactNode = (
        <GenericTable<Permission> striped propertyMappings={propertyMappings} values={permissions} />
    );

    return (
        <PaginatedLoader<Permission>
            updateSignal={props.updateSignal}
            getValues={getValues}
            table={table}
            updateValues={setPermissions}
            onError={onError}
        />
    );
}
