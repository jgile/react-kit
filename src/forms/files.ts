export function hasFiles(data: any): any {
    return (data instanceof File ||
        data instanceof Blob ||
        (data instanceof FileList && data.length > 0) ||
        // @ts-ignore
        (data instanceof FormData && Array.from(data.values()).some((value) => hasFiles(value))) ||
        (typeof data === 'object' && data !== null && Object.values(data).some((value) => hasFiles(value))));
}
