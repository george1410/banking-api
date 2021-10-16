import stripInternalAttributes from './stripInternalAttributes';

const testEntity = {
  PK: 'somePK',
  SK: 'someSK',
  GSI1PK: 'someGSI1PK',
  GSI1SK: 'someGSI1SK',
  name: 'George',
  age: 99,
};

describe('Strip internal attributes', () => {
  test('should remove the PK property', () => {
    expect(stripInternalAttributes(testEntity)).not.toHaveProperty('PK');
  });

  test('should remove the SK property', () => {
    expect(stripInternalAttributes(testEntity)).not.toHaveProperty('SK');
  });

  test('should remove the GSI1PK property', () => {
    expect(stripInternalAttributes(testEntity)).not.toHaveProperty('GSI1PK');
  });

  test('should remove the GSI1SK property', () => {
    expect(stripInternalAttributes(testEntity)).not.toHaveProperty('GSI1SK');
  });

  test('should retain all additional properties', () => {
    expect(stripInternalAttributes(testEntity)).toEqual({
      name: 'George',
      age: 99,
    });
  });

  test('should ignore any internal attributes not present on the entity', () => {
    const alreadyClean = {
      name: 'Bob',
      age: 50,
    };
    expect(stripInternalAttributes(alreadyClean)).toEqual(alreadyClean);
  });
});
