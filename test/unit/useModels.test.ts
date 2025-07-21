// test/unit/useModels.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useModels } from '../../src/composables/useModels'
import { ModelManager } from '../../src/core/ModelManager'
import type { ModelData } from '../../src/types'

// Scope y model manager local
const SCOPE = 'test-scope'
let localManager: ModelManager

// ⚠️ Mock explícito de context sin usar __internal
vi.mock('../../src/composables/context', () => {
  return {
    getManagerForScope: (scope?: string) => {
      return scope === SCOPE ? localManager : undefined
    },
    findModelInScopes: (modelName: string) => {
      const model = localManager.getModel(modelName)
      return model ? { model } : null
    }
  }
})

interface Perfil extends ModelData {
  nombre: string
  edad: number
  [key: string]: unknown
}

interface Config extends ModelData {
  darkMode: boolean
  idioma: string
  [key: string]: unknown
}

describe('useModels', () => {
  beforeEach(() => {
    localManager = new ModelManager(SCOPE)
    localManager.clear()
    localManager.create('perfil', { nombre: 'Ana', edad: 25 })
    localManager.create('config', { darkMode: true, idioma: 'es' })
  })

  it('debe retornar los datos de varios modelos', () => {
    const models = useModels(['perfil', 'config'], { scope: SCOPE })

    expect(models.perfil.nombre).toBe('Ana')
    expect(models.config.darkMode).toBe(true)
  })

  it('los cambios deben reflejarse directamente', () => {
    const models = useModels(['perfil'], { scope: SCOPE })

    models.perfil.nombre = 'Luis'
    models.perfil.edad = 33

    expect(models.perfil.nombre).toBe('Luis')
    expect(models.perfil.edad).toBe(33)
  })

  it('retorna undefined para modelos inexistentes', () => {
    const result = useModels(['no-existe'], { scope: SCOPE })

    expect(result['no-existe']).toBeUndefined()
  })
})
