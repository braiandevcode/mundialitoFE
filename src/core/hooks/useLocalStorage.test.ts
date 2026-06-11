import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    act(() => {
      result.current[1]('new-value')
    })
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe('"new-value"')
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })
    expect(result.current[0]).toBe(1)
  })

  it('handles complex objects', () => {
    const initial = { name: 'test', count: 0 }
    const { result } = renderHook(() => useLocalStorage('obj', initial))
    act(() => {
      result.current[1]({ name: 'updated', count: 1 })
    })
    expect(result.current[0]).toEqual({ name: 'updated', count: 1 })
  })

  it('falls back to initial value on corrupt data', () => {
    localStorage.setItem('corrupt', '{bad json')
    const { result } = renderHook(() => useLocalStorage('corrupt', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
