// test/unit/GlobalRegistry.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { GlobalRegistry } from '../../src/core/GlobalRegistry'
import { ModelManager } from '../../src/core/ModelManager'
import type { ModelData } from '../../src/types'

interface TestModel extends ModelData {
  prop: string
  [key: string]: unknown
}

const SCOPE_A = 'scope-a'
const SCOPE_B = 'scope-b'

describe('GlobalRegistry', () => {
  beforeEach(() => {
    GlobalRegistry.clear()
  })

  it('debe registrar y obtener un manager', () => {
    const manager = new ModelManager(SCOPE_A)
    GlobalRegistry.register(SCOPE_A, manager)

    const retrieved = GlobalRegistry.get(SCOPE_A)
    expect(retrieved).toBe(manager)
  })

  it('debe crear y compartir modelo entre scopes', () => {
    const managerA = new ModelManager(SCOPE_A)
    const managerB = new ModelManager(SCOPE_B)

    GlobalRegistry.register(SCOPE_A, managerA)
    GlobalRegistry.register(SCOPE_B, managerB)

    managerA.create<TestModel>('model1', { prop: 'value' })
    const result = GlobalRegistry.shareModel(SCOPE_A, SCOPE_B, 'model1')

    expect(result).toBe(true)
    const modelB = managerB.getModel<TestModel>('model1')
    expect(modelB?.getProperty('/prop')).toBe('value')
  })

  it('debe auditar acceso entre scopes si está habilitado', () => {
    GlobalRegistry.enableAuditing(true)

    const managerA = new ModelManager(SCOPE_A)
    const managerB = new ModelManager(SCOPE_B)

    GlobalRegistry.register(SCOPE_A, managerA)
    GlobalRegistry.register(SCOPE_B, managerB)

    managerB.create<TestModel>('model1', { prop: 'audit' })
    const model = GlobalRegistry.getModelFromScope(SCOPE_A, SCOPE_B, 'model1')

    expect(model?.getProperty('/prop')).toBe('audit')
    const log = GlobalRegistry.getAccessLog()
    expect(log.length).toBeGreaterThan(0)
    expect(log[0].sourceScope).toBe(SCOPE_A)
    expect(log[0].targetScope).toBe(SCOPE_B)
  })

  it('debe retornar estadísticas globales', () => {
    const manager = new ModelManager(SCOPE_A)
    GlobalRegistry.register(SCOPE_A, manager)
    manager.create('model', { x: 1 })

    const stats = GlobalRegistry.getStatistics()
    expect(stats.totalManagers).toBe(1)
    expect(stats.totalModels).toBe(1)
    expect(stats.scopes).toContain(SCOPE_A)
  })

  it('debe limpiar todos los managers correctamente', () => {
    GlobalRegistry.register(SCOPE_A, new ModelManager(SCOPE_A))
    GlobalRegistry.register(SCOPE_B, new ModelManager(SCOPE_B))

    GlobalRegistry.clear()
    expect(GlobalRegistry.get(SCOPE_A)).toBeUndefined()
    expect(GlobalRegistry.get(SCOPE_B)).toBeUndefined()
  })
})
