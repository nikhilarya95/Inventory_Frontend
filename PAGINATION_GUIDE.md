# Pagination Implementation Guide

## Overview
Pagination has been added to the application with different configurations for card-based and table-based views.

## Pagination Component
Location: `/home/ubuntu/Desktop/Invent/frontend/src/components/ui/Pagination.tsx`

Features:
- Customizable items per page
- Next/Previous navigation
- Page information display
- Responsive design
- Two types: 'table' and 'card'

## Configuration

### Table-Based Views (Bills, Payments, Orders, Stock, Products)
- Default items per page: **10**
- Options: **10, 20, 50, 100**
- Type: `'table'`

### Card-Based Views (Users, Customers)
- Default items per page: **6**
- Options: **6, 9, 12, 24**
- Type: `'card'`

## Implementation Examples

### 1. Users Page (Card-Based) ✅ COMPLETED
- Items per page: 6/9/12/24
- Pagination added below card grid
- Resets to page 1 when changing items per page

### 2. Bills Page (Table-Based) ✅ COMPLETED
- Items per page: 10/20/50/100
- Pagination added below table
- Works with search and filter

## How to Add Pagination to Other Pages

### Step 1: Import Pagination Component
```tsx
import { Pagination } from '@/components/ui/Pagination';
```

### Step 2: Add State Variables
```tsx
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10); // or 6 for cards
```

### Step 3: Apply Pagination to Data
```tsx
// For tables
const filteredData = data.filter(/* your filter logic */);
const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// Then map over paginatedData instead of filteredData
```

### Step 4: Add Pagination Component
```tsx
<Pagination
  currentPage={currentPage}
  totalItems={filteredData.length}
  itemsPerPage={itemsPerPage}
  onPageChange={(page) => setCurrentPage(page)}
  onItemsPerPageChange={(items) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  }}
  type="table" // or "card"
/>
```

## Pages Status

### ✅ Completed
1. **Users** - Card-based (6/9/12/24)
2. **Bills** - Table-based (10/20/50/100)

### 📋 To Be Implemented
3. **Customers** - Card-based (6/9/12/24)
4. **Products** - Table-based (10/20/50/100)
5. **Stock** - Table-based (10/20/50/100)
6. **Orders** - Table-based (10/20/50/100)
7. **Payments** - Table-based (10/20/50/100)

## Notes
- Pagination automatically resets to page 1 when:
  - Items per page changes
  - Search query changes (recommended to add)
  - Filters change (recommended to add)
- The component is fully responsive and works on mobile devices
- Pagination controls are disabled when there's only one page
