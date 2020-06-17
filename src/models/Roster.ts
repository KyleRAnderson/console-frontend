import Timestamps from './Timestamps';
import Identifiable from './Identifiable';

type RosterBase = {
    name: string;
    participant_properties: string[];
};

type Roster = Timestamps & Identifiable & RosterBase;
export default Roster;
export { RosterBase };
