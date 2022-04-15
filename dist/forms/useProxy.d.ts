interface Keyable {
    [key: string]: any;
}
export default function useProxy(args?: Keyable, computed?: Keyable): {
    data: Keyable;
    state: any;
};
export {};
