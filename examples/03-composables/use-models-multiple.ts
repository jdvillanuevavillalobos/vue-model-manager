// ✨ useModels - Multiple Models Magic Proxy
// Purpose: Demonstrates useModels composable for multiple model access
// Run: npm run demo:composables:multiple

import { 
  createModelManager, 
  setComposableScope, 
  configureComposables,
  useModels,
  useModelsFromScope,
  useModelsShallow
} from '../../src/index'

console.log('✨ useModels - Multiple Models Magic Proxy')
console.log('=' .repeat(50))
console.log('🎯 This shows useModels magic proxy for multiple models\n')

try {
    console.log('🔹 1. Setting up comprehensive test environment')
    
    // Create manager with multiple models
    const manager = createModelManager('multi-models-demo', {
        security: { level: 'enterprise' },
        audit: { enabled: true }
    })
    
    // Set composable scope
    setComposableScope('multi-models-demo')
    
    // User model
    const userModel = manager.create('user', {
        profile: {
            name: 'David Rodriguez',
            email: 'david@zeus.com',
            title: 'Senior Developer',
            department: 'Engineering',
            avatar: '/assets/avatars/david.jpg',
            contact: {
                phone: '+1-555-0123',
                address: {
                    street: '123 Tech Street',
                    city: 'San Francisco',
                    zipCode: '94105'
                }
            }
        },
        settings: {
            theme: 'sap_horizon',
            language: 'en',
            timezone: 'PST',
            notifications: {
                email: true,
                push: false,
                sms: true,
                frequency: 'daily'
            }
        },
        activity: {
            lastLogin: new Date().toISOString(),
            sessionCount: 1247,
            projectsCompleted: 23,
            averageHours: 8.5
        }
    })
    
    // App model
    const appModel = manager.create('app', {
        info: {
            name: 'Zeus Identity Platform',
            version: '3.0.0',
            build: 'b2024.03.15.001',
            releaseDate: '2024-03-15',
            environment: 'production'
        },
        config: {
            debug: false,
            apiBaseUrl: 'https://api.zeus.com',
            timeout: 30000,
            retryAttempts: 3,
            enableCache: true
        },
        features: {
            sso: true,
            mfa: true,
            audit: true,
            analytics: false,
            darkMode: true,
            realTimeSync: false
        }
    })
    
    // Notifications model
    const notificationsModel = manager.create('notifications', {
        inbox: {
            unreadCount: 7,
            totalCount: 156,
            lastChecked: new Date().toISOString()
        },
        items: [
            { id: 1, type: 'info', title: 'Welcome to Zeus!', read: false, priority: 'low', sender: 'System' },
            { id: 2, type: 'warning', title: 'Password expires soon', read: false, priority: 'high', sender: 'Security' },
            { id: 3, type: 'success', title: 'Profile updated', read: true, priority: 'low', sender: 'System' },
            { id: 4, type: 'error', title: 'Login failed from unknown device', read: false, priority: 'critical', sender: 'Security' }
        ],
        settings: {
            enabled: true,
            frequency: 'realtime',
            channels: ['email', 'desktop', 'mobile'],
            quietHours: {
                enabled: true,
                start: '22:00',
                end: '08:00'
            }
        }
    })
    
    // Dashboard model
    const dashboardModel = manager.create('dashboard', {
        widgets: [
            { id: 'users', title: 'Active Users', value: 1247, trend: '+12%', type: 'metric' },
            { id: 'sessions', title: 'Sessions Today', value: 3892, trend: '+5%', type: 'metric' },
            { id: 'errors', title: 'Error Rate', value: '0.2%', trend: '-15%', type: 'percentage' },
            { id: 'performance', title: 'Avg Response Time', value: '234ms', trend: '-8%', type: 'time' }
        ],
        layout: {
            columns: 3,
            responsive: true,
            theme: 'modern',
            spacing: 'comfortable'
        },
        filters: {
            dateRange: '7d',
            department: 'all',
            status: 'active',
            region: 'global'
        }
    })
    
    console.log('   ✅ Comprehensive test environment setup')
    console.log('   📊 Created models:', manager.getModelNames())
    console.log('   📍 Composable scope set to:', 'multi-models-demo')
    
    console.log('\n🔹 2. Basic useModels magic proxy usage')
    
    // Magic proxy access to multiple models
    const { user, app, notifications, dashboard } = useModels(['user', 'app', 'notifications', 'dashboard'])
    
    console.log('   ✨ Magic proxy objects created')
    console.log('   📄 Direct property access:')
    console.log('      user.profile.name:', user.profile.name)
    console.log('      user.settings.theme:', user.settings.theme)
    console.log('      app.info.name:', app.info.name)
    console.log('      app.config.environment:', app.config.environment)
    console.log('      notifications.inbox.unreadCount:', notifications.inbox.unreadCount)
    console.log('      dashboard.layout.columns:', dashboard.layout.columns)
    
    console.log('\n🔹 3. Deep nested object access')
    
    console.log('   🔍 Deep nested property access:')
    console.log('      user.settings.notifications.email:', user.settings.notifications.email)
    console.log('      user.settings.notifications.frequency:', user.settings.notifications.frequency)
    console.log('      user.profile.contact.address.city:', user.profile.contact.address.city)
    console.log('      app.features.sso:', app.features.sso)
    console.log('      app.features.mfa:', app.features.mfa)
    console.log('      notifications.settings.quietHours.enabled:', notifications.settings.quietHours.enabled)
    console.log('      dashboard.filters.dateRange:', dashboard.filters.dateRange)
    
    console.log('\n🔹 4. Array access and manipulation')
    
    console.log('   📋 Array property access:')
    console.log('      notifications.items.length:', notifications.items.length)
    console.log('      dashboard.widgets.length:', dashboard.widgets.length)
    console.log('      notifications.settings.channels.length:', notifications.settings.channels.length)
    
    console.log('   📋 Array element access:')
    console.log('      First notification:', notifications.items[0].title)
    console.log('      Second notification priority:', notifications.items[1].priority)
    console.log('      First widget title:', dashboard.widgets[0].title)
    console.log('      First widget value:', dashboard.widgets[0].value)
    console.log('      First channel:', notifications.settings.channels[0])
    
    // Array manipulation
    console.log('\n   📋 Array manipulation:')
    notifications.items.push({
        id: 5,
        type: 'info',
        title: 'New feature available!',
        read: false,
        priority: 'medium',
        sender: 'Product Team'
    })
    
    console.log('      Added notification, new length:', notifications.items.length)
    console.log('      New notification title:', notifications.items[4].title)
    
    // Add new widget
    dashboard.widgets.push({
        id: 'revenue',
        title: 'Monthly Revenue',
        value: '$125,000',
        trend: '+18%',
        type: 'currency'
    })
    
    console.log('      Added widget, new length:', dashboard.widgets.length)
    console.log('      New widget title:', dashboard.widgets[4].title)
    
    console.log('\n🔹 5. Reactive property updates')
    
    console.log('   🔄 Original values:')
    console.log('      user.profile.name:', user.profile.name)
    console.log('      user.settings.theme:', user.settings.theme)
    console.log('      app.config.debug:', app.config.debug)
    console.log('      notifications.inbox.unreadCount:', notifications.inbox.unreadCount)
    
    // Direct property updates
    user.profile.name = 'David Rodriguez Silva'
    user.settings.theme = 'sap_fiori_3_dark'
    app.config.debug = true
    notifications.inbox.unreadCount = 5
    
    console.log('\n   🔄 After direct updates:')
    console.log('      user.profile.name:', user.profile.name)
    console.log('      user.settings.theme:', user.settings.theme)
    console.log('      app.config.debug:', app.config.debug)
    console.log('      notifications.inbox.unreadCount:', notifications.inbox.unreadCount)
    
    console.log('\n🔹 6. Complex nested updates')
    
    console.log('   🔄 Complex nested property updates:')
    
    // Deep nested updates
    user.settings.notifications.email = false
    user.settings.notifications.push = true
    user.profile.contact.address.city = 'Los Angeles'
    app.features.analytics = true
    app.features.realTimeSync = true
    dashboard.layout.responsive = false
    dashboard.layout.spacing = 'compact'
    
    console.log('      user.settings.notifications.email:', user.settings.notifications.email)
    console.log('      user.settings.notifications.push:', user.settings.notifications.push)
    console.log('      user.profile.contact.address.city:', user.profile.contact.address.city)
    console.log('      app.features.analytics:', app.features.analytics)
    console.log('      app.features.realTimeSync:', app.features.realTimeSync)
    console.log('      dashboard.layout.responsive:', dashboard.layout.responsive)
    console.log('      dashboard.layout.spacing:', dashboard.layout.spacing)
    
    // Update array elements
    notifications.items[0].read = true
    notifications.items[1].priority = 'critical'
    dashboard.widgets[0].value = 1350
    dashboard.widgets[0].trend = '+18%'
    
    console.log('\n   📋 Array element updates:')
    console.log('      First notification read status:', notifications.items[0].read)
    console.log('      Second notification priority:', notifications.items[1].priority)
    console.log('      First widget updated value:', dashboard.widgets[0].value)
    console.log('      First widget updated trend:', dashboard.widgets[0].trend)
    
    console.log('\n🔹 7. Cross-scope access with useModelsFromScope')
    
    // Create another scope for testing
    const globalManager = createModelManager('global-settings', {
        security: { level: 'basic' },
        audit: { enabled: false }
    })
    
    globalManager.create('theme', {
        global: {
            primaryColor: '#0070f3',
            secondaryColor: '#666666',
            mode: 'auto',
            customizations: {
                headerHeight: 64,
                sidebarWidth: 280
            }
        }
    })
    
    globalManager.create('locale', {
        default: 'en',
        supported: ['en', 'es', 'de', 'fr'],
        fallback: 'en',
        dateFormat: 'MM/DD/YYYY'
    })
    
    console.log('   🌍 Created global-settings scope')
    
    // Access from specific scope
    const { theme: globalTheme, locale: globalLocale } = useModelsFromScope('global-settings', ['theme', 'locale'])
    
    console.log('   🔄 Cross-scope access:')
    console.log('      globalTheme.global.primaryColor:', globalTheme.global.primaryColor)
    console.log('      globalTheme.global.mode:', globalTheme.global.mode)
    console.log('      globalLocale.default:', globalLocale.default)
    console.log('      globalLocale.supported:', globalLocale.supported)
    
    // Update cross-scope
    globalTheme.global.mode = 'dark'
    globalTheme.global.customizations.headerHeight = 72
    globalLocale.default = 'es'
    
    console.log('   🔄 After cross-scope updates:')
    console.log('      Updated globalTheme mode:', globalTheme.global.mode)
    console.log('      Updated header height:', globalTheme.global.customizations.headerHeight)
    console.log('      Updated default locale:', globalLocale.default)
    
    console.log('\n🔹 8. Model synchronization verification')
    
    // Verify that proxy updates are reflected in original models
    console.log('\n   ✅ Model synchronization verification:')
    console.log('      Proxy user.profile.name:', user.profile.name)
    console.log('      Model user.profile.name:', userModel.getProperty('/profile/name'))
    console.log('      Values match:', user.profile.name === userModel.getProperty('/profile/name'))
    
    console.log('\n      Proxy app.config.debug:', app.config.debug)
    console.log('      Model app.config.debug:', appModel.getProperty('/config/debug'))
    console.log('      Values match:', app.config.debug === appModel.getProperty('/config/debug'))
    
    console.log('\n      Proxy notifications.inbox.unreadCount:', notifications.inbox.unreadCount)
    console.log('      Model notifications.inbox.unreadCount:', notificationsModel.getProperty('/inbox/unreadCount'))
    console.log('      Values match:', notifications.inbox.unreadCount === notificationsModel.getProperty('/inbox/unreadCount'))
    
    console.log('\n      Proxy deep nested value:', user.profile.contact.address.city)
    console.log('      Model deep nested value:', userModel.getProperty('/profile/contact/address/city'))
    console.log('      Deep values match:', user.profile.contact.address.city === userModel.getProperty('/profile/contact/address/city'))
    
    console.log('\n🔹 9. Vue 3 template usage patterns')
    
    console.log('\n   📝 Vue Template Usage Examples:')
    console.log(`
<!-- Complete header component -->
<template>
  <ui5-shellbar 
    :primary-title="app.info.name"
    :notifications-count="notifications.inbox.unreadCount"
    :show-search="app.features.search"
  >
    <!-- User profile in header -->
    <ui5-avatar 
      :initials="getUserInitials(user.profile.name)"
      :image="user.profile.avatar"
      slot="profile"
      @click="showUserMenu"
    />
    
    <!-- Notifications popup -->
    <ui5-popover slot="notifications">
      <ui5-list>
        <ui5-li 
          v-for="notification in notifications.items"
          :key="notification.id"
          :class="{ 'unread': !notification.read }"
        >
          <ui5-icon :name="getNotificationIcon(notification.type)" />
          {{ notification.title }}
          <ui5-badge v-if="notification.priority === 'high'" color-scheme="1">
            High Priority
          </ui5-badge>
        </ui5-li>
      </ui5-list>
    </ui5-popover>
  </ui5-shellbar>
</template>

<script setup>
import { useModels, setComposableScope } from '@zeus/vue-model-manager'

// Set scope once per microfrontend
setComposableScope('header-scope')

// Magic proxy access - no individual ComputedRefs needed
const { app, user, notifications } = useModels(['app', 'user', 'notifications'])

// All properties are automatically reactive
function getUserInitials(name) {
  return name.split(' ').map(n => n[0]).join('')
}

function getNotificationIcon(type) {
  return type === 'warning' ? 'warning' : 'information'
}

function showUserMenu() {
  // Handle user menu
}
</script>`)
    
    console.log('\n   📝 Form Binding Example:')
    console.log(`
<!-- Settings form with direct binding -->
<template>
  <ui5-form>
    <ui5-form-group header-text="User Profile">
      <ui5-input 
        v-model="user.profile.name"
        label="Full Name"
      />
      
      <ui5-input 
        v-model="user.profile.email"
        label="Email"
        type="Email"
      />
      
      <ui5-input 
        v-model="user.profile.contact.phone"
        label="Phone"
      />
      
      <ui5-textarea 
        v-model="user.profile.contact.address.street"
        label="Street Address"
      />
    </ui5-form-group>
    
    <ui5-form-group header-text="Preferences">
      <ui5-select 
        v-model="user.settings.theme"
        label="Theme"
      >
        <ui5-option value="sap_horizon">Horizon</ui5-option>
        <ui5-option value="sap_fiori_3">Fiori 3</ui5-option>
        <ui5-option value="sap_fiori_3_dark">Fiori 3 Dark</ui5-option>
      </ui5-select>
      
      <ui5-select 
        v-model="user.settings.language"
        label="Language"
      >
        <ui5-option value="en">English</ui5-option>
        <ui5-option value="es">Español</ui5-option>
        <ui5-option value="de">Deutsch</ui5-option>
      </ui5-select>
    </ui5-form-group>
    
    <ui5-form-group header-text="Notifications">
      <ui5-switch 
        v-model="user.settings.notifications.email"
        text="Email Notifications"
      />
      
      <ui5-switch 
        v-model="user.settings.notifications.push"
        text="Push Notifications"
      />
      
      <ui5-switch 
        v-model="user.settings.notifications.sms"
        text="SMS Notifications"
      />
      
      <ui5-select 
        v-model="user.settings.notifications.frequency"
        label="Frequency"
      >
        <ui5-option value="immediate">Immediate</ui5-option>
        <ui5-option value="daily">Daily</ui5-option>
        <ui5-option value="weekly">Weekly</ui5-option>
      </ui5-select>
    </ui5-form-group>
  </ui5-form>
</template>

<script setup>
// Direct two-way binding - updates model automatically
const { user } = useModels(['user'])
</script>`)
    
    console.log('\n   📝 Dashboard Example:')
    console.log(`
<!-- Dashboard with widgets -->
<template>
  <div class="dashboard" :class="dashboard.layout.theme">
    <div 
      class="widget-grid" 
      :style="{ 
        gridTemplateColumns: \`repeat(\${dashboard.layout.columns}, 1fr)\`,
        gap: dashboard.layout.spacing === 'compact' ? '8px' : '16px'
      }"
    >
      <ui5-card 
        v-for="widget in dashboard.widgets"
        :key="widget.id"
        :header-text="widget.title"
        class="dashboard-widget"
      >
        <div class="widget-content">
          <h2 class="widget-value">{{ widget.value }}</h2>
          <span 
            class="widget-trend"
            :class="{ 
              positive: widget.trend.startsWith('+'),
              negative: widget.trend.startsWith('-')
            }"
          >
            {{ widget.trend }}
          </span>
        </div>
      </ui5-card>
    </div>
    
    <!-- Dashboard controls -->
    <ui5-panel header-text="Filters">
      <ui5-select v-model="dashboard.filters.dateRange" label="Date Range">
        <ui5-option value="1d">Last Day</ui5-option>
        <ui5-option value="7d">Last Week</ui5-option>
        <ui5-option value="30d">Last Month</ui5-option>
      </ui5-select>
      
      <ui5-select v-model="dashboard.filters.department" label="Department">
        <ui5-option value="all">All Departments</ui5-option>
        <ui5-option value="engineering">Engineering</ui5-option>
        <ui5-option value="design">Design</ui5-option>
      </ui5-select>
    </ui5-panel>
  </div>
</template>

<script setup>
const { dashboard } = useModels(['dashboard'])
</script>`)
    
    console.log('\n🔹 10. Performance testing and optimization')
    
    console.log('\n   ⚡ Performance Test: useModels vs individual access')
    
    // Test useModels performance
    const multiStart = performance.now()
    
    for (let i = 0; i < 1000; i++) {
        const name = user.profile.name
        const theme = user.settings.theme
        const appName = app.info.name
        const debug = app.config.debug
        const count = notifications.inbox.unreadCount
        const columns = dashboard.layout.columns
    }
    
    const multiTime = performance.now() - multiStart
    
    console.log(`      useModels: 1000 property accesses in ${multiTime.toFixed(2)}ms`)
    console.log(`      Average per access: ${(multiTime / 1000).toFixed(3)}ms`)
    
    // Test deep nested access performance
    const deepStart = performance.now()
    
    for (let i = 0; i < 1000; i++) {
        const city = user.profile.contact.address.city
        const email = user.settings.notifications.email
        const headerHeight = globalTheme?.global?.customizations?.headerHeight
    }
    
    const deepTime = performance.now() - deepStart
    
    console.log(`      Deep nested: 1000 accesses in ${deepTime.toFixed(2)}ms`)
    console.log(`      Average per deep access: ${(deepTime / 1000).toFixed(3)}ms`)
    
    // Memory usage estimation
    const modelStats = manager.getStatistics()
    console.log(`\n   💾 Memory usage:`)
    console.log(`      Total models: ${modelStats.modelCount}`)
    console.log(`      Total model size: ${modelStats.totalSize.toLocaleString()} bytes`)
    console.log(`      Average per model: ${Math.round(modelStats.totalSize / modelStats.modelCount).toLocaleString()} bytes`)
    
    console.log('\n🔹 11. Advanced usage patterns')
    
    console.log('\n   🎯 Advanced Pattern: Conditional Model Loading')
    console.log(`
// Conditional model loading based on user role
<script setup>
import { computed } from 'vue'
import { useModels } from '@zeus/vue-model-manager'

const { user } = useModels(['user'])

// Load different models based on user role
const modelList = computed(() => {
  const base = ['user', 'app']
  
  if (user.profile.title === 'Senior Developer') {
    return [...base, 'admin', 'analytics', 'performance']
  } else if (user.profile.department === 'Engineering') {
    return [...base, 'team', 'projects']
  } else {
    return [...base, 'notifications']
  }
})

// Reactive model loading - would need to be implemented as a composable
// const models = useModels(modelList.value)
</script>`)
    
    console.log('\n   🎯 Advanced Pattern: Model Composition')
    console.log(`
// Compose data from multiple models
<script setup>
import { computed } from 'vue'
import { useModels } from '@zeus/vue-model-manager'

const { user, app, notifications, dashboard } = useModels([
  'user', 'app', 'notifications', 'dashboard'
])

// Computed values combining multiple models
const headerData = computed(() => ({
  title: app.info.name,
  subtitle: \`v\${app.info.version} - \${app.info.environment}\`,
  user: {
    name: user.profile.name,
    avatar: user.profile.avatar,
    initials: user.profile.name.split(' ').map(n => n[0]).join(''),
    department: user.profile.department
  },
  notifications: {
    count: notifications.inbox.unreadCount,
    hasUnread: notifications.inbox.unreadCount > 0,
    lastChecked: notifications.inbox.lastChecked
  },
  theme: user.settings.theme,
  features: app.features
}))

// Dashboard summary
const dashboardSummary = computed(() => ({
  totalWidgets: dashboard.widgets.length,
  layout: dashboard.layout,
  activeFilters: Object.entries(dashboard.filters)
    .filter(([key, value]) => value !== 'all')
    .length
}))
</script>`)
    
    console.log('\n   🎯 Advanced Pattern: Model Validation')
    console.log(`
// Reactive validation across models
<script setup>
import { computed } from 'vue'
import { useModels } from '@zeus/vue-model-manager'

const { user, app } = useModels(['user', 'app'])

const isProfileComplete = computed(() => {
  return user.profile.name &&
         user.profile.email &&
         user.profile.contact.phone &&
         user.profile.contact.address.city
})

const hasValidSettings = computed(() => {
  return user.settings.theme &&
         user.settings.language &&
         user.settings.timezone
})

const canAccessAdminFeatures = computed(() => {
  return user.profile.title === 'Senior Developer' &&
         app.features.audit &&
         app.config.debug === false
})
</script>`)
    
    console.log('\n🔹 12. Error handling and edge cases')
    
    console.log('\n   🔍 Testing error handling:')
    
    // Test nonexistent models
    const { nonexistent } = useModels(['nonexistent'])
    console.log('      Nonexistent model access:', nonexistent?.someProperty)
    
    // Test deep access on undefined
    console.log('      Deep access on undefined:', user?.nonexistent?.deep?.property)
    
    // Test array access on undefined
    console.log('      Array access on undefined:', nonexistent?.items?.[0]?.title)
    
    console.log('\n🔹 13. Configuration and optimization')
    
    console.log('   ⚙️ Testing configuration:')
    
    // Test with fallback disabled
    configureComposables({ fallbackToGlobalSearch: false })
    const { user: scopedUser } = useModels(['user'])
    console.log('      Scoped user access (fallback disabled):', scopedUser.profile.name)
    
    // Test shallow mode (if implemented)
    const { app: shallowApp } = useModelsShallow(['app'])
    console.log('      Shallow app access:', shallowApp.info?.name)
    
    // Re-enable fallback
    configureComposables({ fallbackToGlobalSearch: true })
    
    console.log('\n✅ useModels Multiple Models - SUCCESS')
    console.log('🎯 Perfect for component-wide reactive data access')
    console.log('💡 Features demonstrated:')
    console.log('   - Magic proxy with automatic reactivity')
    console.log('   - Deep nested object access')
    console.log('   - Array manipulation and access')
    console.log('   - Cross-scope model access')
    console.log('   - Model synchronization verification')
    console.log('   - Performance optimization')
    console.log('   - Vue 3 template integration')
    console.log('   - Advanced composition patterns')
    console.log('   - Error handling and edge cases')
    console.log('   - Enterprise-grade architecture')
    
} catch (error) {
    console.error('\n❌ useModels Multiple Models - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:composables:comparison')