
export type Lifetime = number | null;
type Content = object;

/**
 * A Item with a optional lifetime, serialization and deserialization
 */
class Item {
    /**
     * @param   milliseconds - milliseconds to end of life
     * @returns timestamp that indicates end of life
     */
    public static endOfLife = (milliseconds: number) => Date.now() + milliseconds;

    /**
     * @param objstr - that contains Item information
     * @returns Item with informations from given param
     */
    public static deserialize = (objstr: string) => {
        const obj = JSON.parse(objstr);
        return new Item(obj.content, obj.lifetime, true);
    }

    private content: Content;
    private lifetime: Lifetime;

    /**
     * Initializes the Item.
     * @param content - of the item
     * @param timeTillDie - the time till the item dies
     * @param isLifetime - when true, timeTillDie will be used as the lifetime (used for deserialization)
     */
    constructor(content: Content, timeTillDie: Lifetime = null, isLifetime?: boolean) {
        this.content = content;
        this.lifetime = timeTillDie === null ? null : isLifetime ? timeTillDie : Item.endOfLife(timeTillDie);
    }

    /**
     * @returns set timestamp is older then Date.now
     */
    public reachedEndOfLife = () => this.lifetime === null
        ? false
        : this.lifetime < Date.now()

    /**
     * @returns the contents of the object as json string
     */
    public serialize = () => JSON.stringify(this);

    /**
     *  @returns the content of the item
     */
    public get = () => this.content;

    /**
     * @param content - new content
     */
    public set = (content: Content) => {
        this.content = content;
    }

    /**
     * @returns the lifetime of the Item
     */
    public getLifetime = () => this.lifetime;
}

export default Item;
