import Timestamps from './Timestamps';
import Identifiable from './Identifiable';

type RoundBase = {
    number: number;
};

type Round = Timestamps & Identifiable & RoundBase;

export default Round;
export type { RoundBase };
