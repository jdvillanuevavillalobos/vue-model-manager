// examples/08-real-world/ui5-header-complete.ts
// 🧭 Real-World UI5 Header - Full ShellBar with models

import { createModelManager, setComposableScope, useModels } from '../../src/index'

console.log('🧭 UI5 Header - Complete ShellBar Example')
console.log('='.repeat(60))

try {
  // 1. Crear y registrar modelos para el header
  const manager = createModelManager('ui5-header', {
    audit: { enabled: true },
    security: { level: 'enterprise' }
  })

  setComposableScope('ui5-header')

  manager.create('user', {
    profile: {
      name: 'David Rodriguez',
      initials: 'DR',
      avatar: '/assets/avatars/david.jpg',
      role: 'Administrator'
    }
  })

  manager.create('notifications', {
    inbox: {
      unreadCount: 3
    },
    items: [
      { id: 1, title: 'New login from Chrome', read: false },
      { id: 2, title: 'Audit report generated', read: false },
      { id: 3, title: 'MFA required on next login', read: true }
    ]
  })

  manager.create('app', {
    info: {
      name: 'Zeus Identity',
      version: '3.2.1',
      environment: 'production'
    },
    features: {
      search: true,
      notifications: true,
      userMenu: true
    }
  })

  console.log('✅ Header models created and registered')

  // 2. Acceder usando useModels
  const { user, notifications, app } = useModels(['user', 'notifications', 'app'])

  // 3. Mostrar datos del modelo
  console.log('🔹 ShellBar Data:')
  console.log('   App name:', app.info.name)
  console.log('   Unread notifications:', notifications.inbox.unreadCount)
  console.log('   User:', user.profile.name)

  // 4. Simular interacción con notificaciones
  const markAllRead = () => {
    notifications.items.forEach(n => (n.read = true))
    notifications.inbox.unreadCount = 0
    console.log('📭 All notifications marked as read')
  }

  markAllRead()

  // 5. Template de ejemplo (para copiar a componente Vue)
  console.log('\n📄 Suggested <template> usage with ShellBar:')
  console.log(`
<template>
  <ui5-shellbar 
    :primary-title="app.info.name"
    :notifications-count="notifications.inbox.unreadCount"
    show-notifications
    show-search
  >
    <ui5-avatar 
      slot="profile"
      :initials="user.profile.initials"
      :image="user.profile.avatar"
    />
    <ui5-button icon="log" slot="startButton" />
    <ui5-popover slot="notifications">
      <ui5-list>
        <ui5-li 
          v-for="n in notifications.items" 
          :key="n.id"
          :class="{ 'unread': !n.read }"
        >
          {{ n.title }}
        </ui5-li>
      </ui5-list>
    </ui5-popover>
  </ui5-shellbar>
</template>

<script setup>
import { useModels, setComposableScope } from '@zeus/vue-model-manager'

setComposableScope('ui5-header')
const { app, user, notifications } = useModels(['app', 'user', 'notifications'])
</script>
`)

  console.log('\n✅ UI5 Header example ready for copy-paste')

} catch (error) {
  console.error('❌ UI5 Header Example Failed:', error)
}
