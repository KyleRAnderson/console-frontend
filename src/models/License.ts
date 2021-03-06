import Identifiable from './Identifiable';
import { ParticipantBase } from './Participant';
import { RecordError } from './ServerError';
import Timestamps from './Timestamps';

type LicenseBase = {
    eliminated?: boolean;
    participant_id: string;
};

type License = Identifiable &
    Timestamps &
    Required<Omit<LicenseBase, 'participant_id'>> & {
        match_numbers: number[];
        hunt_id: string;
        participant: ParticipantBase;
    };

/**
 * A license with validation errors.
 * Timestamps and identifiable aren't guaranteed because the license record
 * may not be persisted to the database.
 */
type LicenseWithErrors = Partial<Identifiable> &
    Partial<Timestamps> &
    Required<LicenseBase> & {
        errors: RecordError;
    };

type LicensePairing = [License, License];

export default License;
export { LicenseBase, LicenseWithErrors, LicensePairing };
