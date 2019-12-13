import ICache from "./ICache";
import { IAtticOptions } from "./IOptions";
import { Lifetime } from "./Item";
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

    private copyPersistentToMemory = () => {
        // this.persistentCache.keys().map((key) => {
        //     this.memoryCache.;
        // });

    }

}

export default Attic;
