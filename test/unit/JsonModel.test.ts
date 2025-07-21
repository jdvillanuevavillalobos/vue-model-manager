// test/unit/JsonModel.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { JsonModel } from '../../src/core/JsonModel'

interface Indexable {
  [key: string]: any
}

interface TestData extends Indexable {
  user: {
    name: string
    age: number
  }
  items: { id: number; value?: string }[]
}

describe('JsonModel', () => {
  let model: JsonModel<TestData>

  beforeEach(() => {
    model = new JsonModel<TestData>({
      user: {
        name: 'John',
        age: 30
      },
      items: []
    })
  })

  it('should get and set simple property', () => {
    expect(model.getProperty('/user/name')).toBe('John')
    model.setProperty('/user/name', 'Alice')
    expect(model.getProperty('/user/name')).toBe('Alice')
  })

  it('should return full data with getData()', () => {
    const data = model.getData()
    expect(data.user.name).toBe('John')
    expect(data.user.age).toBe(30)
  })
 

  it('should update array items with updateArrayItem()', () => {
    model.addToArray('/items', { id: 1, value: 'A' })
    model.updateArrayItem('/items', (item: { id: number; value?: string }) => item.id === 1, { value: 'B' })

    const updated = (model.getProperty('/items') as { id: number; value?: string }[])[0]
    expect(updated.value).toBe('B')
  })

  it('should support validation with addValidator()', () => {
    const m = new JsonModel<{ email: string }>({ email: '' }, { enableValidation: true })
    m.addValidator('/email', {
      validate: (v: unknown) => typeof v === 'string' && v.includes('@'),
      message: 'Debe contener @'
    })

    expect(m.validate()).toBe(false)
    expect(m.getErrors('/email')).toContain('Debe contener @')

    m.setProperty('/email', 'user@example.com')
    expect(m.validate()).toBe(true)
    expect(m.getErrors('/email')).toHaveLength(0)
  })

  it('should serialize and deserialize correctly', () => {
    const json = model.toJSON()
    const newModel = new JsonModel<TestData>({ user: { name: '', age: 0 }, items: [] })
    newModel.fromJSON(json)

    expect(newModel.getProperty('/user/name')).toBe('John')
  })

  it('should clone correctly', () => {
    const clone = model.clone()
    expect(clone.getProperty('/user/name')).toBe('John')

    clone.setProperty('/user/name', 'Clone')
    expect(model.getProperty('/user/name')).toBe('John')
    expect(clone.getProperty('/user/name')).toBe('Clone')
  })

  it('should support metadata retrieval', () => {
    const metadata = model.getMetadata()
    expect(metadata).toHaveProperty('size')
    expect(metadata.size).toBeGreaterThan(0)
  })
})
