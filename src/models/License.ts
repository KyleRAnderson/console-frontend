import Timestamps from './Timestamps';
import { ParticipantBase } from './Participant';
import Identifiable from './Identifiable';

type LicenseBase = Identifiable & {
    eliminated: boolean;
    participant: ParticipantBase;
};

type License = Timestamps &
    LicenseBase & {
        match_ids: string[];
        hunt_id: string;
    };

export default License;
export { LicenseBase };
