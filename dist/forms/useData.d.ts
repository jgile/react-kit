export default function useData(...args: any): {
    data: any;
    isDirty: boolean;
    reset(...fields: any): void;
    setData(key: any, value: any): any;
};
