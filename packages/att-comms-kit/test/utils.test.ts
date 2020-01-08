import * as Utils from '../src/utils'

test('Utils.isNotEmptyString', () => {
  expect(Utils.isNotEmptyString('')).toBeFalsy()
  expect(Utils.isNotEmptyString('a')).toBeTruthy()
})

test('Utils.isArrayOfNonEmptyStrings', () => {
  expect(Utils.isArrayOfNonEmptyStrings([''])).toBeFalsy()
  expect(Utils.isArrayOfNonEmptyStrings(['a'])).toBeTruthy()
  expect(Utils.isArrayOfNonEmptyStrings(['a', ''])).toBeFalsy()
})
