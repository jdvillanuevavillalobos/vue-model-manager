// 🚀 30-Second Demo - Zeus Vue Model Manager

import { 
  createModelManager, 
  setComposableScope, 
  useModel 
} from '../../src/index'

console.log('🚀 Zeus Vue Model Manager - 30 Second Demo')

try {
  // 1. Crear y registrar un manager para el microfrontend actual
  const manager = createModelManager('quick-demo')

  // 2. Crear un modelo reactivo
  manager.create('user', {
    name: 'Ana',
    email: 'ana@example.com'
  })

  // 3. Establecer el scope activo
  setComposableScope('quick-demo')

  // 4. Acceder a propiedades del modelo con reactividad
  const userName = useModel<string>('user', '/name')
  const userEmail = useModel<string>('user', '/email')

  console.log('🧠 userName.value:', userName.value)
  console.log('✉️ userEmail.value:', userEmail.value)

  // 5. Actualizar valores
  userName.value = 'Ana Castillo'
  userEmail.value = 'ana.castillo@zeus.com'

  console.log('✅ updated userName:', userName.value)
  console.log('✅ updated userEmail:', userEmail.value)

  console.log('🎯 Listo para usar en cualquier componente Vue')
} catch (err) {
  console.error('❌ Demo failed:', err)
}
