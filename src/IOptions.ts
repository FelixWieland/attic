import ICache from "./ICache";
import { Lifetime } from "./Item";

interface IAtticOptions extends IMemoryCacheOptions, IPersistentCacheOptions  {
    persistentCache?: ICache;
    memoryCache?: ICache;
    fallbackExtractor?: (content: any) => any;
    syncOnInit?: boolean;
}

// tslint:disable-next-line: no-empty-interface
interface IMemoryCacheOptions extends IBaseCacheOptions {

}

interface IPersistentCacheOptions extends IBaseCacheOptions {
    storage?: IStorage;
}

interface IBaseCacheOptions {
    lifetime?: Lifetime;
}

export {
    IAtticOptions,
    IMemoryCacheOptions,
    IPersistentCacheOptions,
    IBaseCacheOptions,
};
