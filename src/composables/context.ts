import { GlobalRegistry } from '../core/GlobalRegistry'
import type { ModelManager } from '../core/ModelManager'

interface ComposableContext {
  currentScope?: string
  fallbackToGlobalSearch: boolean
}

let context: ComposableContext = {
  fallbackToGlobalSearch: true
}

/**
 * Establece el contexto de scope actual para composables
 * Típicamente llamado una vez por microfrontend
 */
export function setComposableScope(scope: string): void {
  context.currentScope = scope
}

/**
 * Obtiene el manager para un scope específico o el actual
 */
export function getManagerForScope(scope?: string): ModelManager | undefined {
  // 1. Scope específico tiene prioridad
  if (scope) {
    return GlobalRegistry.get(scope)
  }
  
  // 2. Usar scope del contexto actual
  if (context.currentScope) {
    return GlobalRegistry.get(context.currentScope)
  }
  
  // 3. Fallback: buscar el primer manager disponible
  if (context.fallbackToGlobalSearch) {
    const scopes = GlobalRegistry.getAllScopes()
    if (scopes.length > 0) {
      return GlobalRegistry.get(scopes[0])
    }
  }
  
  return undefined
}

/**
 * Busca un modelo en múltiples scopes
 */
export function findModelInScopes(modelName: string, preferredScope?: string): {
  model: any
  scope: string
} | undefined {
  // 1. Intentar scope preferido
  if (preferredScope) {
    const manager = GlobalRegistry.get(preferredScope)
    const model = manager?.getModel(modelName)
    if (model) {
      return { model, scope: preferredScope }
    }
  }
  
  // 2. Intentar scope actual
  if (context.currentScope) {
    const manager = GlobalRegistry.get(context.currentScope)
    const model = manager?.getModel(modelName)
    if (model) {
      return { model, scope: context.currentScope }
    }
  }
  
  // 3. Buscar en todos los scopes
  if (context.fallbackToGlobalSearch) {
    for (const scope of GlobalRegistry.getAllScopes()) {
      const manager = GlobalRegistry.get(scope)
      const model = manager?.getModel(modelName)
      if (model) {
        return { model, scope }
      }
    }
  }
  
  return undefined
}

/**
 * Configuración global de comportamiento
 */
export function configureComposables(config: Partial<ComposableContext>): void {
  context = { ...context, ...config }
}

/**
 * Para debugging - obtener contexto actual
 */
export function getComposableContext(): ComposableContext {
  return { ...context }
}