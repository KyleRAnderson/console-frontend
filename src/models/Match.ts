import Timestamps from './Timestamps';
import License from './License';
import Identifiable from './Identifiable';

type MatchBase = {
    open?: boolean;
    license_ids: string[];
};

type Match = Identifiable &
    Timestamps &
    Required<MatchBase> & {
        round_id: string;
        local_id: number;
        licenses: Pick<License, 'id' | 'eliminated' | 'participant'>[];
    };

export default Match;
export { MatchBase };
