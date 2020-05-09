import React from 'react';
import Axios from 'axios';
import Roster from '../../../../models/Roster';
import { store } from 'react-notifications-component';
import { rostersPath as rostersApiPath, rostersPath } from '../../../../routes/ApiPaths';
import RostersTable from './RostersTable';
import RosterParticipantsView from '../participants/RosterParticipantsView';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';

interface State {
    rosters: Roster[];
}

export default class RosterView extends React.Component<any, State> {
    componentDidMount() {
        Axios.get<Roster[]>(rostersApiPath, {
            headers: {
                Authorization: this.props.auth.auth_token,
            },
        })
            .then((response) => {
                this.setRosters(response.data);
            })
            .catch(() => {
                store.addNotification({
                    message: 'Failed to load rosters 😢',
                    type: 'danger',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                        duration: 2000,
                        onScreen: true,
                    },
                });
            });
    }

    setRosters(rosters: Roster[]) {
        let state: State = { ...this.state };
        state.rosters = rosters;
        this.setState(state);
    }

    render(): JSX.Element {
        return (
            <>
                <Switch>
                    <Route
                        path=":rosterId"
                        render={(props: RouteComponentProps<{ rosterId: string }>) => {
                            let foundRoster: Roster | undefined = this.state.rosters.find(
                                (roster) => roster.id === props.match.params.rosterId,
                            );
                            if (foundRoster) {
                                return <RosterParticipantsView roster={foundRoster} />;
                            } else {
                                return <Redirect to={rostersPath} />;
                            }
                        }}
                    ></Route>
                    <Route>
                        <RostersTable rosters={this.state.rosters} />
                    </Route>
                </Switch>
            </>
        );
    }
}
