import Timestamps from './Timestamps';

type Hunt = Timestamps & {
    id: string;
    name: string;
    roster_id: string;
    current_match_id: number;
    num_active_licenses: number;
};

export default Hunt;
