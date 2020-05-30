import Timestamps from './Timestamps';
import Identifiable from './Identifiable';
import { ParticipantBase } from './Participant';

type LicenseBase = {
    eliminated?: boolean;
    participant_id: string;
};

type License = Identifiable &
    Timestamps &
    Required<Omit<LicenseBase, 'participant_id'>> & {
        match_ids: string[];
        hunt_id: string;
        participant: ParticipantBase;
    };

export default License;
export { LicenseBase };
