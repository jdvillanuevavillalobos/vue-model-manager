// examples/09-migration/from-openui5.ts
// 🔄 Migración desde OpenUI5 - Comparación práctica

import { JsonModel } from '../../src/core/JsonModel'
import { createModelManager, setComposableScope, useModel } from '../../src'

console.log('🔄 Migración desde OpenUI5 - Comparación lado a lado')
console.log('='.repeat(60))

// Datos de ejemplo
const userData = {
  user: {
    profile: {
      name: 'Carlos Torres',
      email: 'carlos@openui5.com',
      role: 'Administrador'
    },
    settings: {
      theme: 'sap_fiori_3',
      language: 'es'
    }
  }
}

console.log('\n📘 OpenUI5 - Modelo clásico')
console.log(`
var oModel = new sap.ui.model.json.JSONModel({
  user: {
    profile: {
      name: "Carlos Torres",
      email: "carlos@openui5.com",
      role: "Administrador"
    }
  }
});
sap.ui.getCore().setModel(oModel);
`)

console.log('\n📗 Zeus Vue Model Manager - Nueva forma con Vue 3')
console.log('✅ Creación del modelo')

const model = new JsonModel(userData)
console.log('   🔹 Nombre:', model.getProperty('/user/profile/name'))
console.log('   🔹 Email:', model.getProperty('/user/profile/email'))

console.log('\n✅ Usando ModelManager y useModel (forma recomendada)')

const manager = createModelManager('migration-demo')
manager.create('user', userData.user)

setComposableScope('migration-demo')

const nameRef = useModel<string>('user', '/profile/name')
const emailRef = useModel<string>('user', '/profile/email')

console.log('   🧠 Reactive nameRef.value:', nameRef.value)
console.log('   🧠 Reactive emailRef.value:', emailRef.value)

console.log('\n🔁 Actualizando valores con setters')
nameRef.value = 'Carlos T. Silva'
emailRef.value = 'carlos@zeus.com'

console.log('   ✅ Nuevo nombre:', nameRef.value)
console.log('   ✅ Nuevo email:', emailRef.value)
console.log('   🗂 Verificación directa:', manager.getModel('user')?.getProperty('/profile/name'))

console.log('\n📄 Template Vue equivalente:')
console.log(`
<template>
  <div>
    <ui5-input v-model="nameRef" label="Nombre" />
    <ui5-input v-model="emailRef" label="Correo" />
  </div>
</template>

<script setup>
import { useModel, setComposableScope } from '@zeus/vue-model-manager'

setComposableScope('migration-demo')
const nameRef = useModel('user', '/profile/name')
const emailRef = useModel('user', '/profile/email')
</script>
`)

console.log('\n🎯 Migración completada con éxito y ventaja reactivas de Vue 3')
