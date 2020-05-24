import Timestamps from './Timestamps';

type User = Timestamps & {
    email: string;
    id: string;
};

export default User;
