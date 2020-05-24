import Timestamps from './Timestamps';

type Hunt = Timestamps & {
    id: string;
    name: string;
    roster_id: string;
    current_match_id: number;
};

export default Hunt;
