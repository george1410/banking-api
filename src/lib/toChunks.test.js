import toChunks from './toChunks';

describe('To chunks', () => {
  test('should return an array containing a single item if input length is equal to the chunk size', () => {
    const chunkSize = 9;
    const chunks = toChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], chunkSize);
    expect(chunks).toHaveLength(1);
  });

  test('should return an array containing a single item if input length is less than the chunk size', () => {
    const chunkSize = 9;
    const chunks = toChunks([1, 2, 3], chunkSize);
    expect(chunks).toHaveLength(1);
  });

  test('should return an array with single array containing all of the input items if input length is equal to the chunk size', () => {
    const chunkSize = 9;
    const chunks = toChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], chunkSize);
    expect(chunks).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9]]);
  });

  test('should return an array with single array containing all of the input items if input length is less than the chunk size', () => {
    const chunkSize = 9;
    const chunks = toChunks([1, 2, 3], chunkSize);
    expect(chunks).toEqual([[1, 2, 3]]);
  });

  test('should return chunks of the correct size when input length is divisible by the chunk size', () => {
    const chunkSize = 3;
    const chunks = toChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], chunkSize);

    for (const chunk of chunks) {
      expect(chunk).toHaveLength(3);
    }
  });

  test('should return chunks containing all values from the input when input length is divisible by the chunk size', () => {
    const chunkSize = 3;
    const chunks = toChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], chunkSize);

    expect(chunks).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  test('should return chunks of the correct size when input length is not divisible by the chunk size', () => {
    const chunkSize = 4;
    const chunks = toChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], chunkSize);

    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(4);
    }
  });

  test('should return chunks containing all values from the input when input length is divisible by the chunk size', () => {
    const chunkSize = 4;
    const chunks = toChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], chunkSize);

    expect(chunks).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9]]);
  });
});
