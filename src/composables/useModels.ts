import { reactive } from 'vue'
import { getManagerForScope, findModelInScopes } from './context'

export interface UseModelsOptions {
  scope?: string
  fallbackSearch?: boolean
  deep?: boolean // Para proxy anidado
}

// Cache local por modelo y path para evitar recreación innecesaria
const proxyCache = new Map<string, any>()

// Crear proxy anidado recursivo
function createDeepProxy(
  modelName: string, 
  basePath: string = '', 
  options: UseModelsOptions = {}
): any {
  const { scope, fallbackSearch = true } = options
  const cacheKey = `${modelName}:${basePath}`

  if (proxyCache.has(cacheKey)) {
    return proxyCache.get(cacheKey)
  }

  const proxy = new Proxy({}, {
    get(target, prop: string | symbol) {
      if (prop === Symbol.toStringTag) return 'ZeusModelProxy'
      if (prop === Symbol.toPrimitive) return () => '[ZeusModelProxy]'
      if (typeof prop === 'symbol') return undefined

      const propString = String(prop)
      const fullPath = basePath ? `${basePath}/${propString}` : `/${propString}`

      let model: any
      if (scope) {
        const manager = getManagerForScope(scope)
        model = manager?.getModel(modelName)
      } else if (fallbackSearch) {
        const result = findModelInScopes(modelName, scope)
        model = result?.model
      } else {
        const manager = getManagerForScope()
        model = manager?.getModel(modelName)
      }

      if (!model) return undefined

      const value = model.getProperty(fullPath)

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedProxy = createDeepProxy(modelName, fullPath, options)
        proxyCache.set(`${modelName}:${fullPath}`, nestedProxy)
        return nestedProxy
      }

      return value
    },

    set(target, prop: string | symbol, value) {
      if (typeof prop === 'symbol') return false

      const propString = String(prop)
      const fullPath = basePath ? `${basePath}/${propString}` : `/${propString}`

      let model: any
      if (scope) {
        const manager = getManagerForScope(scope)
        model = manager?.getModel(modelName)
      } else if (fallbackSearch) {
        const result = findModelInScopes(modelName, scope)
        model = result?.model
      } else {
        const manager = getManagerForScope()
        model = manager?.getModel(modelName)
      }

      if (!model) {
        console.warn(`[useModels] No se pudo encontrar el modelo '${modelName}' para actualizar '${fullPath}'`)
        return false
      }

      model.setProperty(fullPath, value)
      return true
    },

    has(target, prop: string | symbol) {
      if (typeof prop === 'symbol') return false

      const propString = String(prop)
      const fullPath = basePath ? `${basePath}/${propString}` : `/${propString}`

      let model: any
      if (scope) {
        const manager = getManagerForScope(scope)
        model = manager?.getModel(modelName)
      } else {
        const result = findModelInScopes(modelName, scope)
        model = result?.model
      }

      return model ? model.hasProperty(fullPath) : false
    }
  })

  proxyCache.set(cacheKey, proxy)
  return proxy
}

// 🧩 Principal con reactive
export function useModels(
  modelNames: string[], 
  options: UseModelsOptions = {}
): Record<string, any> {
  const result: Record<string, any> = {}

  modelNames.forEach(modelName => {
    result[modelName] = reactive(createDeepProxy(modelName, '', options))
  })

  return result
}

// 🧩 Versión sin reactive (solo lectura / sin tracking)
export function useModelsRaw(
  modelNames: string[], 
  options: UseModelsOptions = {}
): Record<string, any> {
  const result: Record<string, any> = {}

  modelNames.forEach(modelName => {
    result[modelName] = createDeepProxy(modelName, '', options)
  })

  return result
}

// 🧩 Versiones convenientes
export function useModelsFromScope(
  scope: string,
  modelNames: string[]
): Record<string, any> {
  return useModels(modelNames, { scope, fallbackSearch: false })
}

export function useModelsShallow(
  modelNames: string[]
): Record<string, any> {
  return useModels(modelNames, { deep: false })
}
