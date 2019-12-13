import MemoryCache from "../src/MemoryCache";

let cache: MemoryCache;
const lifetime = 1000;

const content1 = { a: 1 };

test("creation of memory cache", () => {
    cache = new MemoryCache({ lifetime });
    expect(cache.options.lifetime).toBe(lifetime);
});

test("should create a item", () => {
    cache.set("id1", content1);
});

test("should get the previous created item", () => {
    const item = cache.get("id1");
    expect(item).toEqual(content1);
});

test("should return the right amount of items", () => {
    expect(cache.items()).toBe(1);
});

test("should retrieve a item with type Item", () => {
    const item = cache.retrieve("id1");
    expect(item.get()).toEqual(content1);
});

test("can completly restore a item", () => {
    const id = "id1";
    const item = cache.retrieve(id);
    const demoCache = new MemoryCache({ lifetime });
    demoCache.restore(id, item);
    expect(demoCache.retrieve(id)).toEqual(item);
});

test("should delete the created item", () => {
    cache.remove("id1");
    expect(cache.items()).toBe(0);
});

test("should create a item that is unexistent after ent of life", (done) => {
    cache.set("id2", { a: 2 });
    setTimeout(() => {
        const item = cache.get("id2");
        expect(item).toBe(undefined);
        done();
    }, lifetime + 100);
});
