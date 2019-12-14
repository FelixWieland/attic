import Attic from "../src/Attic";
import { IAtticOptions } from "../src/IOptions";

jest.useFakeTimers();

let attic: Attic;
const name = "testStore";
const settings: IAtticOptions = {
    lifetime: 1000,
};

const ids = {
    item1: "id1",
};

const items = {
    item1: { a: 1 },
};

const fallbackProm = () => new Promise((resolve, _) => resolve(1));

test("creation of item", () => {
    attic = new Attic(name, settings);
});

test("can save items", async () => {
    await attic.set(ids.item1, items.item1);
    const content = await attic.get(ids.item1).fallback(fallbackProm()).then((c: any) => c);
    expect(content).toBe(items.item1);
});
