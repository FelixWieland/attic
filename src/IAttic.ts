
type Fallback = ({
    fallback: (arg0: () => Promise<any>) => Promise<any>;
});

interface IAttic {
    remove: (id: string) => void;
    get: (id: string) => Fallback;
    set: (id: string, item: any) => Promise<void>;
}

export default IAttic;
