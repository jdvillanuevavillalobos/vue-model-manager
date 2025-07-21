// examples/08-real-world/data-table-filters.ts
// 📊 Real-World Example: Data Table with Filters

import { createModelManager, setComposableScope, useModel, useModels } from '../../src/index'

console.log('📊 Data Table with Filters - Real World Example')
console.log('='.repeat(60))

try {
  // Scope setup
  const manager = createModelManager('table-filters-demo', {
    audit: { enabled: true },
    security: { level: 'standard' }
  })

  setComposableScope('table-filters-demo')

  // Model definition
  manager.create('table', {
    filters: {
      department: 'All',
      status: 'All',
      search: ''
    },
    data: [
      { id: 1, name: 'Alice', department: 'Engineering', status: 'Active' },
      { id: 2, name: 'Bob', department: 'Marketing', status: 'Inactive' },
      { id: 3, name: 'Charlie', department: 'Engineering', status: 'Active' },
      { id: 4, name: 'Diana', department: 'HR', status: 'Pending' },
      { id: 5, name: 'Eve', department: 'Marketing', status: 'Active' }
    ]
  })

  // Reactive access
  const { table } = useModels(['table'])

  // Dynamic filtering (simulating template logic)
  const filteredData = table.data.filter((row: any) => {
    const depOk = table.filters.department === 'All' || row.department === table.filters.department
    const statusOk = table.filters.status === 'All' || row.status === table.filters.status
    const searchOk = table.filters.search === '' || row.name.toLowerCase().includes(table.filters.search.toLowerCase())
    return depOk && statusOk && searchOk
  })

  console.log('   🔍 Active filters:')
  console.log('      Department:', table.filters.department)
  console.log('      Status:', table.filters.status)
  console.log('      Search:', table.filters.search)

  console.log('\n   📋 Filtered data rows:')
  filteredData.forEach((row: any) => {
    console.log(`      - ${row.name} (${row.department} | ${row.status})`)
  })

  // Simulate UI filter updates
  table.filters.department = 'Marketing'
  table.filters.status = 'Active'
  table.filters.search = 'eve'

  console.log('\n🔁 After filter update:')
  const newFiltered = table.data.filter((row: any) => {
    const depOk = table.filters.department === 'All' || row.department === table.filters.department
    const statusOk = table.filters.status === 'All' || row.status === table.filters.status
    const searchOk = table.filters.search === '' || row.name.toLowerCase().includes(table.filters.search.toLowerCase())
    return depOk && statusOk && searchOk
  })

  newFiltered.forEach((row: any) => {
    console.log(`      - ${row.name} (${row.department} | ${row.status})`)
  })

} catch (error) {
  console.error('❌ Data Table Filters Demo Failed:', error)
}
