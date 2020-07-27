import Timestamps from './Timestamps';
import Identifiable from './Identifiable';
import Roster from './Roster';

/** Base type of the hunt  */
type HuntBase = {
    name: string;
    roster_id: string;
    current_match_id: number;
    num_active_licenses: number;
    current_round_number: number;
};

type Hunt = Timestamps &
    Identifiable &
    HuntBase & {
        attachment_urls: {
            printout: string | undefined | null;
            template_pdf: string | undefined | null;
        };
    };

type HuntWithProperties = Hunt & {
    roster: Pick<Roster, 'participant_properties'>;
};

export default Hunt;
export { HuntBase, HuntWithProperties };
