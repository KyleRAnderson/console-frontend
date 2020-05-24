import Timestamps from './Timestamps';
import Identifiable from './Identifiable';

type HuntBase = {
    name: string;
    roster_id: string;
    current_match_id: number;
    num_active_licenses: number;
};

type Hunt = Timestamps & Identifiable & HuntBase;

export default Hunt;
export { HuntBase };
