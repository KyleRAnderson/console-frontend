import Timestamps from './Timestamps';
import Identifiable from './Identifiable';

type ParticipantBase = Identifiable & {
    first: string;
    last: string;
    extras: { [property: string]: string };
};

type Participant = Timestamps & ParticipantBase;

export default Participant;
export { ParticipantBase };
