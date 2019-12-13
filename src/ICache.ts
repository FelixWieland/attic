import Item from "./Item";

interface ICache {
    items(): number;
    keys(): string[];
    set(id: string, item: object): void;
    get(id: string): object | undefined;
    remove(id: string): void;
    retrieve(id: string): Item | undefined;
    restore(id: string, item: Item): void;
}

export default ICache;
