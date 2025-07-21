# 🏗️ Zeus Vue Model Manager - Guía de Build y Distribución

> **Guía paso a paso para generar y distribuir la librería Zeus Vue Model Manager**

## 📋 Tabla de Contenidos

- [🔧 Configuración Inicial](#-configuración-inicial)
- [🏗️ Proceso de Build](#️-proceso-de-build)
- [📦 Empaquetado y Distribución](#-empaquetado-y-distribución)
- [🚀 Instalación en Microfrontends](#-instalación-en-microfrontends)
- [✅ Verificación](#-verificación)
- [🔄 Workflow de Desarrollo](#-workflow-de-desarrollo)
- [🐛 Troubleshooting](#-troubleshooting)

---

## 🔧 Configuración Inicial

### **1. Estructura del Proyecto**

```
zeus-vue-model-manager/
├── package.json              ← Configuración NPM
├── vite.config.ts            ← Configuración de build
├── tsconfig.json             ← Configuración TypeScript
├── README.md                 ← Documentación principal
├── BUILD-DEPLOY.md           ← Esta guía
├── src/
│   ├── index.ts              ← Entry point principal
│   ├── core/                 ← Clases principales
│   ├── composables/          ← Composables Vue
│   └── types/                ← Definiciones TypeScript
├── test/
│   └── basic.test.ts         ← Tests y documentación
└── dist/                     ← Archivos generados (git ignore)
```

### **2. Verificar Dependencias**

```bash
# Verificar que tienes todas las dependencias
npm install

# Verificar versiones clave
node --version    # Debe ser >= 18
npm --version     # Debe ser >= 8
```

### **3. Configuración de Archivos Clave**

#### **package.json** - Scripts requeridos:
```json
{
  "scripts": {
    "build": "vite build",
    "build:clean": "rimraf dist && vite build",
    "build:watch": "vite build --watch",
    "test:dev": "tsx test/basic.test.ts",
    "pack": "npm run build:clean && npm pack",
    "prepublishOnly": "npm run build:clean"
  }
}
```

#### **vite.config.ts** - Debe existir en la raíz:
```typescript
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ZeusVueModelManager',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
```

---

## 🏗️ Proceso de Build

### **Comando Único (Recomendado)**

```bash
# Build completo listo para distribución
npm run pack
```

### **Proceso Paso a Paso**

#### **1. Limpiar builds anteriores**

```bash
# PowerShell
Remove-Item -Recurse -Force dist\ -ErrorAction SilentlyContinue

# Bash/Git Bash
rm -rf dist/
```

#### **2. Ejecutar tests**

```bash
# Verificar que todo funciona antes del build
npm run test:dev
```

**Salida esperada:**
```
🎯 Zeus Vue Model Manager - Complete Usage Guide & Test Suite
======================================================================
...
🎉 ALL TESTS COMPLETED SUCCESSFULLY! 🎉
```

#### **3. Build de producción**

```bash
# Build con Vite
npm run build:clean
```

**Salida esperada:**
```
vite v7.0.5 building for production...
✓ 5 modules transformed.
[vite:dts] Start generate declaration files...
dist/index.esm.js  13.39 kB │ gzip: 3.63 kB
[vite:dts] Declaration files built in 1226ms.
dist/index.umd.js  10.08 kB │ gzip: 3.15 kB
✓ built in 1.35s
```

#### **4. Verificar archivos generados**

```bash
# PowerShell
dir dist

# Bash
ls -la dist/
```

**Estructura esperada:**
```
dist/
├── index.d.ts          ← TypeScript definitions
├── index.esm.js        ← ES Modules (13+ kB)
├── index.umd.js        ← UMD format (10+ kB)
└── src/                ← Tipos adicionales
    ├── core/
    ├── composables/
    └── types/
```

---

## 📦 Empaquetado y Distribución

### **1. Crear Package Tarball**

```bash
# Crear archivo .tgz para distribución
npm pack
```

**Salida esperada:**
```
npm notice 📦  @zeus/vue-model-manager@1.0.0
npm notice Tarball Contents
npm notice 21.3kB README.md
npm notice 38B dist/index.d.ts
npm notice 13.4kB dist/index.esm.js
npm notice 10.1kB dist/index.umd.js
...
zeus-vue-model-manager-1.0.0.tgz
```

### **2. Verificar Package**

```bash
# PowerShell
dir *.tgz

# Bash
ls -la *.tgz
```

**Archivo esperado:**
- `zeus-vue-model-manager-1.0.0.tgz` (~15-20 kB)

### **3. Inspeccionar Package (Opcional)**

```bash
# Ver contenido del package sin extraer
npm pack --dry-run

# O extraer para inspección
tar -tzf zeus-vue-model-manager-1.0.0.tgz
```

---

## 🚀 Instalación en Microfrontends

### **1. Navegar al Proyecto Destino**

```bash
# Desde vue-model-manager, ir a tu microfrontend
cd ../../../zeus-header

# O ruta absoluta (ajustar según tu estructura)
cd D:\David\Proyectos\PERSONAL\ZEUS_V3\GIT\zeus_idp\microfront\zeus_idp_mf_web\vue\zeus-header
```

### **2. Instalar la Librería**

#### **Opción A: Instalación Local (Desarrollo)**

```bash
# Instalar desde archivo .tgz
npm install ../zeus-shared-libs/vue-model-manager/zeus-vue-model-manager-1.0.0.tgz
```

#### **Opción B: Link Simbólico (Desarrollo Activo)**

```bash
# En vue-model-manager
npm link

# En zeus-header
npm link @zeus/vue-model-manager
```

#### **Opción C: Instalación Directa (Desarrollo)**

```bash
# Instalar desde carpeta
npm install ../zeus-shared-libs/vue-model-manager
```

### **3. Verificar Instalación**

```bash
# Verificar que se instaló correctamente
npm list @zeus/vue-model-manager
```

**Salida esperada:**
```
zeus-header@1.0.0
└── @zeus/vue-model-manager@1.0.0
```

### **4. Verificar en package.json**

```bash
# PowerShell
Get-Content package.json | Select-String "zeus"

# Bash
grep "zeus" package.json
```

**Entrada esperada:**
```json
{
  "dependencies": {
    "@zeus/vue-model-manager": "file:../zeus-shared-libs/vue-model-manager"
  }
}
```

---

## ✅ Verificación

### **1. Test de Importación**

Crear archivo temporal `test-import.js`:

```javascript
// test-import.js
import { createModelManager, JsonModel } from '@zeus/vue-model-manager'

console.log('✅ Import successful!')
console.log('createModelManager:', typeof createModelManager)
console.log('JsonModel:', typeof JsonModel)

// Test básico
const manager = createModelManager('test')
const model = manager.create('test', { hello: 'world' })
console.log('✅ Basic functionality works!')
console.log('Data:', model.getProperty('/hello'))
```

```bash
# Ejecutar test
node test-import.js

# Limpiar
rm test-import.js
```

### **2. Test en Componente Vue**

```vue
<!-- TestComponent.vue -->
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { createModelManager } from '@zeus/vue-model-manager'
import { computed, onMounted } from 'vue'

const manager = createModelManager('test-component')

onMounted(() => {
  manager.create('app', {
    title: 'Zeus Test',
    message: 'Library imported successfully!'
  })
})

const title = computed(() => 
  manager.getModel('app')?.getProperty('/title')
)

const message = computed(() => 
  manager.getModel('app')?.getProperty('/message')
)
</script>
```

---

## 🔄 Workflow de Desarrollo

### **Desarrollo Local con Hot Reload**

```bash
# Terminal 1: Build en watch mode
npm run build:watch

# Terminal 2: En el proyecto que usa la librería
npm run dev
```

### **Workflow Completo de Release**

```bash
# 1. Desarrollo y tests
npm run test:dev

# 2. Build y package
npm run pack

# 3. Instalación en proyectos
cd ../../../zeus-header
npm install ../zeus-shared-libs/vue-model-manager/zeus-vue-model-manager-1.0.0.tgz

# 4. Test en proyecto real
npm run dev
```

### **Update Workflow**

```bash
# Cuando hagas cambios en la librería:

# 1. En vue-model-manager
npm run pack

# 2. En zeus-header (o cualquier proyecto que la use)
npm uninstall @zeus/vue-model-manager
npm install ../zeus-shared-libs/vue-model-manager/zeus-vue-model-manager-1.0.0.tgz
```

---

## 🐛 Troubleshooting

### **❌ Error: "Cannot find module"**

```bash
# Verificar instalación
npm list @zeus/vue-model-manager

# Reinstalar si es necesario
npm uninstall @zeus/vue-model-manager
npm install ../zeus-shared-libs/vue-model-manager/zeus-vue-model-manager-1.0.0.tgz
```

### **❌ Error de TypeScript**

```bash
# Verificar que los tipos se instalaron
ls node_modules/@zeus/vue-model-manager/dist/

# Debe incluir index.d.ts
```

### **❌ Build falla**

```bash
# Limpiar todo y rebuild
npm run clean
npm install
npm run build:clean
```

### **❌ Package incompleto**

```bash
# Verificar archivos incluidos
npm pack --dry-run

# Debe incluir dist/ y README.md
```

### **❌ Problemas de paths en Windows**

```bash
# Usar paths relativos con /
npm install ../zeus-shared-libs/vue-model-manager/zeus-vue-model-manager-1.0.0.tgz

# O paths absolutos con \\
npm install "D:\\ruta\\completa\\zeus-vue-model-manager-1.0.0.tgz"
```

---

## 🎯 Checklist Final

### **Antes del Release:**

- [ ] ✅ Tests pasan: `npm run test:dev`
- [ ] ✅ Build exitoso: `npm run build:clean`
- [ ] ✅ Archivos en dist/: `index.d.ts`, `index.esm.js`, `index.umd.js`
- [ ] ✅ Package creado: `npm pack`
- [ ] ✅ Tamaño razonable: ~15-20 kB
- [ ] ✅ README.md actualizado
- [ ] ✅ Versión en package.json correcta

### **Verificación de Instalación:**

- [ ] ✅ Se instala sin errores
- [ ] ✅ Aparece en `npm list`
- [ ] ✅ Import funciona: `import { createModelManager } from '@zeus/vue-model-manager'`
- [ ] ✅ TypeScript reconoce los tipos
- [ ] ✅ Funcionalidad básica opera

---

## 🚀 ¡Listo para Producción!

Una vez completados todos los pasos, tu librería estará lista para:

1. **Distribución local** entre microfrontends
2. **Publicación en NPM** (futuro)
3. **Integración en proyectos enterprise**

**Siguiente paso:** [Integración en Microfrontends](./INTEGRATION.md)

---

## 📞 Soporte

Si encuentras problemas durante el build o distribución:

1. Verificar que sigues exactamente los pasos
2. Limpiar node_modules y reinstalar
3. Verificar versiones de Node.js y NPM
4. Consultar logs de error completos

**¡Tu librería Zeus Vue Model Manager está lista para cambiar el mundo de los microfrontends!** 🌟