import Identifiable from '../models/Identifiable';

export default function getId<T extends Identifiable>(model: T | string): string {
    return typeof model === 'string' ? model : model.id;
}
