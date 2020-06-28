import { ParticipantBase } from './Participant';

type ErrorParticipant = {
    [k in keyof Pick<ParticipantBase, 'first' | 'last'>]: ParticipantBase[k] | null;
} & {
    errors: {
        [key: string]: string[];
    };
    extras: {
        [key: string]: (string | null)[];
    } | null;
};

export default ErrorParticipant;
