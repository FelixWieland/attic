import ICache from "./ICache";
import { IAtticOptions } from "./IOptions";
import Item, { Lifetime } from "./Item";
import MemoryCache from "./MemoryCache";
import PersistentCache from "./PersistentCache";

class Attic {
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

    public remove = (id: string) => {
        this.memoryCache.remove(id);
        this.persistentCache.remove(id);
    }

    public get = (id: string) => {
        let item = this.memoryCache.retrieve(id);
        if (item && !item.reachedEndOfLife()) {
            return this.makeContentPromise(item);
        }
        item = this.persistentCache.retrieve(id);
        if (item && !item.reachedEndOfLife()) {
            this.memoryCache.restore(id, item);
            return this.makeContentPromise(item);
        }
        return this.makeFallbackPromise(id);
    }

    public set = async (id: string, setter: any) => {
        if (setter instanceof Promise) {
            this.set(id, await setter);
        } else if (typeof setter === "function") {
            this.set(id, setter());
        } else {
            this.saveToBothCaches(id, setter);
        }
    }

    private makeContentPromise = (item: Item) => this.fallbackFactory(async () => item.get());

    private makeFallbackPromise = <T>(id: string) =>
        this.fallbackFactory(async (promise: Promise<T>) =>
                                this.saveToBothCaches(id, await promise) && await promise)

    private fallbackFactory = (fn: (arg0: Promise<any>) => Promise<any>) => ({
        fallback: fn,
    })

    private saveToBothCaches(id: string, content: any) {
        this.memoryCache.set(id, content);
        const item = this.memoryCache.retrieve(id);
        if (!item) {
            return false;
        }
        this.persistentCache.restore(id, item);
        return true;
    }

}

export default Attic;
