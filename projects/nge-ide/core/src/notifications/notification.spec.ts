import { ErrorNotification } from './notification'

export const testErrorNotification: () => ErrorNotification = () => new ErrorNotification('test')

describe('ErrorNotification', () => {
  it('should be created', () => {
    expect(testErrorNotification()).toBeTruthy()
  })

  it('should be created with all constructor fields', () => {
    expect(new ErrorNotification(`TADA !`, 'warn', 'trace')).toBeTruthy()
  })
})
