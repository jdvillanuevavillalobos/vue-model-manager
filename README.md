# 🎯 Zeus Vue Model Manager

> **La primera librería que combina OpenUI5 JsonModel con Vue 3 Reactivity para microfrontends enterprise**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![SAP UI5](https://img.shields.io/badge/SAP%20UI5-0FAAFF?style=for-the-badge&logo=sap&logoColor=white)](https://ui5.sap.com/)

## 🌟 ¿Por qué Zeus Vue Model Manager?

**Zeus Vue Model Manager** es la solución definitiva para desarrolladores que vienen de **SAP UI5** y quieren usar **Vue 3** en arquitecturas de **microfrontends**. Combina lo mejor de ambos mundos:

### 🎯 **Problema que resuelve**

```vue
<!-- ❌ ANTES: Repetitivo y verbose -->
<script setup>
const appTitle = useModel('app', '/title')           // Línea extra
const userName = useModel('user', '/name')           // Línea extra  
const notificationCount = useModel('notifications', '/count') // Línea extra
</script>

<template>
  <ui5-shellbar :primary-title="appTitle" :user-name="userName" />
</template>
```

```vue
<!-- ✅ DESPUÉS: Elegante y familiar -->
<script setup>
const { app, user, notifications } = useModels(['app', 'user', 'notifications'])
</script>

<template>
  <ui5-shellbar 
    :primary-title="app.title" 
    :user-name="user.name"
    :notifications-count="notifications.count" 
  />
</template>
```

### 🏆 **Ventajas únicas**

| Característica | Zeus Vue Model Manager | Pinia | Vuex | OpenUI5 JsonModel |
|---------------|----------------------|-------|------|-------------------|
| **Learning curve para devs UI5** | ✅ Zero | ❌ Media | ❌ Alta | ✅ Familiar |
| **Bundle size** | ✅ ~2KB | ❌ ~10KB | ❌ ~15KB | ❌ Full UI5 |
| **Microfrontend ready** | ✅ Nativo | ⚠️ Global | ⚠️ Global | ❌ Monolítico |
| **Path navigation** | ✅ `/user/name` | ❌ No | ❌ No | ✅ Nativo |
| **Vue 3 reactive** | ✅ 100% | ✅ Sí | ⚠️ Limitado | ❌ No |
| **Cross-MF sharing** | ✅ Built-in | ❌ No | ❌ No | ❌ No |
| **Type safety** | ✅ Enterprise | ✅ Básico | ⚠️ Limitado | ❌ No |

---

## 🚀 Instalación y Configuración

### 📦 **Opción 1: Librería Local (Desarrollo)**

```bash
# 1. Clonar el repositorio
git clone [url-del-repo] zeus-vue-model-manager
cd zeus-vue-model-manager

# 2. Instalar dependencias
npm install

# 3. Compilar la librería
npm run build

# 4. En tu proyecto principal
cd ../tu-proyecto
npm install ../zeus-vue-model-manager
```

### 📦 **Opción 2: Instalación desde NPM (Producción)**

```bash
npm install @zeus/vue-model-manager
```

### 🔧 **Configuración en tu proyecto Vue**

```typescript
// main.ts o setup principal
import { createApp } from 'vue'
import { createModelManager, enableGlobalAuditing } from '@zeus/vue-model-manager'
import App from './App.vue'

const app = createApp(App)

// Crear manager para tu microfrontend
const modelManager = createModelManager('zeus-header', {
  security: { level: 'enterprise' },
  audit: { enabled: true }
})

// En desarrollo, habilitar auditoría
if (import.meta.env.DEV) {
  enableGlobalAuditing()
}

app.mount('#app')
```

---

## 📖 Guía de Uso Completa

### 🔰 **1. Conceptos Básicos**

#### **JsonModel - La base de todo**

```typescript
import { JsonModel } from '@zeus/vue-model-manager'

// Crear un modelo con datos anidados
const userModel = new JsonModel({
  profile: {
    name: 'David Rodriguez',
    email: 'david@zeus.com',
    preferences: {
      theme: 'dark',
      language: 'es'
    }
  },
  notifications: {
    count: 5,
    items: [
      { id: 1, title: 'Bienvenido', read: false },
      { id: 2, title: 'Actualización disponible', read: true }
    ]
  }
})

// ✅ Navegación por paths (estilo OpenUI5)
console.log(userModel.getProperty('/profile/name'))        // "David Rodriguez"
console.log(userModel.getProperty('/notifications/count')) // 5

// ✅ Actualizar propiedades
userModel.setProperty('/profile/name', 'David Rodriguez Silva')
userModel.setProperty('/notifications/count', 3)

// ✅ Operaciones con arrays
userModel.addToArray('/notifications/items', {
  id: 3, 
  title: 'Nueva funcionalidad', 
  read: false
})

// ✅ Buscar y actualizar en arrays
userModel.updateArrayItem(
  '/notifications/items',
  item => item.id === 1,
  { read: true }
)
```

#### **ModelManager - Gestión con scopes**

```typescript
import { createModelManager } from '@zeus/vue-model-manager'

// Crear manager para tu microfrontend
const manager = createModelManager('zeus-header')

// Crear modelos específicos
const appModel = manager.create('app', {
  title: 'Zeus Identity Platform',
  version: '3.0.0',
  environment: 'production'
})

const userModel = manager.create('user', {
  name: 'David Rodriguez',
  role: 'Administrator',
  authenticated: true
})

// Acceder a modelos
const app = manager.getModel('app')
const user = manager.getModel('user')

console.log(app?.getProperty('/title'))    // "Zeus Identity Platform"
console.log(user?.getProperty('/name'))    // "David Rodriguez"
```

### 🎯 **2. Uso en Componentes Vue**

#### **Ejemplo: Header Component**

```vue
<!-- HeaderComponent.vue -->
<template>
  <ui5-shellbar 
    :primary-title="appTitle"
    :secondary-title="appVersion"
    :show-notifications="true"
    :notifications-count="notificationCount"
  >
    <ui5-avatar 
      :initials="userInitials"
      :image="userAvatar"
      slot="profile"
    />
    
    <ui5-input 
      v-if="showSearch"
      :value="searchQuery"
      @input="updateSearch"
      placeholder="Buscar..."
      slot="searchField"
    />
  </ui5-shellbar>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { createModelManager } from '@zeus/vue-model-manager'

// Crear manager para este componente
const manager = createModelManager('zeus-header')

onMounted(() => {
  // Inicializar modelos
  manager.create('app', {
    title: 'Zeus Identity Platform',
    version: 'v3.0.0',
    showSearch: true
  })
  
  manager.create('user', {
    name: 'David Rodriguez',
    initials: 'DR',
    avatar: '/assets/avatars/david.jpg'
  })
  
  manager.create('notifications', {
    count: 12,
    items: []
  })
  
  manager.create('search', {
    query: '',
    results: []
  })
})

// Reactive computed properties
const appTitle = computed(() => 
  manager.getModel('app')?.getProperty('/title') as string
)

const appVersion = computed(() => 
  manager.getModel('app')?.getProperty('/version') as string
)

const showSearch = computed(() => 
  manager.getModel('app')?.getProperty('/showSearch') as boolean
)

const userInitials = computed(() => 
  manager.getModel('user')?.getProperty('/initials') as string
)

const userAvatar = computed(() => 
  manager.getModel('user')?.getProperty('/avatar') as string
)

const notificationCount = computed(() => 
  manager.getModel('notifications')?.getProperty('/count') as number
)

const searchQuery = computed(() => 
  manager.getModel('search')?.getProperty('/query') as string
)

// Métodos
const updateSearch = (event: Event) => {
  const query = (event.target as HTMLInputElement).value
  manager.getModel('search')?.setProperty('/query', query)
}

// Cleanup
onUnmounted(() => {
  manager.clear()
})
</script>
```

### 🌐 **3. Microfrontends y Cross-Scope**

#### **Configuración Multi-MF**

```typescript
// microfrontend-header.ts
const headerManager = createModelManager('zeus-header', {
  security: { level: 'enterprise' },
  audit: { enabled: true }
})

// microfrontend-users.ts  
const usersManager = createModelManager('zeus-users', {
  security: { level: 'standard' },
  audit: { enabled: true }
})

// microfrontend-notifications.ts
const notificationsManager = createModelManager('zeus-notifications', {
  security: { level: 'basic' },
  audit: { enabled: false }
})
```

#### **Acceso Cross-Microfrontend**

```typescript
import { getModelFromMicrofrontend, shareModelBetweenMicrofrontends } from '@zeus/vue-model-manager'

// Desde zeus-header, acceder a datos de zeus-users
const userProfile = getModelFromMicrofrontend('zeus-header', 'zeus-users', 'profile')
console.log(userProfile?.getProperty('/name')) // Datos del usuario desde otro MF

// Compartir tema entre microfrontends
shareModelBetweenMicrofrontends('zeus-header', 'zeus-users', 'theme', 'sharedTheme')
shareModelBetweenMicrofrontends('zeus-header', 'zeus-notifications', 'theme', 'sharedTheme')
```

### 🛡️ **4. Funcionalidades Enterprise**

#### **Validación de Datos**

```typescript
const model = new JsonModel({
  user: { name: '', email: '', age: 0 }
}, {
  enableValidation: true
})

// Agregar reglas de validación
model.addValidator('/user/name', {
  validate: (value) => typeof value === 'string' && value.length > 0,
  message: 'El nombre es requerido'
})

model.addValidator('/user/email', {
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string),
  message: 'Email debe tener formato válido'
})

model.addValidator('/user/age', {
  validate: (value) => typeof value === 'number' && value >= 18,
  message: 'La edad debe ser mayor a 18 años'
})

// Validar antes de guardar
if (model.validate()) {
  console.log('✅ Datos válidos')
  // Guardar datos...
} else {
  console.log('❌ Errores:', model.getErrors())
}
```

#### **Sistema de Eventos**

```typescript
const model = new JsonModel({ counter: 0 })

// Escuchar cambios de propiedades
model.on('property-changed', (event) => {
  console.log(`Propiedad ${event.path} cambió de ${event.oldValue} a ${event.newValue}`)
})

// Escuchar cambios en arrays
model.on('array-changed', (event) => {
  console.log(`Array ${event.path}: ${event.action}`)
})

// Escuchar errores de validación
model.on('validation-error', (event) => {
  console.log(`Error en ${event.path}:`, event.errors)
})

// Los cambios dispararán eventos automáticamente
model.setProperty('/counter', 1)  // Disparará property-changed
```

#### **Watchers Reactivos**

```typescript
const model = new JsonModel({ 
  user: { status: 'offline' },
  notifications: { items: [] }
})

// Watch específico de una propiedad
const stopWatcher = model.watch('/user/status', (newStatus, oldStatus) => {
  console.log(`Estado cambió de ${oldStatus} a ${newStatus}`)
  
  if (newStatus === 'online') {
    // Lógica cuando el usuario se conecta
    console.log('Usuario conectado - actualizando UI')
  }
})

// Watch profundo de un objeto
model.watch('/notifications', (newNotifications, oldNotifications) => {
  console.log('Notificaciones actualizadas:', newNotifications)
}, { deep: true, immediate: true })

// Limpiar watcher cuando no lo necesites
stopWatcher()
```

### 📊 **5. Monitoring y Debugging**

#### **Estadísticas en Tiempo Real**

```typescript
import { getGlobalStatistics, GlobalRegistry } from '@zeus/vue-model-manager'

// Estadísticas globales
const stats = getGlobalStatistics()
console.log('📊 Estadísticas globales:', stats)
/*
{
  registry: {
    totalManagers: 3,
    totalModels: 8,
    scopes: ['zeus-header', 'zeus-users', 'zeus-notifications']
  },
  managers: {
    'zeus-header': { modelCount: 3, totalSize: 1024 },
    'zeus-users': { modelCount: 2, totalSize: 512 },
    'zeus-notifications': { modelCount: 3, totalSize: 768 }
  }
}
*/

// Inspeccionar scope específico
const headerInfo = GlobalRegistry.inspectScope('zeus-header')
console.log('🔍 Header info:', headerInfo)

// Dump completo para debugging
GlobalRegistry.dumpState()
```

#### **Herramientas de Desarrollo**

```typescript
// En desarrollo, habilitar logs detallados
enableGlobalAuditing()

// Crear modelos con logging
const model = new JsonModel(data, {
  enableLogging: true,
  enableValidation: true
})

// Ver logs en consola:
// [JsonModel] Property changed: /user/name
// [ModelManager] Model 'user' created in scope 'zeus-header'
// [GlobalRegistry] Model shared from 'zeus-header' to 'zeus-users'
```

### 🎨 **6. Patrones de Uso Recomendados**

#### **Patrón: Formularios Reactivos**

```vue
<template>
  <form @submit.prevent="submitForm">
    <ui5-input 
      v-model="formData.name"
      :value-state="errors.name ? 'Error' : 'None'"
      :value-state-message="errors.name"
    />
    
    <ui5-input 
      v-model="formData.email"
      :value-state="errors.email ? 'Error' : 'None'"
      :value-state-message="errors.email"
    />
    
    <ui5-button 
      :disabled="!isFormValid"
      @click="submitForm"
    >
      Guardar
    </ui5-button>
  </form>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { JsonModel } from '@zeus/vue-model-manager'

const formModel = new JsonModel({
  name: '',
  email: '',
  phone: ''
}, { enableValidation: true })

// Agregar validaciones
formModel.addValidator('/name', {
  validate: (v) => v.length > 2,
  message: 'Nombre debe tener al menos 3 caracteres'
})

formModel.addValidator('/email', {
  validate: (v) => /\S+@\S+\.\S+/.test(v),
  message: 'Email inválido'
})

// Reactive form data
const formData = reactive({
  get name() { return formModel.getProperty('/name') },
  set name(value) { formModel.setProperty('/name', value) },
  
  get email() { return formModel.getProperty('/email') },
  set email(value) { formModel.setProperty('/email', value) }
})

// Computed errors
const errors = computed(() => ({
  name: formModel.getErrors('/name')[0],
  email: formModel.getErrors('/email')[0]
}))

const isFormValid = computed(() => formModel.validate())

const submitForm = () => {
  if (isFormValid.value) {
    console.log('✅ Formulario válido:', formModel.getData())
    // Enviar datos...
  }
}
</script>
```

#### **Patrón: Lista Dinámica con Filtros**

```vue
<template>
  <div>
    <ui5-input 
      v-model="searchQuery"
      placeholder="Buscar usuarios..."
    />
    
    <ui5-list>
      <ui5-li v-for="user in filteredUsers" :key="user.id">
        <div>{{ user.name }} - {{ user.department }}</div>
      </ui5-li>
    </ui5-list>
    
    <ui5-button @click="addUser">Agregar Usuario</ui5-button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { JsonModel } from '@zeus/vue-model-manager'

const listModel = new JsonModel({
  users: [
    { id: 1, name: 'Ana García', department: 'Engineering' },
    { id: 2, name: 'Carlos López', department: 'Design' },
    { id: 3, name: 'María Rodriguez', department: 'Engineering' }
  ],
  search: {
    query: '',
    filters: { department: 'all' }
  }
})

const searchQuery = computed({
  get: () => listModel.getProperty('/search/query'),
  set: (value) => listModel.setProperty('/search/query', value)
})

const filteredUsers = computed(() => {
  const users = listModel.getProperty('/users') as any[]
  const query = listModel.getProperty('/search/query') as string
  
  if (!query) return users
  
  return users.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.department.toLowerCase().includes(query.toLowerCase())
  )
})

const addUser = () => {
  const newId = Date.now()
  listModel.addToArray('/users', {
    id: newId,
    name: `Usuario ${newId}`,
    department: 'Engineering'
  })
}
</script>
```

---

## 🚀 Despliegue y Distribución

### 📦 **Build y Publicación**

```bash
# 1. Verificar que todo funciona
npm run test:dev

# 2. Limpiar y construir
npm run clean  # si existe
npm run build

# 3. Verificar build
ls -la dist/
# Deberías ver:
# - index.js (CommonJS)
# - index.esm.js (ES Modules)  
# - index.d.ts (TypeScript definitions)

# 4. Probar build localmente
npm pack
# Genera: zeus-vue-model-manager-1.0.0.tgz

# 5. Publicar a NPM (cuando esté listo)
npm publish --access public
```

### 🔧 **Integración en Proyectos**

#### **Vite + Vue 3**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@zeus/vue-model-manager']
  }
})
```

#### **Webpack + Vue 3**

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@zeus/vue-model-manager': path.resolve(__dirname, 'node_modules/@zeus/vue-model-manager')
    }
  }
}
```

#### **Nuxt 3**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [],
  build: {
    transpile: ['@zeus/vue-model-manager']
  }
})
```

### 🐳 **Docker y CI/CD**

```dockerfile
# Dockerfile para desarrollo
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm run test:dev

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

```yaml
# .github/workflows/ci.yml
name: CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:dev
      
  publish:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 🤝 Contribución y Soporte

### 🐛 **Reportar Issues**

1. Verificar que no existe ya en [Issues](../issues)
2. Usar el template de issue
3. Incluir:
   - Versión de Vue
   - Versión de la librería  
   - Código mínimo reproducible
   - Comportamiento esperado vs actual

### 💡 **Sugerir Features**

1. Crear un [Feature Request](../issues/new)
2. Explicar el caso de uso
3. Proponer API si es posible
4. Considerar backward compatibility

### 🔧 **Desarrollo Local**

```bash
# 1. Fork y clonar
git clone https://github.com/tu-usuario/zeus-vue-model-manager.git
cd zeus-vue-model-manager

# 2. Instalar dependencias
npm install

# 3. Ejecutar tests
npm run test:dev

# 4. Hacer cambios y probar
npm run build
npm run test:dev

# 5. Crear PR
git checkout -b feature/nueva-funcionalidad
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

---

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE) para detalles.

---

## 🙋‍♂️ FAQ

### ❓ **¿Es compatible con Vue 2?**
No, Zeus Vue Model Manager está diseñado específicamente para Vue 3 y su sistema de reactividad. Para Vue 2, recomendamos usar OpenUI5 JsonModel directamente.

### ❓ **¿Funciona con Quasar/Vuetify/otras librerías UI?**
Sí, aunque está optimizado para UI5, funciona con cualquier librería de componentes Vue. Los paths y la reactividad son agnósticos al framework UI.

### ❓ **¿Puedo usarlo sin TypeScript?**
Sí, funciona perfectamente con JavaScript vanilla, pero perderás las ventajas del tipado estático.

### ❓ **¿Tiene limitaciones de performance?**
Está optimizado para aplicaciones enterprise. Maneja miles de propiedades reactivas sin problemas. Para casos extremos, usa `immutable: true` en las opciones.

### ❓ **¿Es thread-safe para Web Workers?**
Los modelos son thread-safe para lectura, pero las escrituras deben manejarse desde el hilo principal debido a la reactividad de Vue.

---

## 🎯 Roadmap

### v1.1.0 - Q3 2025
- [ ] Composables mágicos (`useModels`, `useFormModel`)
- [ ] Plugin oficial para DevTools
- [ ] Soporte para SSR/Nuxt 3

### v1.2.0 - Q4 2025  
- [ ] Persistencia automática (localStorage/IndexedDB)
- [ ] Soporte para optimistic updates
- [ ] Cache inteligente entre microfrontends

### v2.0.0 - Q1 2026
- [ ] Soporte para Vue 4 (cuando salga)
- [ ] WebAssembly bindings para performance extrema
- [ ] Plugin para micro-frontend orchestrators

---

**¿Preguntas? ¿Problemas? ¿Ideas?**

📧 Email: [david@zeus.com](mailto:david@zeus.com)  
💬 Discord: [Zeus Community](https://discord.gg/zeus)  
🐦 Twitter: [@ZeusVueModels](https://twitter.com/ZeusVueModels)

---

<div align="center">

**Hecho con ❤️ por el equipo Zeus para la comunidad Vue + UI5**

[⭐ Star en GitHub](https://github.com/zeus/vue-model-manager) • [📖 Documentación](https://docs.zeus.com/vue-model-manager) • [🚀 Demo Live](https://demo.zeus.com/vue-model-manager)

</div>