// 🔄 Vuex vs Zeus Vue Model Manager - Migration Example

console.log('🔄 Vuex vs Zeus ModelManager - Migration Comparison\n')

console.log('🔹 Vuex Store Example:')
console.log(`
import { createStore } from 'vuex'

const store = createStore({
  state: () => ({
    user: {
      name: 'David',
      email: 'david@zeus.com'
    }
  }),
  mutations: {
    setName(state, name) {
      state.user.name = name
    }
  },
  actions: {
    updateName({ commit }, name) {
      commit('setName', name)
    }
  },
  getters: {
    userName: (state) => state.user.name
  }
})

export default store
`)

console.log('\n🔁 Equivalent using Zeus ModelManager:')

console.log(`
import { createModelManager, useModel } from '@zeus/vue-model-manager'

// Create manager and model
const manager = createModelManager('my-scope')
manager.create('user', {
  name: 'David',
  email: 'david@zeus.com'
})

// Reactive access in component
const userName = useModel('user', '/name')

// Update name
userName.value = 'Carlos'

// Get value
console.log(userName.value)
`)

console.log('\n✅ Key Benefits:')
console.log(`
- No boilerplate: No need to define mutations, actions o getters
- Reactividad nativa: ComputedRef directamente vinculado al modelo
- Simplicidad: Update directo sin commit/dispatch
- Integración directa con templates (v-model)
- Compatible con Vue 3 Composition API
`)
