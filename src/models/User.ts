import Timestamps from './Timestamps';
import Identifiable from './Identifiable';

type UserBase = {
    email: string;
};

type User = Timestamps & Identifiable & UserBase;

export default User;
export type { UserBase };
