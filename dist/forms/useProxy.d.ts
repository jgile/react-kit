interface Keyable {
    [key: string]: any;
}
export default function useProxy(args?: Keyable, computed?: Keyable): {
    proxy: Keyable;
    state: any;
};
export {};
