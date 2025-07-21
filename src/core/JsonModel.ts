// src/core/JsonModel.ts - Enterprise Implementation
import { reactive, computed, watch, type ComputedRef, type WatchStopHandle } from 'vue'
import type { 
  ModelPath, 
  ModelData, 
  JsonModelOptions, 
  IJsonModel, 
  ModelChangeEvent,
  JsonModelEvents,
  ValidationRule,
  ModelValidator,
  ModelMetadata,
  ModelWatchOptions,
  JsonModelBinding
} from '../types'

type Indexable = Record<string, unknown>

export class JsonModel<T extends Indexable = Indexable> implements IJsonModel<T> {
  private data: T
  private options: JsonModelOptions
  private validators: Record<ModelPath, ValidationRule[]> = {}
  private watchers: WatchStopHandle[] = []
  private eventListeners: Partial<Record<keyof JsonModelEvents, Function[]>> = {}
  private metadata: ModelMetadata
  private changeCount = 0

  constructor(initialData: T, options: JsonModelOptions = {}) {
    this.options = {
      enableLogging: false,
      enableValidation: false,
      immutable: false,
      pathSeparator: '/',
      ...options
    }
    
    this.data = reactive(initialData) as T
    
    // Initialize metadata
    this.metadata = {
      version: '1.0.0',
      created: new Date(),
      lastModified: new Date(),
      changeCount: 0,
      paths: this.getAllPaths(this.data),
      size: JSON.stringify(this.data).length
    }

    if (this.options.enableLogging) {
      console.log('[JsonModel] Created with options:', this.options)
    }
  }

  // ===== BASIC METHODS =====

  getData(): T {
    return this.data
  }

  getProperty(path: ModelPath): unknown {
    const segments = path.replace(/^\//, '').split(this.options.pathSeparator || '/')
    return segments.reduce<unknown>((obj, key) => {
      if (obj && typeof obj === 'object' && key in obj) {
        return (obj as Indexable)[key]
      }
      return undefined
    }, this.data)
  }

  setProperty(path: ModelPath, value: unknown): void {
    const oldValue = this.getProperty(path)
    
    // Validation
    if (this.options.enableValidation) {
      const errors = this.validatePath(path, value)
      if (errors.length > 0) {
        this.emit('validation-error', { path, errors })
        return
      }
    }

    // Set value
    const segments = path.replace(/^\//, '').split(this.options.pathSeparator || '/')
    const last = segments.pop()
    const target = segments.reduce<unknown>((obj, key) => {
      if (obj && typeof obj === 'object' && key in obj) {
        return (obj as Indexable)[key]
      }
      return undefined
    }, this.data)

    if (target && typeof target === 'object' && last) {
      ;(target as Indexable)[last] = value
      
      // Update metadata
      this.updateMetadata()
      
      // Emit change event
      this.emit('property-changed', {
        path,
        oldValue,
        newValue: value,
        timestamp: Date.now(),
        source: 'user'
      })

      if (this.options.enableLogging) {
        console.log(`[JsonModel] Property changed: ${path}`, { oldValue, newValue: value })
      }
    }
  }

  // ===== ADVANCED METHODS =====

  updateProperties(updates: Record<ModelPath, unknown>): void {
    Object.entries(updates).forEach(([path, value]) => {
      this.setProperty(path, value)
    })
  }

  createBinding<R = unknown>(path: ModelPath): ComputedRef<R> {
    return computed(() => this.getProperty(path) as R)
  }

  // ===== ARRAY OPERATIONS =====

  addToArray(path: ModelPath, item: unknown): void {
    const array = this.getProperty(path)
    if (Array.isArray(array)) {
      array.push(item)
      this.updateMetadata()
      this.emit('array-changed', {
        path,
        action: 'add',
        index: array.length - 1,
        item
      })
    }
  }

  removeFromArray(path: ModelPath, index: number): void {
    const array = this.getProperty(path)
    if (Array.isArray(array) && index >= 0 && index < array.length) {
      const item = array[index]
      array.splice(index, 1)
      this.updateMetadata()
      this.emit('array-changed', {
        path,
        action: 'remove',
        index,
        item
      })
    }
  }

  updateArrayItem(
    path: ModelPath, 
    predicate: (item: any, index: number) => boolean, 
    updates: Record<string, unknown>
  ): boolean {
    const array = this.getProperty(path)
    if (Array.isArray(array)) {
      const index = array.findIndex(predicate)
      if (index !== -1) {
        Object.assign(array[index], updates)
        this.updateMetadata()
        this.emit('array-changed', {
          path,
          action: 'update',
          index,
          item: array[index]
        })
        return true
      }
    }
    return false
  }

  // ===== UTILITIES =====

  getArrayLength(path: ModelPath): number {
    const array = this.getProperty(path)
    return Array.isArray(array) ? array.length : 0
  }

  hasProperty(path: ModelPath): boolean {
    return this.getProperty(path) !== undefined
  }

  resetProperty(path: ModelPath, defaultValue: unknown = undefined): void {
    this.setProperty(path, defaultValue)
  }

  getObjectKeys(path: ModelPath): string[] {
    const obj = this.getProperty(path)
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return Object.keys(obj as Indexable)
    }
    return []
  }

  // ===== SERIALIZATION =====

  clone(): JsonModel<T> {
    return new JsonModel(JSON.parse(JSON.stringify(this.data)), this.options)
  }

  toJSON(): string {
    return JSON.stringify(this.data, null, 2)
  }

  fromJSON(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString)
      Object.assign(this.data, parsed)
      this.updateMetadata()
      this.emit('model-reset', { timestamp: Date.now() })
    } catch (error) {
      console.error('[JsonModel] Error parsing JSON:', error)
    }
  }

  // ===== WATCHERS AND EVENTS =====

  watch(
    path: ModelPath,
    callback: (newValue: unknown, oldValue: unknown) => void,
    options: ModelWatchOptions = {}
  ): WatchStopHandle {
    const stopHandle = watch(
      () => this.getProperty(path),
      callback,
      {
        immediate: options.immediate || false,
        deep: options.deep || true,
        flush: options.flush || 'post'
      }
    )
    
    this.watchers.push(stopHandle)
    return stopHandle
  }

  // ===== VALIDATION =====

  addValidator(path: ModelPath, rule: ValidationRule): void {
    if (!this.validators[path]) {
      this.validators[path] = []
    }
    this.validators[path].push(rule)
  }

  removeValidator(path: ModelPath): void {
    delete this.validators[path]
  }

  validate(path?: ModelPath): boolean {
    if (path) {
      const value = this.getProperty(path)
      return this.validatePath(path, value).length === 0
    }
    
    // Validate all paths
    for (const validatorPath of Object.keys(this.validators)) {
      if (!this.validate(validatorPath)) {
        return false
      }
    }
    return true
  }

  getErrors(path?: ModelPath): string[] {
    if (path) {
      const value = this.getProperty(path)
      return this.validatePath(path, value)
    }
    
    // Get all errors
    const allErrors: string[] = []
    for (const validatorPath of Object.keys(this.validators)) {
      allErrors.push(...this.getErrors(validatorPath))
    }
    return allErrors
  }

  private validatePath(path: ModelPath, value: unknown): string[] {
    const rules = this.validators[path] || []
    const errors: string[] = []
    
    for (const rule of rules) {
      const result = rule.validate(value)
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : rule.message || 'Validation failed')
      }
    }
    
    return errors
  }

  // ===== METADATA =====

  getMetadata(): ModelMetadata {
    return { ...this.metadata }
  }

  reset(paths?: ModelPath[]): void {
    if (paths) {
      paths.forEach(path => {
        const defaultValue = this.options.defaultValues?.[path]
        this.setProperty(path, defaultValue)
      })
    } else {
      // Reset all to default values
      if (this.options.defaultValues) {
        Object.assign(this.data, this.options.defaultValues)
      }
    }
    
    this.updateMetadata()
    this.emit('model-reset', { timestamp: Date.now() })
  }

  destroy(): void {
    // Stop all watchers
    this.watchers.forEach(stop => stop())
    this.watchers = []
    
    // Clear validators
    this.validators = {}
    
    // Clear event listeners
    this.eventListeners = {}
    
    if (this.options.enableLogging) {
      console.log('[JsonModel] Destroyed')
    }
  }

  // ===== PRIVATE HELPERS =====

  private updateMetadata(): void {
    this.changeCount++
    this.metadata.lastModified = new Date()
    this.metadata.changeCount = this.changeCount
    this.metadata.paths = this.getAllPaths(this.data)
    this.metadata.size = JSON.stringify(this.data).length
  }

  private getAllPaths(obj: any, prefix = ''): string[] {
    const paths: string[] = []
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const path = prefix ? `${prefix}/${key}` : key
        paths.push(`/${path}`)
        
        if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          paths.push(...this.getAllPaths(obj[key], path))
        }
      }
    }
    
    return paths
  }

  private emit<K extends keyof JsonModelEvents>(
    event: K, 
    data: JsonModelEvents[K]
  ): void {
    const listeners = this.eventListeners[event] || []
    listeners.forEach(listener => listener(data))
  }

  // ===== EVENT SYSTEM =====

  on<K extends keyof JsonModelEvents>(
    event: K, 
    listener: (data: JsonModelEvents[K]) => void
  ): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    (this.eventListeners[event] as Function[]).push(listener)
  }

  off<K extends keyof JsonModelEvents>(
    event: K, 
    listener: (data: JsonModelEvents[K]) => void
  ): void {
    const listeners = this.eventListeners[event] as Function[] || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}