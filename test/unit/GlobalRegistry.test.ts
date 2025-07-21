// test/unit/GlobalRegistry.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GlobalRegistry } from '../../src/core/GlobalRegistry'
import { ModelManager } from '../../src/core/ModelManager'

describe('GlobalRegistry', () => {
  beforeEach(() => {
    GlobalRegistry.clear()
    GlobalRegistry.enableAuditing(false)
  })

  it('should register and retrieve a ModelManager', () => {
    const manager = new ModelManager('test-scope')
    GlobalRegistry.register('test-scope', manager)

    const retrieved = GlobalRegistry.get('test-scope')
    expect(retrieved).toBe(manager)
  })

  it('should unregister a manager and clear its models', () => {
    const manager = new ModelManager('scope-A')
    manager.create('user', { name: 'John' })
    GlobalRegistry.register('scope-A', manager)

    expect(GlobalRegistry.get('scope-A')).toBeDefined()

    GlobalRegistry.unregister('scope-A')
    expect(GlobalRegistry.get('scope-A')).toBeUndefined()
  })

  it('should share model between scopes', () => {
    const headerManager = new ModelManager('header')
    const usersManager = new ModelManager('users')

    headerManager.create('theme', { color: 'blue' })

    GlobalRegistry.register('header', headerManager)
    GlobalRegistry.register('users', usersManager)

    const success = GlobalRegistry.shareModel('header', 'users', 'theme')
    expect(success).toBe(true)

    const shared = usersManager.getModel<{ color: string }>('theme')
    expect(shared?.getProperty('/color')).toBe('blue')
  })

  it('should get model from another scope', () => {
    const source = new ModelManager('source')
    source.create('profile', { username: 'admin' })

    const target = new ModelManager('target')

    GlobalRegistry.register('source', source)
    GlobalRegistry.register('target', target)

    const profile = GlobalRegistry.getModelFromScope('target', 'source', 'profile')
    expect(profile?.getProperty('/username')).toBe('admin')
  })

  it('should return statistics', () => {
    const m1 = new ModelManager('a')
    const m2 = new ModelManager('b')
    m1.create('m1', { a: 1 })
    m2.create('m2', { b: 2 })

    GlobalRegistry.register('a', m1)
    GlobalRegistry.register('b', m2)

    const stats = GlobalRegistry.getStatistics()
    expect(stats.totalManagers).toBe(2)
    expect(stats.totalModels).toBe(2)
    expect(stats.scopes).toContain('a')
    expect(stats.scopes).toContain('b')
  })

  it('should dump state without errors', () => {
    const manager = new ModelManager('scope-debug')
    manager.create('test', { foo: 'bar' })

    GlobalRegistry.register('scope-debug', manager)

    expect(() => {
      GlobalRegistry.dumpState()
    }).not.toThrow()
  })

  it('should enable auditing and log access', () => {
    const manager = new ModelManager('audit-scope')
    manager.create('session', { token: 'abc123' })

    GlobalRegistry.register('audit-scope', manager)
    GlobalRegistry.enableAuditing(true)

    const model = GlobalRegistry.getModelFromScope('any', 'audit-scope', 'session')
    expect(model?.getProperty('/token')).toBe('abc123')

    const logs = GlobalRegistry.getAccessLog()
    expect(logs.length).toBeGreaterThan(0)
    expect(logs[0]).toMatchObject({
      sourceScope: 'any',
      targetScope: 'audit-scope',
      modelName: 'session',
      accessType: 'read'
    })
  })
})
