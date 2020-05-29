import Timestamps from './Timestamps';
import { LicenseBase } from './License';
import Identifiable from './Identifiable';

type MatchBase = Identifiable & {
    open: boolean;
    round_id: string;
    local_id: number;
    licenses: LicenseBase[];
};

type Match = Timestamps & MatchBase;

export default Match;
export { MatchBase };
