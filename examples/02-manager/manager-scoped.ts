// 🏢 ModelManager - Scoped Management for Microfrontends
// Purpose: Demonstrates scoped managers for microfrontend architecture
// Run: npm run demo:manager:scoped

import { createModelManager } from '../../src/index'

console.log('🏢 ModelManager - Scoped Management for Microfrontends')
console.log('=' .repeat(60))
console.log('🎯 This shows microfrontend-ready scoped management\n')

try {
    console.log('🔹 1. Creating multiple scoped managers')
    
    // Header microfrontend manager
    const headerManager = createModelManager('zeus-header', {
        security: { level: 'enterprise' },
        audit: { enabled: true }
    })
    
    // User management microfrontend manager  
    const userManager = createModelManager('zeus-users', {
        security: { level: 'standard' },
        audit: { enabled: true }
    })
    
    // Notification microfrontend manager
    const notificationManager = createModelManager('zeus-notifications', {
        security: { level: 'basic' },
        audit: { enabled: false }
    })
    
    // Analytics microfrontend manager
    const analyticsManager = createModelManager('zeus-analytics', {
        security: { level: 'enterprise' },
        audit: { enabled: true }
    })
    
    console.log('   ✅ Created 4 scoped managers:')
    console.log('      - zeus-header (enterprise security, audit enabled)')
    console.log('      - zeus-users (standard security, audit enabled)')
    console.log('      - zeus-notifications (basic security, audit disabled)')
    console.log('      - zeus-analytics (enterprise security, audit enabled)')
    
    console.log('\n🔹 2. Populating scoped models')
    
    // Header scope models
    headerManager.create('app', {
        title: 'Zeus Identity Platform',
        subtitle: 'Enterprise Edition',
        logo: '/assets/zeus-logo.svg',
        version: '3.0.0',
        build: '2024.03.15.001'
    })
    
    headerManager.create('navigation', {
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: true },
            { id: 'users', label: 'Users', icon: 'group', active: false },
            { id: 'settings', label: 'Settings', icon: 'settings', active: false }
        ],
        breadcrumb: [
            { label: 'Home', path: '/' },
            { label: 'Dashboard', path: '/dashboard' }
        ]
    })
    
    headerManager.create('theme', {
        current: 'sap_horizon',
        available: ['sap_horizon', 'sap_fiori_3', 'sap_fiori_3_dark', 'sap_fiori_3_hcb'],
        customizations: {
            primaryColor: '#0070f3',
            fontSize: 'medium'
        }
    })
    
    // User scope models
    userManager.create('profile', {
        id: 'david.rodriguez',
        name: 'David Rodriguez',
        email: 'david@zeus.com',
        department: 'Engineering',
        title: 'Senior Developer',
        manager: 'sarah.johnson',
        startDate: '2020-01-15',
        permissions: ['read', 'write', 'admin', 'user_management']
    })
    
    userManager.create('session', {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh_token_here',
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Zeus Browser)',
        mfaEnabled: true
    })
    
    userManager.create('preferences', {
        language: 'en',
        timezone: 'America/Los_Angeles',
        dateFormat: 'MM/DD/YYYY',
        theme: 'auto',
        notifications: {
            email: true,
            push: false,
            desktop: true,
            frequency: 'immediate'
        }
    })
    
    // Notification scope models
    notificationManager.create('inbox', {
        unreadCount: 12,
        totalCount: 156,
        items: [
            { id: 1, type: 'info', title: 'System maintenance tonight', priority: 'medium', read: false },
            { id: 2, type: 'success', title: 'Profile updated successfully', priority: 'low', read: true },
            { id: 3, type: 'warning', title: 'Password expires in 7 days', priority: 'high', read: false },
            { id: 4, type: 'error', title: 'Failed login attempt detected', priority: 'critical', read: false }
        ]
    })
    
    notificationManager.create('settings', {
        channels: {
            email: { enabled: true, frequency: 'daily' },
            push: { enabled: false, frequency: 'immediate' },
            sms: { enabled: true, frequency: 'urgent_only' },
            desktop: { enabled: true, frequency: 'immediate' }
        },
        categories: {
            security: true,
            system: true,
            updates: false,
            marketing: false
        }
    })
    
    // Analytics scope models
    analyticsManager.create('dashboard', {
        widgets: [
            { id: 'users', title: 'Active Users', value: 1247, trend: '+12%' },
            { id: 'sessions', title: 'Sessions Today', value: 3892, trend: '+5%' },
            { id: 'errors', title: 'Error Rate', value: '0.2%', trend: '-15%' },
            { id: 'performance', title: 'Avg Response Time', value: '234ms', trend: '-8%' }
        ],
        dateRange: {
            start: '2024-03-01',
            end: '2024-03-15'
        }
    })
    
    analyticsManager.create('metrics', {
        realtime: {
            activeUsers: 247,
            requestsPerSecond: 45,
            errorRate: 0.002,
            avgResponseTime: 234
        },
        historical: {
            dailyActiveUsers: [1200, 1250, 1180, 1300, 1247],
            weeklyGrowth: 8.5,
            monthlyGrowth: 23.2
        }
    })
    
    console.log('   ✅ All scopes populated with relevant models')
    
    console.log('\n🔹 3. Scope isolation verification')
    
    console.log('   📋 Header scope models:', headerManager.getModelNames())
    console.log('   📋 User scope models:', userManager.getModelNames())
    console.log('   📋 Notification scope models:', notificationManager.getModelNames())
    console.log('   📋 Analytics scope models:', analyticsManager.getModelNames())
    
    console.log('\n🔹 4. Cross-scope data access (within same manager)')
    
    // Accessing data within each scope
    console.log('   🏠 Header scope data:')
    console.log('      App title:', headerManager.getModel('app')?.getProperty('/title'))
    console.log('      Current theme:', headerManager.getModel('theme')?.getProperty('/current'))
    console.log('      Navigation items:', headerManager.getModel('navigation')?.getArrayLength('/items'))
    
    console.log('   👤 User scope data:')
    console.log('      Profile name:', userManager.getModel('profile')?.getProperty('/name'))
    console.log('      Session expires:', userManager.getModel('session')?.getProperty('/expiresAt'))
    console.log('      Language:', userManager.getModel('preferences')?.getProperty('/language'))
    
    console.log('   🔔 Notification scope data:')
    console.log('      Unread count:', notificationManager.getModel('inbox')?.getProperty('/unreadCount'))
    console.log('      Email enabled:', notificationManager.getModel('settings')?.getProperty('/channels/email/enabled'))
    
    console.log('   📊 Analytics scope data:')
    console.log('      Active users:', analyticsManager.getModel('dashboard')?.getProperty('/widgets/0/value'))
    console.log('      Realtime users:', analyticsManager.getModel('metrics')?.getProperty('/realtime/activeUsers'))
    
    console.log('\n🔹 5. Manager configuration comparison')
    
    const managers = [
        { name: 'Header', manager: headerManager },
        { name: 'User', manager: userManager },
        { name: 'Notification', manager: notificationManager },
        { name: 'Analytics', manager: analyticsManager }
    ]
    
    managers.forEach(({ name, manager }) => {
        const config = manager.getConfig()
        const stats = manager.getStatistics()
        
        console.log(`   ⚙️ ${name} Manager:`)
        console.log(`      Scope: ${config.scope}`)
        console.log(`      Security: ${config.security?.level}`)
        console.log(`      Audit: ${config.audit?.enabled}`)
        console.log(`      Models: ${stats.modelCount}`)
        console.log(`      Total size: ${stats.totalSize} bytes`)
    })
    
    console.log('\n🔹 6. Scope-specific operations')
    
    // Header-specific: Theme switching
    console.log('\n   🎨 Header: Theme switching simulation')
    const themeModel = headerManager.getModel('theme')
    const originalTheme = themeModel?.getProperty('/current')
    console.log('      Original theme:', originalTheme)
    
    themeModel?.setProperty('/current', 'sap_fiori_3_dark')
    console.log('      Switched to dark theme:', themeModel?.getProperty('/current'))
    
    // User-specific: Session renewal
    console.log('\n   🔐 User: Session renewal simulation')
    const sessionModel = userManager.getModel('session')
    const oldExpiry = sessionModel?.getProperty('/expiresAt')
    const newExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    
    sessionModel?.setProperty('/expiresAt', newExpiry)
    sessionModel?.setProperty('/lastActivity', new Date().toISOString())
    console.log('      Session renewed, new expiry:', sessionModel?.getProperty('/expiresAt'))
    
    // Notification-specific: Mark as read
    console.log('\n   📨 Notification: Mark critical alert as read')
    const inboxModel = notificationManager.getModel('inbox')
    const updated = inboxModel?.updateArrayItem('/items', 
        item => item.priority === 'critical',
        { read: true, readAt: new Date().toISOString() }
    )
    console.log('      Critical alert marked as read:', updated)
    
    // Analytics-specific: Update realtime metrics
    console.log('\n   📈 Analytics: Realtime metrics update')
    const metricsModel = analyticsManager.getModel('metrics')
    metricsModel?.setProperty('/realtime/activeUsers', 289)
    metricsModel?.setProperty('/realtime/requestsPerSecond', 52)
    metricsModel?.setProperty('/realtime/avgResponseTime', 198)
    console.log('      Active users updated to:', metricsModel?.getProperty('/realtime/activeUsers'))
    
    console.log('\n🔹 7. Scope cleanup simulation')
    
    // Create temporary scope
    const tempManager = createModelManager('zeus-temp', {
        security: { level: 'basic' },
        audit: { enabled: false }
    })
    
    tempManager.create('temp-data', { value: 'temporary' })
    console.log('   ➕ Temporary scope created with test data')
    
    // Clean up temporary scope
    tempManager.clear()
    console.log('   🗑️ Temporary scope cleared')
    console.log('   📋 Temp models after clear:', tempManager.getModelNames())
    
    console.log('\n✅ Scoped Management - SUCCESS')
    console.log('🎯 Microfrontend-ready architecture with proper isolation')
    
} catch (error) {
    console.error('\n❌ Scoped Management - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:manager:statistics')