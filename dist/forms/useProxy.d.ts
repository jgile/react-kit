interface Keyable {
    [key: string]: any;
}
export default function useProxy(args?: Keyable, computed?: Keyable): {
    state: Keyable;
    snap: any;
};
export {};
