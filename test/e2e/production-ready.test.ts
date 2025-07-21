// test/e2e/production-ready.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ModelManager } from '../../src/core/ModelManager'
import { GlobalRegistry } from '../../src/core/GlobalRegistry'

describe('E2E - Production-Ready Behaviors', () => {
  const SCOPE = 'prod-scope'
  let manager: ModelManager

  beforeEach(() => {
    GlobalRegistry.clear()
    manager = new ModelManager(SCOPE, {
      audit: { enabled: true },
      security: { level: 'enterprise' }
    })
    GlobalRegistry.register(SCOPE, manager)
  })

  it('debe validar propiedades críticas en modo enterprise', () => {
    const model = manager.create('account', {
      name: 'Empresa S.A.',
      ruc: '20123456789',
      email: ''
    })

    model.addValidator('/email', {
      validate: (value) => typeof value === 'string' && value.includes('@'),
      message: 'Correo electrónico inválido'
    })

    expect(model.validate('/email')).toBe(false)
    expect(model.getErrors('/email')).toContain('Correo electrónico inválido')

    model.setProperty('/email', 'contacto@empresa.com')
    expect(model.validate('/email')).toBe(true)
  })

  it('debe limpiar recursos después de eliminar un modelo', () => {
    manager.create('temp', { used: true })
    const removed = manager.removeModel('temp')

    expect(removed).toBe(true)
    expect(manager.hasModel('temp')).toBe(false)
  })

  it('debe permitir exportar e importar modelos en producción', () => {
    const original = manager.create('settings', {
      lang: 'es',
      theme: 'sap_horizon'
    })

    const exported = manager.exportModels()
    expect(exported).toHaveProperty('settings')

    // simular importar en otro manager
    const another = new ModelManager('temp-scope')
    GlobalRegistry.register('temp-scope', another)
    another.create('settings', { lang: '', theme: '' })
    another.importModels(exported)

    const imported = another.getModel('settings')
    expect(imported?.getProperty('/lang')).toBe('es')
    expect(imported?.getProperty('/theme')).toBe('sap_horizon')
  })

  it('debe retornar estadísticas completas en producción', () => {
    manager.create('session', {
      jwt: 'secure-token',
      createdAt: new Date().toISOString()
    })

    const stats = manager.getStatistics()
    expect(stats.modelCount).toBeGreaterThan(0)
    expect(stats.modelNames).toContain('session')
    expect(stats.totalSize).toBeGreaterThan(0)
  })
})
