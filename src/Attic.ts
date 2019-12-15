import IAttic from "./IAttic";
import ICache from "./ICache";
import { IAtticOptions } from "./IOptions";
import Item, { Lifetime } from "./Item";
import MemoryCache from "./MemoryCache";
import PersistentCache from "./PersistentCache";

class Attic implements IAttic {
    public static readonly defaultOptions: IAtticOptions = {
        lifetime: null,
        memoryCache: undefined,
        persistentCache: undefined,
        storage: localStorage,
    };

    public readonly options: IAtticOptions;
    public readonly name: string;

    private persistentCache: ICache;
    private memoryCache: ICache;

    constructor(name: string, options: IAtticOptions) {
        this.options = {
            ...Attic.defaultOptions,
            ...(options || {}),
        };

        this.name = name;

        this.memoryCache = this.options.memoryCache = !this.options.memoryCache
            ? new MemoryCache(options)
            : this.options.memoryCache;
        this.persistentCache = this.options.persistentCache = !this.options.persistentCache
            ? new PersistentCache(this.name, options)
            : this.options.persistentCache;
    }

    /**
     * @param id - of the item that should be removed
     */
    public remove = (id: string) => {
        this.memoryCache.remove(id);
        this.persistentCache.remove(id);
    }

    /**
     * @param id - of the item that should be read
     * @returns
     */
    public get = (id: string) => {
        const item = this.getFromMemory(id) || this.getFromPersistent(id);
        return item ? this.makeContentPromise(item) : this.makeFallbackPromise(id);
    }

    /**
     * @param id - of the item that should be stored
     * @param setter - content that should be stored.
     *                 can be a promise, a function that returns the content/promise
     *                 or simply the content
     */
    public set = async (id: string, setter: any) => {
        if (setter instanceof Promise) {
            this.set(id, await setter);
        } else if (typeof setter === "function") {
            this.set(id, setter());
        } else {
            this.saveToBothCaches(id, setter);
        }
    }

    private getFromMemory = (id: string) => {
        const item = this.memoryCache.retrieve(id);
        return !item || item.reachedEndOfLife() ? undefined : item;
    }

    private getFromPersistent = (id: string) => {
        const item = this.persistentCache.retrieve(id);
        return !item || item.reachedEndOfLife() ? undefined : this.memoryCache.restore(id, item);
    }

    private makeContentPromise = (item: Item) => this.fallbackFactory(async () => item.get());

    private makeFallbackPromise = <T>(id: string) =>
        this.fallbackFactory(async (promiseFn: () => Promise<T>) => {
            const promise = promiseFn();
            return this.saveToBothCaches(id, await promise) && await promise;
        })

    private fallbackFactory = (fn: any) => ({ fallback: fn });

    private saveToBothCaches(id: string, content: any) {
        this.memoryCache.set(id, content);
        const item = this.memoryCache.retrieve(id);
        return item ? !!this.persistentCache.restore(id, item) : false;
    }

}

export default Attic;
