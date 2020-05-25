import Timestamps from './Timestamps';
import Identifiable from './Identifiable';
import Roster from './Roster';

type HuntBase = {
    name: string;
    roster_id: string;
    current_match_id: number;
    num_active_licenses: number;
};

type Hunt = Timestamps & Identifiable & HuntBase;

type HuntWithProperties = Hunt & {
    roster: Pick<Roster, 'participant_properties'>;
};

export default Hunt;
export { HuntBase, HuntWithProperties };
