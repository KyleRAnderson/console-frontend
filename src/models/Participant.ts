import Timestamps from './Timestamps';
import Identifiable from './Identifiable';

type ParticipantBase = {
    first: string;
    last: string;
    extras: { [property: string]: string };
};

type Participant = Identifiable & Timestamps & ParticipantBase;

export default Participant;
export type { ParticipantBase };
