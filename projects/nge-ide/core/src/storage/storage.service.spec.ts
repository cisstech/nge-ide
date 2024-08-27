import { inject, TestBed } from '@angular/core/testing'
import { lastValueFrom } from 'rxjs'
import { StorageService } from './storage.service'

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [StorageService],
    })
  })

  it('should be created', inject([StorageService], async (service: StorageService) => {
    expect(service).toBeTruthy()
    await lastValueFrom(service.clear())
  }))

  it('should set and get string', inject([StorageService], async (service: StorageService) => {
    const key = 'strKey'
    const value = 'strValue'
    await lastValueFrom(service.remove(key))
    await lastValueFrom(service.set(key, value))
    expect(await lastValueFrom(service.getString(key))).toBe(value)
    await lastValueFrom(service.remove(key))
    expect(await lastValueFrom(service.getString(key))).toBeUndefined()
    expect(await lastValueFrom(service.getString(key, 'val'))).toBe('val')
  }))

  it('should set and get boolean', inject([StorageService], async (service: StorageService) => {
    const key = 'boolKey'
    const value = false
    await lastValueFrom(service.remove(key))
    await lastValueFrom(service.set(key, value))
    expect(await lastValueFrom(service.getBoolean(key))).toBe(value)
  }))

  it('should set and get number', inject([StorageService], async (service: StorageService) => {
    const key = 'numberKey'
    const value = 42
    await lastValueFrom(service.remove(key))
    await lastValueFrom(service.set(key, value))
    expect(await lastValueFrom(service.getNumber(key))).toBe(value)
  }))

  it('should set and get item', inject([StorageService], async (service: StorageService) => {
    const key = 'strKey'
    const value = { value: 'strValue' }
    await lastValueFrom(service.remove(key))
    await lastValueFrom(service.set(key, value))
    expect(await lastValueFrom(service.get(key))).toEqual(value)
    await lastValueFrom(service.remove(key))
    expect(await lastValueFrom(service.get(key))).toBeUndefined()
    expect(await lastValueFrom(service.get(key, { value: 'default' }))).toEqual({ value: 'default' })
  }))
})
