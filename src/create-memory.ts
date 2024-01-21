export const createMemory = (sizeInBytes: number): DataView => {
    const arrayBuffer = new ArrayBuffer(sizeInBytes);
    return new DataView(arrayBuffer);
}

