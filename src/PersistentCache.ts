import BaseCache from "./BaseCache";
import { IPersistentCacheOptions } from "./IOptions";
import Item from "./Item";

type Storage = IStorage;
declare global {
    var localStorage: Storage;
}

class PersistentCache extends BaseCache {
    public static readonly defaultOptions: IPersistentCacheOptions = {
        lifetime: null,
        storage: localStorage as Storage,
    };

    public readonly name: string;
    public readonly options: IPersistentCacheOptions;
    public readonly store: Storage;

    /**
     * Creates a new Persistent Cache.
     * @param uniqueName - used to identify Items in given storage
     * @param options - options to pass additional configuraitons e.g a custom storage
     */
    constructor(uniqueName: string, options?: IPersistentCacheOptions) {
        super(options);
        this.options = {
            ...PersistentCache.defaultOptions,
            ...(options || {}),
        };

        this.store = this.options.storage === undefined ? localStorage : this.options.storage;
        this.name = uniqueName;
    }

    /**
     * @param id of the item
     * @returns id with cache-name as prefix
     */
    public uniqueAccessorID = (id: string) => this.name + id;

    /**
     * @returns keys of stored items. Expensive operation!
     */
    public keys = () => Object.keys(this.store).filter((e) => e.startsWith(this.name)).map((e) => e.replace(this.name, ""));

    /**
     * @param id - of the item that should be read
     */
    public remove = (id: string) => {
        this.store.removeItem(this.uniqueAccessorID(id));
    }

    /**
     * @param id of the item that should be retrieved
     * @returns retrieves the whole item with sotred metainformations
     */
    public retrieve = (id: string) => {
        const rawobj = this.store.getItem(this.uniqueAccessorID(id)) || undefined;
        if (!rawobj) { return undefined as unknown as Item; }
        return Item.deserialize(rawobj);
    }

    /**
     * @param id - of the Item
     * @param item - that should be stored
     */
    public restore = (id: string, item: Item) => {
        this.store.setItem(
            this.uniqueAccessorID(id),
            item.serialize(),
        );
    }
}

export default PersistentCache;
