import React from 'react';
import { Redirect, Link } from 'react-router-dom';
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
        users: [],
    };

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        fetch(apiRoutes.usersIndexPath)
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
        const allUsersDisplay = users.map((user: User) => {
            return (
                <div key={user.id} className="col-md-6 col-lg-4">
                    <div className="card-body">
                        <h5 className="card-title">{user.username}</h5>
                        <Link to={`${appRoutes.usersRoot}/${user.id}`} className="btn custom-button">
                            User Details
                        </Link>
                    </div>
                </div>
            );
        });

        return (
            <div>
                <h1>Users</h1>
                {allUsersDisplay}
            </div>
        );
    }
}

export default UserList;
