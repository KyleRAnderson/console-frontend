import React from 'react';
import License from '../../../../models/License';
import LicenseAPI from './licenseAPI';
import Notifications from '../../../../notification';
import ParticipantsTable from '../participants/ParticipantsTable';
import { ParticipantBase } from '../../../../models/Participant';

type Props = {
    huntId: string;
    participantProperties: string[];
};

type State = {
    licenses: License[];
};

export default class Licenses extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            licenses: [],
        };
    }

    componentDidMount() {
        LicenseAPI.getLicenses(this.props.huntId)
            .then((response) => {
                this.setState({ ...this.state, licenses: response.data });
            })
            .catch(() => {
                Notifications.createNotification({ message: "Couldn't load participants.", type: 'danger' });
            });
    }

    render() {
        if (this.state.licenses.length == 0) {
            return <h1>Loading...</h1>;
        }

        type ParticipantWithEliminated = ParticipantBase & Pick<License, 'eliminated'>;

        const participants: ParticipantWithEliminated[] = this.state.licenses.map((license) => {
            return { ...license.participant, eliminated: license.eliminated };
        });

        const extraColumn: [string, (participant: ParticipantWithEliminated) => string] = [
            'Eliminated',
            (participant) => {
                return participant.eliminated ? 'Yes' : 'No';
            },
        ];

        return (
            <ParticipantsTable
                participant_attributes={this.props.participantProperties}
                participants={participants}
                extraColumns={[extraColumn]}
            />
        );
    }
}
