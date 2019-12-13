import ICache from "./ICache";
import { IBaseCacheOptions } from "./IOptions";
import Item from "./Item";

abstract class BaseCache implements ICache {
    public static readonly defaultOptions: IBaseCacheOptions = {
        lifetime: null,
    };
    public readonly options: IBaseCacheOptions;
    public store: { [id: string]: Item; };

    constructor(options?: IBaseCacheOptions) {
        this.options = {
            ...BaseCache.defaultOptions,
            ...(options || {}),
        };
        this.store = {};
    }

    /**
     * @returns keys of stored items. Expensive operation!
     */
    public keys = () => Object.keys(this.store);

    /**
     * @returns count of stored items. Expensive Operation!
     */
    public items = () => this.keys().length;

    /**
     * @param id - of the item that should be stored
     * @param item - content that should be stored
     */
    public set = (id: string, item: object) => this.restore(id, new Item(item, this.options.lifetime));

    /**
     * @param id - of the item that should be read
     * @returns content
     */
    public get = (id: string) => {
        const item = this.retrieve(id);
        if (!item) { return undefined; }
        if (item.reachedEndOfLife()) {
            this.remove(id);
            return undefined;
        }
        return item.get();
    }

    /**
     * @param id - of the item that should be read
     */
    public abstract remove(id: string): void;

    /**
     * @param id of the item that should be retrieved
     * @returns retrieves the whole item with sotred metainformations
     */
    public abstract retrieve(id: string): Item;

    /**
     * @param id - of the Item
     * @param item - that should be stored
     */
    public abstract restore(id: string, item: Item): void;
}

export default BaseCache;
