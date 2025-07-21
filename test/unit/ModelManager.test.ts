// test/unit/ModelManager.test.ts
import { ModelManager } from '../../src/core/ModelManager'
import { describe, expect, it, beforeEach } from 'vitest'
import type { ModelData } from '../../src/types'

interface Usuario extends ModelData {
  nombre: string
  email: string
  [key: string]: unknown
}

describe('ModelManager', () => {
  let manager: ModelManager

  beforeEach(() => {
    manager = new ModelManager('test-scope', {
      audit: { enabled: true },
      security: { level: 'enterprise' }
    })
  })

  it('debe crear un modelo correctamente', () => {
    const model = manager.create<Usuario>('usuario', {
      nombre: 'Juan',
      email: 'juan@correo.com'
    })

    expect(manager.hasModel('usuario')).toBe(true)
    expect(model.getProperty('/nombre')).toBe('Juan')
  })

  it('debe obtener un modelo existente', () => {
    manager.create<Usuario>('usuario', {
      nombre: 'Ana',
      email: 'ana@correo.com'
    })
    const model = manager.getModel<Usuario>('usuario')

    expect(model).toBeDefined()
    expect(model?.getProperty('/email')).toBe('ana@correo.com')
  })

  it('debe eliminar un modelo existente', () => {
    manager.create<Usuario>('usuario', {
      nombre: 'Luis',
      email: 'luis@correo.com'
    })

    const removed = manager.removeModel('usuario')
    expect(removed).toBe(true)
    expect(manager.hasModel('usuario')).toBe(false)
  })

  it('debe exportar modelos a JSON', () => {
    manager.create<Usuario>('usuario', {
      nombre: 'Carlos',
      email: 'carlos@correo.com'
    })
    const exported = manager.exportModels()

    expect(exported).toHaveProperty('usuario')
    expect(typeof exported.usuario).toBe('string')
  })

  it('debe importar datos a un modelo existente', () => {
    const model = manager.create<Usuario>('usuario', {
      nombre: '',
      email: ''
    })
    manager.importModels({
      usuario: JSON.stringify({ nombre: 'Eva', email: 'eva@correo.com' })
    })

    expect(model.getProperty('/nombre')).toBe('Eva')
  })

  it('debe retornar las estadísticas correctas', () => {
    manager.create<ModelData>('a', { a: 1 })
    manager.create<ModelData>('b', { b: 2 })

    const stats = manager.getStatistics()

    expect(stats.scope).toBe('test-scope')
    expect(stats.modelCount).toBe(2)
    expect(stats.modelNames).toContain('a')
    expect(typeof stats.totalSize).toBe('number')
  })

  it('debe limpiar todos los modelos', () => {
    manager.create<ModelData>('usuario', { nombre: 'Ana' })
    manager.create<ModelData>('config', { darkMode: true })

    manager.clear()

    expect(manager.getModelNames()).toHaveLength(0)
  })

  it('debe crear modelo compartido con validaciones forzadas', () => {
    const model = manager.createShared<ModelData>('perfil', { role: 'admin' })

    expect(model.getProperty('/role')).toBe('admin')
  })

  it('debe crear modelo global con validaciones forzadas', () => {
    const model = manager.createGlobal<ModelData>('settings', { idioma: 'es' })

    expect(model.getProperty('/idioma')).toBe('es')
  })
})
