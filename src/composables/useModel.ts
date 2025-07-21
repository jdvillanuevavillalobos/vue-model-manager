import { computed } from 'vue'
import type { WritableComputedRef } from 'vue'  // ✅ CORREGIDO: Importar WritableComputedRef
import type { ModelPath } from '../types'
import { getManagerForScope, findModelInScopes } from './context'

export interface UseModelOptions {
  scope?: string
  fallbackSearch?: boolean
  defaultValue?: any
}

export function useModel<T = any>(
  modelName: string, 
  path: ModelPath, 
  options: UseModelOptions = {}
): WritableComputedRef<T | undefined> {  // ✅ CORREGIDO: WritableComputedRef
  const { scope, fallbackSearch = true, defaultValue } = options
  
  return computed({
    get(): T | undefined {
      // Estrategia 1: Manager específico para scope
      if (scope) {
        const manager = getManagerForScope(scope)
        const model = manager?.getModel(modelName)
        if (model) {
          const value = model.getProperty(path)
          return value !== undefined ? value as T : defaultValue
        }
      }
      
      // Estrategia 2: Búsqueda inteligente
      if (fallbackSearch) {
        const result = findModelInScopes(modelName, scope)
        if (result) {
          const value = result.model.getProperty(path)
          return value !== undefined ? value as T : defaultValue
        }
      }
      
      // Estrategia 3: Manager del contexto actual
      const manager = getManagerForScope()
      const model = manager?.getModel(modelName)
      if (model) {
        const value = model.getProperty(path)
        return value !== undefined ? value as T : defaultValue
      }
      
      return defaultValue
    },
    
    set(value: T | undefined): void {
      if (value === undefined) return
      
      // Misma estrategia para escritura
      if (scope) {
        const manager = getManagerForScope(scope)
        const model = manager?.getModel(modelName)
        if (model) {
          model.setProperty(path, value)
          return
        }
      }
      
      if (fallbackSearch) {
        const result = findModelInScopes(modelName, scope)
        if (result) {
          result.model.setProperty(path, value)
          return
        }
      }
      
      const manager = getManagerForScope()
      const model = manager?.getModel(modelName)
      if (model) {
        model.setProperty(path, value)
        return
      }
      
      console.warn(`[useModel] No se pudo encontrar el modelo '${modelName}' para actualizar '${path}'`)
    }
  })
}

// Versiones de conveniencia
export function useModelFromScope<T = any>(
  scope: string,
  modelName: string, 
  path: ModelPath
): WritableComputedRef<T | undefined> {  // ✅ CORREGIDO: WritableComputedRef
  return useModel<T>(modelName, path, { scope, fallbackSearch: false })
}

export function useModelWithDefault<T = any>(
  modelName: string, 
  path: ModelPath, 
  defaultValue: T
): WritableComputedRef<T> {  // ✅ CORREGIDO: WritableComputedRef
  return useModel<T>(modelName, path, { defaultValue }) as WritableComputedRef<T>
}