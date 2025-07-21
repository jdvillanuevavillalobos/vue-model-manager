// examples/08-real-world/notification-center.ts
// 🔔 Real-World Example: Notification Center

import { createModelManager, setComposableScope, useModel, useModels } from '../../src/index'

console.log('🔔 Notification Center - Real World Example')
console.log('='.repeat(60))

try {
  // 1. Scope setup
  const manager = createModelManager('notifications-demo', {
    audit: { enabled: true },
    security: { level: 'standard' }
  })

  setComposableScope('notifications-demo')

  // 2. Model creation
  manager.create('notifications', {
    inbox: {
      unreadCount: 4,
      lastChecked: new Date().toISOString()
    },
    items: [
      { id: 1, title: 'Welcome to Zeus', type: 'info', read: false },
      { id: 2, title: 'Update your profile', type: 'warning', read: false },
      { id: 3, title: 'New login detected', type: 'error', read: false },
      { id: 4, title: 'Settings saved', type: 'success', read: true }
    ]
  })

  // 3. Access data reactively
  const { notifications } = useModels(['notifications'])

  // 4. Computed-like logic: unread notifications
  const unreadItems = notifications.items.filter((n: any) => !n.read)
  console.log('📬 Unread notifications:')
unreadItems.forEach((n: any) => {
  console.log(`   • [${n.type.toUpperCase()}] ${n.title}`);
});


  // 5. Mark notification as read
  const markAsRead = (id: number) => {
    const notif = notifications.items.find((n: any) => n.id === id)
    if (notif && !notif.read) {
      notif.read = true
      notifications.inbox.unreadCount -= 1
      console.log(`✅ Notification #${id} marked as read`)
    }
  }

  // 6. Simulate user action
  markAsRead(1)
  markAsRead(3)

  console.log('\n📬 Updated unread notifications:')
  const updatedUnread = notifications.items.filter((n: any) => !n.read)
  updatedUnread.forEach((n: any) => {
    console.log(`   • [${n.type.toUpperCase()}] ${n.title}`)
  })

  console.log('\n📈 Total unread count:', notifications.inbox.unreadCount)

} catch (error) {
  console.error('❌ Notification Center Demo Failed:', error)
}
