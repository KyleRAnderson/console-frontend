import Timestamps from './Timestamps';

type Roster = Timestamps & {
    id: string;
    name: string;
    user_id: string;
    participant_properties: string[];
};
export default Roster;
