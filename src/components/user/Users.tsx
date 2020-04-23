import React from 'react';
import { Redirect } from 'react-router-dom';
import User from '../../models/User';
import * as appRoutes from '../../routes/AppLocations';
import * as apiRoutes from '../../routes/ApiPaths';

type State = {
    toHome: boolean;
    users: User[];
};

class UserList extends React.Component<any, State> {
    state = {
        toHome: false,
        users: Array<User>(),
    };

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        this.loadUsers();
        document.title = 'User List';
    }

    loadUsers(): void {
        fetch(apiRoutes.usersRootPath)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch users.');
            })
            .then((response) => this.setState(Object.assign({}, this.state, { users: response })))
            .catch(() => this.setState({ users: [], toHome: true }));
    }

    render() {
        if (this.state.toHome) {
            return <Redirect to={appRoutes.root} />;
        }

        const users = this.state.users;
        const allUsersDisplay: JSX.Element[] = users.map((user: User) => {
            return (
                <tr key={user.id} className="">
                    <td>{user.username}</td>
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
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Email</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>{allUsersDisplay}</tbody>
                    </table>
                </div>
            </>
        );
    }

    deleteUser(id: string): void {
        const token: string | undefined = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (token) {
            fetch(`${apiRoutes.usersRootPath}/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': token,
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                if (response.ok) {
                    const newUsersArray: Array<User> = this.state.users.filter((user) => user.id !== id);
                    this.setState(Object.assign({}, this.state, { users: newUsersArray }));
                }
            });
        }
    }
}

export default UserList;
