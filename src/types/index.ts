// src/types/index.ts
// 🎯 Tipos y interfaces para Zeus Vue Model Manager (Enterprise)
import type { ComputedRef, WatchStopHandle } from 'vue'

// 📋 Tipos básicos
export type ModelPath = string
export type ModelData = Record<string, unknown>

// 🔧 Opciones de configuración del modelo
export interface JsonModelOptions {
  enableLogging?: boolean
  enableValidation?: boolean
  immutable?: boolean
  pathSeparator?: string
  defaultValues?: ModelData
}

// 🔧 Configuración del ModelManager
export interface ModelManagerConfig {
  scope: string
  security?: {
    level: 'basic' | 'standard' | 'enterprise'
  }
  audit?: {
    enabled: boolean
  }
}

// 🔧 Configuración general de modelos
export interface ModelConfig {
  enableLogging?: boolean
  enableSecurity?: boolean
  namespace?: 'private' | 'shared' | 'global'
}

// 🔄 Evento de cambio del modelo
export interface ModelChangeEvent<T = unknown> {
  path: ModelPath
  oldValue: T
  newValue: T
  timestamp: number
  source: 'user' | 'system' | 'api'
}

// 🎯 Binding reactivo
export interface JsonModelBinding<T = unknown> {
  value: ComputedRef<T>
  setValue: (newValue: T) => void
  reset: () => void
  isValid: ComputedRef<boolean>
  errors: ComputedRef<string[]>
}

// 📊 Eventos del modelo
export interface JsonModelEvents {
  'property-changed': ModelChangeEvent
  'validation-error': { path: ModelPath; errors: string[] }
  'model-reset': { timestamp: number }
  'array-changed': { 
    path: ModelPath
    action: 'add' | 'remove' | 'update'
    index?: number
    item?: unknown
  }
}

// 🛡️ Validación
export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean | string
  message?: string
  async?: boolean
}

export interface ModelValidator {
  rules: Record<ModelPath, ValidationRule[]>
  validatePath: (path: ModelPath, value: unknown) => string[]
  validateAll: () => Record<ModelPath, string[]>
}

// 🔍 Metadatos del modelo
export interface ModelMetadata {
  version: string
  created: Date
  lastModified: Date
  changeCount: number
  paths: ModelPath[]
  size: number
}

// 🎯 Configuración de watchers
export interface ModelWatchOptions {
  immediate?: boolean
  deep?: boolean
  flush?: 'pre' | 'post' | 'sync'
}

// 📦 Interface principal del JsonModel extendida
export interface IJsonModel<T = ModelData> {
  // Propiedades básicas
  getData(): T
  getProperty(path: ModelPath): unknown
  setProperty(path: ModelPath, value: unknown): void
  
  // Métodos avanzados
  updateProperties(updates: Record<ModelPath, unknown>): void
  createBinding<R = unknown>(path: ModelPath): ComputedRef<R>
  
  // Array operations
  addToArray(path: ModelPath, item: unknown): void
  removeFromArray(path: ModelPath, index: number): void
  updateArrayItem(
    path: ModelPath,
    predicate: (item: any, index: number) => boolean,
    updates: Record<string, unknown>
  ): boolean
  
  // Utilidades
  hasProperty(path: ModelPath): boolean
  getArrayLength(path: ModelPath): number
  getObjectKeys(path: ModelPath): string[]
  
  // Serialización
  toJSON(): string
  fromJSON(jsonString: string): void
  clone(): IJsonModel<T>
  
  // Watchers y eventos
  watch(
    path: ModelPath,
    callback: (newValue: unknown, oldValue: unknown) => void,
    options?: ModelWatchOptions
  ): WatchStopHandle
  
  // Validación
  addValidator(path: ModelPath, rule: ValidationRule): void
  removeValidator(path: ModelPath): void
  validate(path?: ModelPath): boolean
  getErrors(path?: ModelPath): string[]
  
  // Metadata
  getMetadata(): ModelMetadata
  reset(paths?: ModelPath[]): void
  destroy(): void
}

// 🏭 Factory types
export interface ModelFactory<T = ModelData> {
  create(initialData: T, options?: JsonModelOptions): IJsonModel<T>
  createFromSchema(schema: any): IJsonModel<T>
  createFromUI5Model(ui5Model: any): IJsonModel<T>
}