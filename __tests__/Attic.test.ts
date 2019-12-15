import Attic from "../src/Attic";

jest.useFakeTimers();

let attic: Attic;
const name = "testStore";
const settings = {
    lifetime: 1000,
};

const ids = {
    item1: "id1",
    item2: "id2",
};

const items = {
    item1: { a: 1 },
    item2: { b: 2 },
};

const fallbackProm = (item: object) => () => new Promise((resolve, _) => resolve(item));

test("creation of item", () => {
    attic = new Attic(name, settings);
});

test("can save items", async () => {
    await attic.set(ids.item1, items.item1);
    const content = await attic.get(ids.item1).fallback(fallbackProm(items.item1)).then((c: any) => c);
    expect(content).toBe(items.item1);
});

test("fallback returns item", async () => {
    const content = await attic.get(ids.item2).fallback(fallbackProm(items.item2)).then((c: any) => c);
    expect(content).toBe(items.item2);
});

test("fallback sets item to given id", async () => {
    const content = await attic.get(ids.item2).fallback(fallbackProm(items.item1)).then((c: any) => c);
    expect(content).toBe(items.item2);
});

test("fallback will jump in if Item reached end of life", () => {
    setTimeout(async () => {
        const content = await attic.get(ids.item2).fallback(fallbackProm(items.item1)).then((c: any) => c);
        expect(content).toBe(items.item1);
    }, settings.lifetime + 100);
});

test("can remove items", async () => {
    await attic.set(ids.item1, items.item1);
    const content = await attic.get(ids.item1).fallback(fallbackProm(items.item1)).then((c: any) => c);
    expect(content).toBe(items.item1);

    attic.remove(ids.item1);

    const dummy = await attic.get(ids.item1).fallback(fallbackProm(items.item2)).then((c: any) => c);
    expect(dummy).toBe(items.item2);
});

test("fallback extractor can be spezified", async () => {
    const cache: Attic = new Attic("cache", {
        fallbackExtractor: (object) => object.title,
        lifetime: 10,
    });
    const item = {
        title: "delectus aut autem",
    };
    const content = await cache.get("stuff").fallback(async () => item);
    expect(content).toBe("delectus aut autem");
});
