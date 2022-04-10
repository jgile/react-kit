import xor from 'lodash/xor';

export default function toggleArray(value: any, array: Array<any>) {
    return xor(array, [value]);
}
