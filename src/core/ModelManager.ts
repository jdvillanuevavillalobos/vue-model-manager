// src/core/ModelManager.ts - Enterprise Version
import { JsonModel } from './JsonModel'
import type { ModelConfig, ModelData, JsonModelOptions, ModelManagerConfig } from '../types'

export class ModelManager {
  private models = new Map<string, JsonModel>()
  private config: ModelManagerConfig
  
  constructor(scope: string, config: Partial<ModelManagerConfig> = {}) {
    this.config = {
      scope,
      security: { level: 'basic' },
      audit: { enabled: false },
      ...config
    }
    
    if (this.config.audit?.enabled) {
      console.log(`[ModelManager] Created for scope: ${scope} with config:`, this.config)
    }
  }

  create<T extends ModelData>(
    name: string, 
    data: T, 
    options?: JsonModelOptions
  ): JsonModel<T> {
    const modelOptions: JsonModelOptions = {
      enableLogging: this.config.audit?.enabled || false,
      enableValidation: this.config.security?.level !== 'basic',
      ...options
    }
    
    const model = new JsonModel<T>(data, modelOptions)
    this.models.set(name, model)
    
    if (this.config.audit?.enabled) {
      console.log(`[ModelManager] Model '${name}' created in scope '${this.config.scope}'`)
    }
    
    return model
  }

  createShared<T extends ModelData>(
    name: string, 
    data: T, 
    options?: JsonModelOptions
  ): JsonModel<T> {
    const sharedOptions = {
      ...options,
      enableLogging: true,
      enableValidation: true
    }
    return this.create(name, data, sharedOptions)
  }

  createGlobal<T extends ModelData>(
    name: string, 
    data: T, 
    options?: JsonModelOptions
  ): JsonModel<T> {
    const globalOptions = {
      ...options,
      enableLogging: true,
      enableValidation: true
    }
    return this.create(name, data, globalOptions)
  }

  getModel<T extends ModelData>(name: string): JsonModel<T> | undefined {
    return this.models.get(name) as JsonModel<T>
  }

  hasModel(name: string): boolean {
    return this.models.has(name)
  }

  removeModel(name: string): boolean {
    const model = this.models.get(name)
    if (model) {
      model.destroy() // Clean up watchers and events
      this.models.delete(name)
      
      if (this.config.audit?.enabled) {
        console.log(`[ModelManager] Model '${name}' removed from scope '${this.config.scope}'`)
      }
      return true
    }
    return false
  }

  getAllModels(): Record<string, JsonModel> {
    const result: Record<string, JsonModel> = {}
    this.models.forEach((model, name) => {
      result[name] = model
    })
    return result
  }

  getModelNames(): string[] {
    return Array.from(this.models.keys())
  }

  getScope(): string {
    return this.config.scope
  }

  getConfig(): ModelManagerConfig {
    return { ...this.config }
  }

  clear(): void {
    // Properly destroy all models
    this.models.forEach((model, name) => {
      model.destroy()
    })
    this.models.clear()
    
    if (this.config.audit?.enabled) {
      console.log(`[ModelManager] All models cleared from scope '${this.config.scope}'`)
    }
  }

  // Enterprise features
  exportModels(): Record<string, string> {
    const exported: Record<string, string> = {}
    this.models.forEach((model, name) => {
      exported[name] = model.toJSON()
    })
    return exported
  }

  importModels(modelsData: Record<string, string>): void {
    Object.entries(modelsData).forEach(([name, jsonData]) => {
      const model = this.models.get(name)
      if (model) {
        model.fromJSON(jsonData)
      }
    })
  }

  getStatistics() {
    return {
      scope: this.config.scope,
      modelCount: this.models.size,
      modelNames: this.getModelNames(),
      totalSize: Array.from(this.models.values())
        .reduce((size, model) => size + model.getMetadata().size, 0)
    }
  }
}
