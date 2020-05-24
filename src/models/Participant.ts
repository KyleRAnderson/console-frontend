import Timestamps from './Timestamps';

type ParticipantBase = {
    first: string;
    last: string;
    extras: { [property: string]: string };
    id: string;
};

type Participant = Timestamps & ParticipantBase;

export default Participant;
export { ParticipantBase };
