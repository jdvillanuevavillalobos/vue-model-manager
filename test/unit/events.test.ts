// test/unit/events.test.ts
import { describe, it, expect, vi } from 'vitest'
import { JsonModel } from '../../src/core/JsonModel'

describe('JsonModel - Event System', () => {
  it('should emit property-changed event on setProperty()', () => {
    const model = new JsonModel({ count: 0 })

    const spy = vi.fn()
    model.on('property-changed', spy)

    model.setProperty('/count', 5)

    expect(spy).toHaveBeenCalledTimes(1)

    const event = spy.mock.calls[0][0] as {
      path: string
      oldValue: number
      newValue: number
    }

    expect(event.path).toBe('/count')
    expect(event.oldValue).toBe(0)
    expect(event.newValue).toBe(5)
  })

  it('should emit array-changed event on addToArray()', () => {
    const model = new JsonModel({ items: [] })

    const spy = vi.fn()
    model.on('array-changed', spy)

    model.addToArray('/items', { id: 1, name: 'Item 1' })

    expect(spy).toHaveBeenCalledTimes(1)

    const event = spy.mock.calls[0][0] as {
      path: string
      action: string
      index: number
      item: { id: number; name: string }
    }

    expect(event.path).toBe('/items')
    expect(event.action).toBe('add')
    expect(event.index).toBe(0)
    expect(event.item).toEqual({ id: 1, name: 'Item 1' })
  })

  it('should emit validation-error on failed validation', () => {
    const model = new JsonModel({ age: 0 }, { enableValidation: true })

    const spy = vi.fn()
    model.on('validation-error', spy)

    model.addValidator('/age', {
      validate: (value: unknown) => typeof value === 'number' && value >= 18,
      message: 'Edad mínima 18'
    })

    const isValid = model.validate()

    expect(isValid).toBe(false)

    const event = spy.mock.calls[0][0] as {
      path: string
      errors: string[]
    }

    expect(event.path).toBe('/age')
    expect(event.errors).toContain('Edad mínima 18')
  })
})
