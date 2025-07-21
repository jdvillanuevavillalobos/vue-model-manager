// src/core/GlobalRegistry.ts - Enterprise Version
import { ModelManager } from './ModelManager'
import type { JsonModel } from './JsonModel'

export interface RegistryStatistics {
  totalManagers: number
  totalModels: number
  scopes: string[]
  lastActivity: Date
}

export interface CrossScopeModelAccess {
  sourceScope: string
  targetScope: string
  modelName: string
  accessType: 'read' | 'write'
  timestamp: Date
}

class GlobalRegistryClass {
  private managers = new Map<string, ModelManager>()
  private accessLog: CrossScopeModelAccess[] = []
  private enableAudit = false

  // Basic operations
  register(scope: string, manager: ModelManager): void {
    if (this.managers.has(scope)) {
      console.warn(`[GlobalRegistry] Manager for scope '${scope}' already exists. Replacing...`)
    }
    this.managers.set(scope, manager)
    if (this.enableAudit) {
      console.log(`[GlobalRegistry] Manager registered for scope: ${scope}`)
    }
  }

  get(scope: string): ModelManager | undefined {
    return this.managers.get(scope)
  }

  unregister(scope: string): void {
    const manager = this.managers.get(scope)
    if (manager) {
      manager.clear()
      this.managers.delete(scope)
      if (this.enableAudit) {
        console.log(`[GlobalRegistry] Manager unregistered for scope: ${scope}`)
      }
    }
  }

  hasModel(scope: string, modelName: string): boolean {
    const manager = this.managers.get(scope)
    return manager ? manager.hasModel(modelName) : false
  }

  removeModel(scope: string, modelName: string): boolean {
    const manager = this.managers.get(scope)
    if (!manager) return false
    if (manager.hasModel(modelName)) {
      manager.removeModel(modelName)
      return true
    }
    return false
  }

  getAllScopes(): string[] {
    return Array.from(this.managers.keys())
  }

  clear(): void {
    this.managers.forEach((manager, scope) => {
      manager.clear()
    })
    this.managers.clear()
    this.accessLog = []
    if (this.enableAudit) {
      console.log('[GlobalRegistry] All managers cleared')
    }
  }

  enableAuditing(enabled: boolean = true): void {
    this.enableAudit = enabled
    console.log(`[GlobalRegistry] Auditing ${enabled ? 'enabled' : 'disabled'}`)
  }

  getModelFromScope<T extends Record<string, unknown> = Record<string, unknown>>(
    sourceScope: string,
    targetScope: string,
    modelName: string
  ): JsonModel<T> | undefined {
    const targetManager = this.managers.get(targetScope)
    if (!targetManager) {
      console.warn(`[GlobalRegistry] Target scope '${targetScope}' not found`)
      return undefined
    }
    const model = targetManager.getModel<T>(modelName)
    if (model && this.enableAudit) {
      this.logAccess({
        sourceScope,
        targetScope,
        modelName,
        accessType: 'read',
        timestamp: new Date()
      })
    }
    return model
  }

  getStatistics(): RegistryStatistics {
    const allScopes = this.getAllScopes()
    const totalModels = Array.from(this.managers.values())
      .reduce((count, manager) => count + manager.getModelNames().length, 0)
    return {
      totalManagers: this.managers.size,
      totalModels,
      scopes: allScopes,
      lastActivity: new Date()
    }
  }

  getManagerStatistics(scope?: string): Record<string, any> {
    if (scope) {
      const manager = this.managers.get(scope)
      return manager ? { [scope]: manager.getStatistics() } : {}
    }
    const stats: Record<string, any> = {}
    this.managers.forEach((manager, scopeName) => {
      stats[scopeName] = manager.getStatistics()
    })
    return stats
  }

  broadcastToScope(targetScope: string, event: string, data: any): boolean {
    const manager = this.managers.get(targetScope)
    if (!manager) {
      console.warn(`[GlobalRegistry] Cannot broadcast to scope '${targetScope}' - not found`)
      return false
    }
    if (this.enableAudit) {
      console.log(`[GlobalRegistry] Broadcasting '${event}' to scope '${targetScope}'`, data)
    }
    return true
  }

  shareModel(sourceScope: string, targetScope: string, modelName: string, newName?: string): boolean {
    const sourceManager = this.managers.get(sourceScope)
    const targetManager = this.managers.get(targetScope)
    if (!sourceManager || !targetManager) {
      console.error('[GlobalRegistry] Source or target scope not found for model sharing')
      return false
    }
    const sourceModel = sourceManager.getModel(modelName)
    if (!sourceModel) {
      console.error(`[GlobalRegistry] Model '${modelName}' not found in source scope '${sourceScope}'`)
      return false
    }
    const modelData = JSON.parse(sourceModel.toJSON())
    const sharedName = newName || modelName
    targetManager.create(sharedName, modelData)
    if (this.enableAudit) {
      console.log(`[GlobalRegistry] Model '${modelName}' shared from '${sourceScope}' to '${targetScope}' as '${sharedName}'`)
    }
    return true
  }

  inspectScope(scope: string): any {
    const manager = this.managers.get(scope)
    if (!manager) {
      return { error: `Scope '${scope}' not found` }
    }
    const models = manager.getAllModels()
    const inspection: any = {
      scope,
      config: manager.getConfig(),
      statistics: manager.getStatistics(),
      models: {}
    }
    Object.entries(models).forEach(([name, model]) => {
      inspection.models[name] = {
        metadata: model.getMetadata(),
        data: model.getData()
      }
    })
    return inspection
  }

  getAccessLog(): CrossScopeModelAccess[] {
    return [...this.accessLog]
  }

  private logAccess(access: CrossScopeModelAccess): void {
    this.accessLog.push(access)
    if (this.accessLog.length > 1000) {
      this.accessLog = this.accessLog.slice(-1000)
    }
  }

  dumpState(): void {
    console.group('[GlobalRegistry] Current State')
    console.log('Statistics:', this.getStatistics())
    console.log('Manager Statistics:', this.getManagerStatistics())
    this.getAllScopes().forEach(scope => {
      console.group(`Scope: ${scope}`)
      console.log(this.inspectScope(scope))
      console.groupEnd()
    })
    if (this.accessLog.length > 0) {
      console.log('Recent Access Log:', this.accessLog.slice(-10))
    }
    console.groupEnd()
  }
}

export const GlobalRegistry = new GlobalRegistryClass()
