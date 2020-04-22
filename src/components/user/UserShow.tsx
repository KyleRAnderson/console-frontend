import React from 'react';
import { Redirect } from 'react-router-dom';
import User from '../../models/User';
import * as apiRoutes from '../../routes/ApiPaths';
import * as appRoutes from '../../routes/AppLocations';

type UserProps = {
    match: {
        params: {
            id: string;
        };
    };
};

type State = {
    user: User | null;
    toIndex: boolean;
};

class UserShow extends React.Component<UserProps, State> {
    static defaultProps: UserProps = {
        match: {
            params: {
                id: '',
            },
        },
    };

    state: Readonly<State> = {
        user: null,
        toIndex: false,
    };

    constructor(props: UserProps) {
        super(props);
        this.state = {
            user: {
                id: '',
                username: '',
                email: '',
            },
            toIndex: false,
        };
    }

    componentDidMount() {
        const {
            match: {
                params: { id },
            },
        } = this.props; // Object destructuring

        const url: string = `${apiRoutes.usersShowPath}/${id}`;
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Unable to get user data for user with id ${id}`);
            })
            .then((response) =>
                this.setState({
                    user: { id: id, username: response.username, email: response.email },
                }),
            )
            .catch(() => this.setState({ user: null, toIndex: true }));
    }

    render() {
        const user: User | null = this.state.user;
        if (this.state.toIndex) {
            return <Redirect to={appRoutes.usersRoot} />;
        }
        return (
            <div>
                <h1>{user?.username}</h1>
                <h2>{user?.email}</h2>
            </div>
        );
    }
}

export default UserShow;
