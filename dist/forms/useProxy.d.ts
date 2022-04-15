interface Keyable {
    [key: string]: any;
}
export default function useProxy(args?: Keyable): {
    state: Keyable;
    snap: any;
};
export {};
