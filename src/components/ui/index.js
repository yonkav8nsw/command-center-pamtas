/**
 * UI Component Library — Barrel Export
 *
 * Design System Foundation v2.0
 *
 * Import semua komponen UI dari satu tempat:
 *   import { Button, Input, Badge } from '../components/ui'
 *
 * Alih-alih:
 *   import { Button } from '../components/ui/Button'
 *   import { Input } from '../components/ui/Input'
 *   import { Badge } from '../components/ui/Badge'
 */

// ═══════════════════════════════════════════════════════════════════════════
// FOUNDATION COMPONENTS
// Core UI building blocks — selalu tersedia
// ═══════════════════════════════════════════════════════════════════════════

// Form Controls
export { Button, IconButton, ButtonGroup } from './Button'
export { Input, InputGroup } from './Input'
export { Select } from './Select'
export { Textarea } from './Textarea'
export { Checkbox, CheckboxGroup } from './Checkbox'
export { Radio, RadioGroup } from './Radio'
export { Switch, SwitchGroup } from './Switch'

// Display Components
export { Badge, StatusDot, BadgeGroup, KerawananBadge } from './Badge'
export { Card, CardHeader, CardContent, CardFooter, StatCard } from './Card'
export { Panel, PanelHeader, PanelContent, PanelFooter, PanelSection } from './Panel'
export { Divider, SpaceDivider } from './Divider'
export { Tooltip, TooltipLink } from './Tooltip'

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION COMPONENTS
// Navigation and routing UI
// ═══════════════════════════════════════════════════════════════════════════

// Tabs Navigation
export { Tabs, Tab, TabList, TabPanels, TabPanel } from './Tabs'

// Breadcrumb Navigation
export { Breadcrumb } from './Breadcrumb'

// Overlay Menus
export { Dropdown, DropdownItem, DropdownDivider } from './Dropdown'
export { ContextMenu, ContextMenuItem, ContextMenuDivider, useContextMenu } from './ContextMenu'

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT COMPONENTS
// Structural components
// ═══════════════════════════════════════════════════════════════════════════

export { Modal } from './Modal'
export { Table } from './Table'

// ═══════════════════════════════════════════════════════════════════════════
// FEEDBACK COMPONENTS
// User feedback and notifications
// ═══════════════════════════════════════════════════════════════════════════

export { ToastProvider, useToast, ToastItemComponent } from './Toast'
export { useConfirm, ConfirmProvider } from './ConfirmDialog'
export { LoadingSpinner, Spinner, Skeleton, SkeletonRow, SkeletonCard, TableSkeleton, CardGridSkeleton, ListSkeleton } from './LoadingSpinner'
export { EmptyState } from './EmptyState'
export { Alert, AlertTitle, AlertDescription, AlertLink } from './Alert'
export { Progress, ProgressCircle, ProgressGroup } from './Progress'
export { default as PageErrorBoundary } from './PageErrorBoundary'

// ═══════════════════════════════════════════════════════════════════════════
// DATA DISPLAY COMPONENTS
// Data presentation
// ═══════════════════════════════════════════════════════════════════════════

export { PhotoGallery } from './PhotoGallery'
export { StatChip } from './StatChip'
export { ReportTable } from './ReportTable'

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// Helper functions dan constants
// ═══════════════════════════════════════════════════════════════════════════

// Re-export KERAWANAN_CATEGORIES untuk convenience
export { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

/**
 * USAGE EXAMPLES
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Import semua komponen:
 *   import { Button, Input, Badge, Tabs, Breadcrumb } from '../components/ui'
 *
 * Import per kategori:
 *   import { Button, IconButton } from '../components/ui/Button'
 *   import { Tabs, Tab } from '../components/ui/Tabs'
 *   import { Breadcrumb } from '../components/ui/Breadcrumb'
 *
 * Import dengan alias untuk menghindari konflik:
 *   import { Button as Btn, Input as In } from '../components/ui'
 *
 * ───────────────────────────────────────────────────────────────────────────
 *
 * COMPONENT CATEGORIES
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Foundation (12):
 *   Button, IconButton, ButtonGroup
 *   Input, InputGroup
 *   Select
 *   Textarea
 *   Checkbox, CheckboxGroup
 *   Radio, RadioGroup
 *   Switch, SwitchGroup
 *
 * Display (5):
 *   Badge, StatusDot, BadgeGroup, KerawananBadge
 *   Card, CardHeader, CardContent, CardFooter, StatCard
 *   Panel, PanelHeader, PanelContent, PanelFooter, PanelSection
 *   Divider, SpaceDivider
 *   Tooltip, TooltipLink
 *
 * Navigation (4):
 *   Tabs, Tab, TabList, TabPanels, TabPanel
 *   Breadcrumb
 *   Dropdown, DropdownItem, DropdownDivider
 *   ContextMenu, ContextMenuItem, ContextMenuDivider, useContextMenu
 *
 * Layout (2):
 *   Modal
 *   Table
 *
 * Feedback (8):
 *   Toast, useToast, ToastProvider
 *   ConfirmDialog, useConfirm, ConfirmProvider
 *   LoadingSpinner, Spinner, Skeleton, SkeletonRow, SkeletonCard
 *   EmptyState
 *   Alert, AlertTitle, AlertDescription, AlertLink
 *   Progress, ProgressCircle, ProgressGroup
 *   PageErrorBoundary
 *
 * Data Display (3):
 *   PhotoGallery
 *   StatChip
 *   ReportTable
 *
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Total: 32+ components with sub-components
 */