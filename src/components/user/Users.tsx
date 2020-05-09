import React, { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import User from '../../models/User';
import * as appRoutes from '../../routes/AppLocations';
import * as apiRoutes from '../../routes/ApiPaths';
import Axios from 'axios';
import { Table } from 'react-bootstrap';

type State = {
    toHome: boolean;
    users: User[];
};

class UserList extends React.Component<any, State> {
    state = {
        toHome: false,
        users: Array<User>(),
    };

    componentDidMount() {
        this.loadUsers();
        document.title = 'User List';
    }

    loadUsers(): void {
        Axios.get<User[]>(apiRoutes.usersRootPath)
            .then((response) => {
                this.setState(Object.assign({}, this.state, { users: response.data }));
            })
            .catch(() => this.setState({ users: [], toHome: true }));
    }

    render(): ReactNode {
        if (this.state.toHome) {
            return <Redirect to={appRoutes.root} />;
        }

        const users = this.state.users;
        const allUsersDisplay: JSX.Element[] = users.map((user: User) => {
            return (
                <tr key={user.id} className="">
                    <td>{user.email}</td>
                    <td>
                        <button type="button" className="btn btn-danger" onClick={() => this.deleteUser(user.id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <>
                <Table striped responsive>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>{allUsersDisplay}</tbody>
                </Table>
            </>
        );
    }

    deleteUser(id: string): void {
        const token: string | undefined = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (token) {
            Axios.delete(`${apiRoutes.usersRootPath}${id}`, {
                headers: {
                    'X-CSRF-Token': token,
                    'Content-Type': 'application/json',
                },
            }).then(() => {
                const newUsersArray: Array<User> = this.state.users.filter((user) => user.id !== id);
                this.setState(Object.assign({}, this.state, { users: newUsersArray }));
            });
        }
    }
}

export default UserList;
