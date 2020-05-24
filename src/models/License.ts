import Timestamps from './Timestamps';
import { ParticipantBase } from './Participant';

type LicenseBase = {
    id: string;
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
