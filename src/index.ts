// src/index.ts - Enterprise Entry Point
export { JsonModel } from './core/JsonModel'
export { ModelManager } from './core/ModelManager'
export { GlobalRegistry } from './core/GlobalRegistry'
export type { RegistryStatistics, CrossScopeModelAccess } from './core/GlobalRegistry'

// ✅ CORREGIDO: Export ALL composables and context functions
export { 
  useModel, 
  useModels,
  useModelFromScope,
  useModelWithDefault,
  useModelsFromScope,
  useModelsShallow,
  useModelsRaw,
  setComposableScope,
  configureComposables,
  getComposableContext
} from './composables'

// ✅ CORREGIDO: Export types from composables  
export type { UseModelOptions, UseModelsOptions } from './composables'

// Export all types
export * from './types'

// Helper functions
import { ModelManager } from './core/ModelManager'
import { GlobalRegistry } from './core/GlobalRegistry'
import type { ModelManagerConfig, JsonModelOptions } from './types'

/**
 * Creates and registers a new ModelManager
 */
export function createModelManager(
  scope: string, 
  config?: Partial<ModelManagerConfig>
): ModelManager {
  const manager = new ModelManager(scope, config)
  
  // Register globally for cross-scope access
  GlobalRegistry.register(scope, manager)
  
  return manager
}

/**
 * Development helper - enables global auditing
 */
export function enableGlobalAuditing(): void {
  GlobalRegistry.enableAuditing(true)
}

/**
 * Development helper - dumps complete registry state
 */
export function dumpGlobalState(): void {
  GlobalRegistry.dumpState()
}

/**
 * Get statistics for all registered managers
 */
export function getGlobalStatistics() {
  return {
    registry: GlobalRegistry.getStatistics(),
    managers: GlobalRegistry.getManagerStatistics()
  }
}

/**
 * Cross-microfrontend model access
 */
export function getModelFromMicrofrontend<T extends Record<string, unknown> = Record<string, unknown>>(
  sourceScope: string,
  targetScope: string, 
  modelName: string
) {
  return GlobalRegistry.getModelFromScope<T>(sourceScope, targetScope, modelName)
}

/**
 * Share a model between microfrontends
 */
export function shareModelBetweenMicrofrontends(
  sourceScope: string,
  targetScope: string,
  modelName: string,
  newName?: string
): boolean {
  return GlobalRegistry.shareModel(sourceScope, targetScope, modelName, newName)
}