import IAttic from "./IAttic";
import ICache from "./ICache";
import { IAtticOptions } from "./IOptions";
import Item, { Lifetime } from "./Item";
import MemoryCache from "./MemoryCache";
import PersistentCache from "./PersistentCache";

class Attic implements IAttic {
    public static readonly defaultOptions: IAtticOptions = {
        fallbackExtractor: (content: any) => content,
        lifetime: null,
        memoryCache: undefined,
        persistentCache: undefined,
        syncOnInit: false,
    };

    public readonly options: IAtticOptions;
    public readonly name: string;

    private persistentCache: ICache;
    private memoryCache: ICache;

    /**
     * Attic
     *
     * Creates a attic cache. Attic syncs a persistent storage like localStorage with a memory storage
     * to reduce read time. Additionaly it can track the lifetime of a element and discard it if its too old.
     *
     * To minimize null values you must provide a fallback (like a API-Fetch) each time you read from cache.
     * If a item dont exists or if the lifetime of a element is over the fallback function is used and the result
     * of that function will be stored with the id you passed in the get function.
     *
     * @param name - used to identify elements in a persistent storage e.g. localStorage
     * @param options - specify lifetime and/or use your custom storage:
     * E.g. to use sessionStorage pass in a object like:
     *      {
     *          persistentCache: sessionStorage
     *      }
     */
    constructor(name: string, options?: IAtticOptions) {
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

        if (this.options.syncOnInit) {
            this.syncAll();
        }
    }

    /**
     * @returns the number of items in memoryCache
     */
    public itemsInMemory = () => this.memoryCache.items();

    /**
     * @returns the number of items in persistentCache
     */
    public itemsInPersistent = () => this.persistentCache.items();

    /**
     * @param id - of the item that should be removed
     */
    public remove = (id: string) => {
        this.memoryCache.remove(id);
        this.persistentCache.remove(id);
        return undefined;
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
        return item && item.reachedEndOfLife() ? this.remove(id) : item;
    }

    private getFromPersistent = (id: string) => {
        const item = this.persistentCache.retrieve(id);
        return item && item.reachedEndOfLife()
                    ? this.remove(id) : item ? this.memoryCache.restore(id, item) : item;
    }

    private makeContentPromise = (item: Item) => this.fallbackFactory(async () => item.get());

    private makeFallbackPromise = <T>(id: string) =>
        this.fallbackFactory(async (fallbackPromise: () => Promise<T>) => {
            const content = await fallbackPromise();
            const extractedContent = await this.options.fallbackExtractor!(content);
            return this.saveToBothCaches(id, extractedContent) && extractedContent;
        })

    private fallbackFactory = (fallback: (fn: () => Promise<any>) => Promise<any>) => ({ fallback });

    private saveToBothCaches(id: string, content: any) {
        this.memoryCache.set(id, content);
        const item = this.memoryCache.retrieve(id);
        return item ? !!this.persistentCache.restore(id, item) : false;
    }

    private syncAll = () => this.persistentCache.keys().map((id) => this.getFromPersistent(id));

}

export default Attic;
