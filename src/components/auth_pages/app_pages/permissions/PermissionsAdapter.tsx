import React from 'react';
import GenericPaginated from '../../../GenericPaginated';
import GenericTable, { PropertyMapping } from '../../../GenericTable';
import Permission, { ROLES } from '../../../../models/Permission';
import { PermissionPaginatedResponse, getPermissions } from '../../../../api/permissionAPI';
import { Form } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';

type Props = RouteComponentProps<{ [ROSTER_ID_PARAM]: string }>;

export default function PermissionsAdapter(props: Props): JSX.Element {
    async function getValues(currentPage: number, recordsPerPage?: number): Promise<[Permission[], number]> {
        const response: PermissionPaginatedResponse = await getPermissions(props.match.params[ROSTER_ID_PARAM], {
            page: currentPage,
            per_page: recordsPerPage,
        });
        return [response.permissions, response.num_pages];
    }

    function getLevelSelection(permission: Permission): React.ReactNode {
        return (
            <td key={permission.level}>
                <Form.Group>
                    <Form.Control as="select" defaultValue={permission.level}>
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

    function getTable(values: Permission[]): React.ReactNode {
        return <GenericTable<Permission> striped propertyMappings={propertyMappings} values={values} />;
    }

    return <GenericPaginated<Permission> getValues={getValues} table={getTable} />;
}
