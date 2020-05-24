import Timestamps from './Timestamps';
import { LicenseBase } from './License';

type Match = Timestamps & {
    id: string;
    open: boolean;
    round_id: string;
    local_id: number;
    licenses: LicenseBase[];
};

export default Match;
