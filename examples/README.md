# 🎯 Zeus Vue Model Manager - Examples Guide

> **Complete examples showcase for Zeus Vue Model Manager - OpenUI5-style models with Vue 3 reactivity**

## 🚀 Quick Start

```bash
# 30-second demo - See the magic immediately
npm run demo

# Browse specific examples
npm run demo:core:basic
npm run demo:composables:multiple
npm run demo:realworld:header
```

## 📁 Examples Structure

### **📂 01-core/** - JsonModel Core Functionality
> **Purpose**: Demonstrates JsonModel class features in isolation

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`json-model-basic.ts`](01-core/json-model-basic.ts) | Basic JsonModel creation and usage | `new JsonModel()`, `getProperty()`, `setProperty()` |
| [`json-model-paths.ts`](01-core/json-model-paths.ts) | OpenUI5-style path navigation | Deep paths like `/user/profile/contact/email` |
| [`json-model-arrays.ts`](01-core/json-model-arrays.ts) | Array operations | `addToArray()`, `removeFromArray()`, `updateArrayItem()` |
| [`json-model-validation.ts`](01-core/json-model-validation.ts) | Validation system | `addValidator()`, `validate()`, `getErrors()` |
| [`json-model-events.ts`](01-core/json-model-events.ts) | Event system | `on()`, `off()`, property-changed, array-changed events |
| [`json-model-serialization.ts`](01-core/json-model-serialization.ts) | JSON import/export | `toJSON()`, `fromJSON()`, `clone()` |

**Run**: `npm run demo:core:*`

---

### **📂 02-manager/** - ModelManager Features
> **Purpose**: Scoped model management (microfrontend-ready)

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`manager-basic.ts`](02-manager/manager-basic.ts) | Basic manager creation | `createModelManager()`, `create()`, `getModel()` |
| [`manager-scoped.ts`](02-manager/manager-scoped.ts) | Scoped managers for microfrontends | Multiple scopes, security levels |
| [`manager-statistics.ts`](02-manager/manager-statistics.ts) | Statistics and monitoring | `getStatistics()`, `getGlobalStatistics()` |
| [`manager-cleanup.ts`](02-manager/manager-cleanup.ts) | Memory management | `removeModel()`, `clear()`, `destroy()` |

**Run**: `npm run demo:manager:*`

---

### **📂 03-composables/** - Vue 3 Composables
> **Purpose**: Demonstrates useModel and useModels composables for Vue integration

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`use-model-single.ts`](03-composables/use-model-single.ts) | Single property access | `useModel('user', '/name')` returns ComputedRef |
| [`use-models-multiple.ts`](03-composables/use-models-multiple.ts) | Multiple models magic proxy | `useModels(['user', 'app'])` returns reactive objects |
| [`composables-comparison.ts`](03-composables/composables-comparison.ts) | useModel vs useModels | When to use each approach |

**Run**: `npm run demo:composables:*`

---

### **📂 04-vue-integration/** - Vue Template Integration
> **Purpose**: Using Zeus models in Vue templates

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`template-basic.ts`](04-vue-integration/template-basic.ts) | Basic template usage | Interpolation `{{ user.name }}` |
| [`template-forms.ts`](04-vue-integration/template-forms.ts) | Form binding | `v-model` with model properties |
| [`template-lists.ts`](04-vue-integration/template-lists.ts) | List rendering | `v-for` with model arrays |
| [`template-computed.ts`](04-vue-integration/template-computed.ts) | Computed properties | Derived values from models |

**Run**: `npm run demo:vue:*`

---

### **📂 05-reactivity/** - Vue 3 Reactivity Concepts
> **Purpose**: Explains reactivity patterns and best practices

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`automatic-updates.ts`](05-reactivity/automatic-updates.ts) | Auto UI updates (no watch needed) | Automatic model-driven UI |
| [`watch-effects.ts`](05-reactivity/watch-effects.ts) | watch() for side effects | API calls, analytics, notifications |
| [`computed-properties.ts`](05-reactivity/computed-properties.ts) | computed() with models | Derived state from models |
| [`reactive-comparison.ts`](05-reactivity/reactive-comparison.ts) | vs Pinia/Vuex | Performance and API comparison |

**Run**: `npm run demo:reactivity:*`

---

### **📂 06-microfrontend/** - Microfrontend Features
> **Purpose**: Enterprise cross-microfrontend capabilities

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`cross-scope-access.ts`](06-microfrontend/cross-scope-access.ts) | Access models across scopes | `getModelFromMicrofrontend()` |
| [`model-sharing.ts`](06-microfrontend/model-sharing.ts) | Share models between MFs | `shareModelBetweenMicrofrontends()` |
| [`global-registry.ts`](06-microfrontend/global-registry.ts) | Global registry management | `GlobalRegistry` inspection |
| [`scope-isolation.ts`](06-microfrontend/scope-isolation.ts) | Security and isolation | Scope boundaries and permissions |

**Run**: `npm run demo:microfrontend:*`

---

### **📂 07-enterprise/** - Enterprise Features
> **Purpose**: Advanced enterprise functionality

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`security-levels.ts`](07-enterprise/security-levels.ts) | Security configurations | basic/standard/enterprise levels |
| [`audit-logging.ts`](07-enterprise/audit-logging.ts) | Audit trails | Change tracking, access logs |
| [`performance-monitoring.ts`](07-enterprise/performance-monitoring.ts) | Performance metrics | Memory usage, operation timing |
| [`memory-optimization.ts`](07-enterprise/memory-optimization.ts) | Memory management | Cleanup strategies, optimization |

**Run**: `npm run demo:enterprise:*`

---

### **📂 08-real-world/** - Complete Real-World Examples
> **Purpose**: Full component implementations ready for production

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`ui5-header-complete.ts`](08-real-world/ui5-header-complete.ts) | SAP Fiori header | Full header with user, notifications, search |
| [`user-profile-form.ts`](08-real-world/user-profile-form.ts) | Complete form component | Validation, reactivity, submission |
| [`notification-center.ts`](08-real-world/notification-center.ts) | Notification system | Real-time updates, filtering |
| [`data-table-filters.ts`](08-real-world/data-table-filters.ts) | Data table with filters | Sorting, filtering, pagination |

**Run**: `npm run demo:realworld:*`

---

### **📂 09-migration/** - Migration Guides
> **Purpose**: Help migrate from other state managers

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`from-openui5.ts`](09-migration/from-openui5.ts) | OpenUI5 JsonModel → Zeus | Side-by-side comparison |
| [`from-pinia.ts`](09-migration/from-pinia.ts) | Pinia → Zeus | State management comparison |
| [`from-vuex.ts`](09-migration/from-vuex.ts) | Vuex → Zeus | Action/mutation vs direct updates |
| [`migration-best-practices.ts`](09-migration/migration-best-practices.ts) | Migration strategies | Step-by-step migration approach |

**Run**: `npm run demo:migration:*`

---

### **📂 10-quick-start/** - Quick Demos
> **Purpose**: Fast demos for new users and teams

| File | Purpose | Key Features Shown |
|------|--------|---------------------|
| [`30-second-demo.ts`](10-quick-start/30-second-demo.ts) | Fastest demo | Core value proposition |
| [`setup-to-usage.ts`](10-quick-start/setup-to-usage.ts) | Complete workflow | Setup → Component usage |
| [`feature-showcase.ts`](10-quick-start/feature-showcase.ts) | Feature overview | All-in-one feature tour |

**Run**: `npm run demo`

---