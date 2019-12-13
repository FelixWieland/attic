import BaseCache from "./BaseCache";
import ICache from "./ICache";
import { IMemoryCacheOptions } from "./IOptions";
import Item from "./Item";

class MemoryCache extends BaseCache  {
    public static readonly defaultOptions: IMemoryCacheOptions = {
        lifetime: null,
    };

    public readonly options: IMemoryCacheOptions;
    public readonly store: { [id: string]: Item; };

    constructor(options?: IMemoryCacheOptions) {
        super(options);
        this.options = {
            ...MemoryCache.defaultOptions,
            ...(options || {}),
        };
        this.store = {};
    }

    /**
     * @param id of the item that should be delted
     */
    public remove = (id: string) => {
        delete this.store[id];
    }

    /**
     * @param id of the item that should be retrieved
     * @returns retrieves the whole item with sotred metainformations
     */
    public retrieve = (id: string) => {
        const obj: Item = this.store[id] || undefined;
        return obj;
    }

    /**
     * @param id - of the Item
     * @param item - that should be stored
     */
    public restore = (id: string, item: Item) => {
        this.store[id] = item;
    }
}

export default MemoryCache;
