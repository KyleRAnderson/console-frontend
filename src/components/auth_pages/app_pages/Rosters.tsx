import React, { useEffect, useState } from 'react';
import Roster from '../../../models/Roster';
import { rostersPath } from '../../../routes/ApiPaths';
import Axios from 'axios';
import { store } from 'react-notifications-component';
import { AuthProps } from '../AuthPages';

export default function rosters(props: AuthProps) {
    const [rosters, setRosters] = useState<Roster[]>([]);

    useEffect(() => {
        Axios.get<Roster[]>(rostersPath, {
            headers: {
                Authorization: props.auth.auth_token,
            },
        })
            .then((response) => {
                setRosters(response.data);
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
    }, []); // Second parameter prevents it from running on every render, which would create an infinite rendering loop

    return (
        <>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Roster Name</th>
                            <th scope="col">Participant Properties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rosters.map((roster: Roster) => {
                            return (
                                <tr key={roster.id} className="">
                                    <td>{roster.name}</td>
                                    <td>
                                        <ul>
                                            {roster.participant_properties.map((property: string, index) => {
                                                return <li key={index}>{property}</li>;
                                            })}
                                        </ul>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
