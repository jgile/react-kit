export default function useData(...args: any): {
    data: any;
    reset(...fields: any): void;
    setData(key: any, value: any): any;
    isDirty: boolean;
};
