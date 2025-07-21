// test/e2e/complete-workflow.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ModelManager } from '../../src/core/ModelManager'
import { GlobalRegistry } from '../../src/core/GlobalRegistry'
import { getModelFromMicrofrontend, shareModelBetweenMicrofrontends } from '../../src/index'

describe('E2E - Complete Workflow Test', () => {
  const SCOPE_USER = 'mf-users'
  const SCOPE_HEADER = 'mf-header'

  let userManager: ModelManager
  let headerManager: ModelManager

  beforeEach(() => {
    GlobalRegistry.clear()

    userManager = new ModelManager(SCOPE_USER, {
      audit: { enabled: true },
      security: { level: 'enterprise' }
    })

    headerManager = new ModelManager(SCOPE_HEADER, {
      audit: { enabled: true },
      security: { level: 'standard' }
    })

    GlobalRegistry.register(SCOPE_USER, userManager)
    GlobalRegistry.register(SCOPE_HEADER, headerManager)
  })

  it('debe permitir compartir modelo entre microfrontends', () => {
    userManager.create('profile', {
      name: 'Luis',
      role: 'Admin',
      avatar: 'LT'
    })

    const shared = shareModelBetweenMicrofrontends(SCOPE_USER, SCOPE_HEADER, 'profile', 'sharedProfile')
    expect(shared).toBe(true)

    const remote = headerManager.getModel('sharedProfile')
    expect(remote?.getProperty('/name')).toBe('Luis')
    expect(remote?.getProperty('/role')).toBe('Admin')
  })

  it('debe permitir acceso remoto entre microfrontends', () => {
    userManager.create('settings', {
      theme: 'sap_horizon',
      notifications: true
    })

    const remote = getModelFromMicrofrontend(SCOPE_HEADER, SCOPE_USER, 'settings')
    expect(remote).toBeDefined()
    expect(remote?.getProperty('/theme')).toBe('sap_horizon')
  })

  it('debe registrar y limpiar correctamente el estado global', () => {
    userManager.create('token', { jwt: 'abc123' })
    headerManager.create('layout', { menuOpen: true })

    expect(GlobalRegistry.getAllScopes()).toContain(SCOPE_USER)
    expect(GlobalRegistry.getAllScopes()).toContain(SCOPE_HEADER)

    GlobalRegistry.clear()
    expect(GlobalRegistry.getAllScopes()).toHaveLength(0)
  })
})
