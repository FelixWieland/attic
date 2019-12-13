import PersistentCache from "../src/PersistentCache";

let cache: PersistentCache;
let cache2: PersistentCache;
const lifetime = 1000;
const name1 = "uno";
const name2 = "duo";

const content1 = { a: 1 };
const content2 = { a: 2 };

it("creation of persistent cache", () => {
    cache = new PersistentCache(name1, { lifetime });
    cache2 = new PersistentCache(name2, { lifetime });
    expect(cache.options.lifetime).toBe(lifetime);
    expect(cache2.options.lifetime).toBe(lifetime);
});

it("should create a item", () => {
    cache.set("id1", content1);
});

it("should get the previous created item", () => {
    const item = cache.get("id1");
    expect(item).toEqual(content1);
});

test("should retrieve a item with type Item", () => {
    const item = cache.retrieve("id1");
    expect(item.get()).toEqual(content1);
});

test("can completly restore a item", () => {
    const id = "id1";
    const item = cache.retrieve(id);
    const demoCache = new PersistentCache("demoXY", { lifetime });
    demoCache.restore(id, item);
    expect(typeof demoCache.retrieve(id)).toEqual(typeof item);
});

it("should return the right amount of items", () => {
    expect(cache.items()).toBe(1);
});

it("should return the right keys", () => {
    expect(cache.keys().sort()).toEqual(["id1"].sort());
});

it("should delete the created item", () => {
    cache.remove("id1");
    expect(cache.items()).toBe(0);
});

it("should create a item that is unexistent after end of life", (done) => {
    cache.set("id2", content2 );
    setTimeout(() => {
        const item = cache.get("id2");
        expect(item).toBe(undefined);
        done();
    }, lifetime + 200);
});
