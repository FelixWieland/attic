
type Fallback = ({
    fallback: (arg0: <T>() => Promise<T>) => Promise<any>;
});

interface IAttic {
    remove: (id: string) => void;
    get: (id: string) => Fallback;
    set: (id: string, item: any) => Promise<void>;
}

export default IAttic;
