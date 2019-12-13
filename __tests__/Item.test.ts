import Item from "../src/Item";

jest.useFakeTimers();

let item: Item;
const lifetime = 1000;
const content = { a: 1 };
const newContent = { b: 2 };

test("creation of item", () => {
    item = new Item(content, lifetime);
    expect(item.get()).toBe(content);
});

test("setItem is working", () => {
    item.set(newContent);
    expect(item.get()).toBe(newContent);
});

test("endoflife is working", () => {
    const endoflife = Item.endOfLife(lifetime);
    expect(endoflife > Date.now()).toBe(true);
});

test("reachedEndOfLife is working", async () => {
    setTimeout(() => {
        expect(item.reachedEndOfLife()).toBe(true);
    }, lifetime + 100);
});

test("getLifetime returns correct lifetime", () => {
    expect(typeof item.getLifetime()).toBe("number");
});

test("serialize is working", () => {
    const serialized = item.serialize();
    expect(serialized.includes("content") && serialized.includes("b")).toBe(true);
});

test("deserialize is working", () => {
    const testItem = new Item(content, lifetime);
    const serialized = testItem.serialize();
    const deserialized = Item.deserialize(serialized);

    setTimeout(() => {
        expect(deserialized.reachedEndOfLife()).toBe(true);
    }, lifetime + 100);
});
