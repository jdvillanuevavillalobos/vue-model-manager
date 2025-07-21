// test/e2e/microfrontend.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { GlobalRegistry } from '../../src/core/GlobalRegistry'
import { ModelManager } from '../../src/core/ModelManager'

describe('E2E - Microfrontend Integration', () => {
  const SCOPE_MENU = 'mf-menu'
  const SCOPE_LAYOUT = 'mf-layout'

  let menuManager: ModelManager
  let layoutManager: ModelManager

  beforeEach(() => {
    GlobalRegistry.clear()

    menuManager = new ModelManager(SCOPE_MENU, {
      audit: { enabled: true },
      security: { level: 'standard' }
    })

    layoutManager = new ModelManager(SCOPE_LAYOUT, {
      audit: { enabled: true },
      security: { level: 'basic' }
    })

    GlobalRegistry.register(SCOPE_MENU, menuManager)
    GlobalRegistry.register(SCOPE_LAYOUT, layoutManager)
  })

  it('debe crear y sincronizar modelos entre menu y layout', () => {
    menuManager.create('menuState', {
      expanded: true,
      activeItem: 'dashboard'
    })

    const shared = GlobalRegistry.shareModel(SCOPE_MENU, SCOPE_LAYOUT, 'menuState')
    expect(shared).toBe(true)

    const layoutModel = layoutManager.getModel('menuState')
    expect(layoutModel?.getProperty('/activeItem')).toBe('dashboard')

    // Cambiar en layout y validar sincronización lógica
    layoutModel?.setProperty('/activeItem', 'settings')
    expect(layoutModel?.getProperty('/activeItem')).toBe('settings')
  })

  it('debe permitir inspección de modelos desde otro scope', () => {
    layoutManager.create('theme', {
      current: 'sap_fiori_3',
      darkMode: false
    })

    const inspection = GlobalRegistry.inspectScope(SCOPE_LAYOUT)
    expect(inspection.models).toHaveProperty('theme')
    expect(inspection.models.theme.data.current).toBe('sap_fiori_3')
  })

  it('debe listar correctamente los scopes registrados', () => {
    const scopes = GlobalRegistry.getAllScopes()
    expect(scopes).toContain(SCOPE_MENU)
    expect(scopes).toContain(SCOPE_LAYOUT)
  })
})
