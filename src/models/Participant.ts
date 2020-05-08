export default interface Participant {
    first: string;
    last: string;
    id: string;
    extras: { [property: string]: string };
}