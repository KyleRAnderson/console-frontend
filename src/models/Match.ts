import Timestamps from './Timestamps';
import { LicenseBase } from './License';
import Identifiable from './Identifiable';

type Match = Timestamps &
    Identifiable & {
        open: boolean;
        round_id: string;
        local_id: number;
        licenses: LicenseBase[];
    };

export default Match;
