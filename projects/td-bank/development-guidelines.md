# Development Guidelines - TD Bank App

## 🎯 Core Principles

### 1. Component-First Approach
- **Improve existing components** instead of creating one-off solutions
- **Enhance base components** to handle new use cases automatically
- **Maintain backward compatibility** when extending functionality
- **Detect content types intelligently** (e.g., external URLs, button types)

**Example:** Instead of creating custom button lists, enhance `LinkList` with variants like `minimal` and `containerClassName` props.

### 2. Research-Driven Development
- **Always investigate existing patterns** before implementing new features
- **Search the codebase extensively** using Grep/Glob tools
- **Understand the "why"** behind existing implementations
- **Document new patterns** when establishing them

**Required search workflow:**
```bash
# Find similar implementations
Grep: "component-name|pattern-name"
# Locate related files  
Glob: "**/*component*", "**/*feature*"
# Check usage patterns
Grep: "import.*ComponentName"
```

### 3. Consistency & Standards
- **Follow existing naming conventions** and project structure
- **Don't assume libraries are available** - check imports and package.json first
- **Apply changes consistently** across related pages/flows
- **Maintain established patterns** in file organization and code style

---

## 🏗️ Project-Specific Patterns

### Directory Structure Rules
- **Page components**: `src/app/[persona]/[platform]/feature/page.js`
- **Shared components**: `src/app/components/ComponentName.js`
- **Base components**: `src/app/components/base/component-name.js`
- **Documentation**: `src/app/components/page.js` (component showcase)

### Component Enhancement Patterns

#### 1. Adding Variants
When extending components, use the `variant` prop pattern:
```javascript
// ✅ Good: Extensible variant system
function Component({ variant = 'default', ...props }) {
  const isSpecial = variant === 'special';
  // Configure based on variant
}

// ❌ Bad: Boolean props for variations  
function Component({ isSpecial, isDifferent, isCustom }) {}
```

#### 2. Custom Styling Support
Provide `containerClassName` or similar props for edge cases:
```javascript
// ✅ Good: Allows customization while maintaining defaults
function LinkList({ 
  variant = 'default', 
  containerClassName = '',
  titleClasses = 'font-medium' 
}) {
  const defaultClass = variant === 'minimal' ? '' : 'bg-white shadow-xs';
  const containerClass = containerClassName || defaultClass;
}
```

#### 3. Backward Compatibility
When improving components:
```javascript
// ✅ Good: New features don't break existing usage
function InfoBanner({ 
  text, 
  linkUrl, 
  linkText,
  // New props with safe defaults
  showClose = false,
  customIconName = null 
}) {
  // Existing functionality unchanged
  // New features opt-in via props
}
```

### Navigation Patterns

#### 1. Back Button Logic
- **Dynamic back**: Use `router.back()` for flexible navigation
- **Fixed back**: Use specific URLs when parent-child relationship is clear
- **Props priority**: `backLinkUrl` > `onBackClick` > default behavior

```javascript
// Pattern used in NotchMenu
const handleBackClick = () => {
  if (onBackClick) {
    onBackClick(); // Custom handler first
  } else {
    router.push(backLinkUrl); // Then specific URL
  }
};
```

#### 2. Platform-Aware Components
Always support both iOS and Android patterns:
```javascript
function NotchMenu({ platform = 'ios', title }) {
  const headerClass = platform === 'ios' ? 'text-center' : 'text-left ml-9';
  const IconComponent = platform === 'android' ? ArrowLeftIcon : ChevronLeftIcon;
}
```

### State Management Patterns

#### 1. URL State for Persistence
Use URL parameters for state that should survive page refreshes:
```javascript
const searchParams = useSearchParams();
const accountNumber = searchParams.get('number');
const showSuccess = searchParams.get('success');
```

#### 2. Context for Shared State
Use React Context for data that's shared across multiple components:
- `PersonaContext`: User data, accounts, profiles
- `HintsContext`: Feature hints and guidance

---

## 🔍 Research Workflow

### Before Starting Any Feature

#### 1. **Search for Similar Features**
```bash
# Look for similar UI patterns
Grep: "similar-feature-name" 
Grep: "similar-component-pattern"

# Find pages with similar flows
Glob: "**/*similar-feature*"
```

#### 2. **Check Component Usage**
```bash
# See how existing components are used
Grep: "ComponentName" output_mode:"content" -A:3 -B:1

# Find props patterns
Grep: "ComponentName.*=" output_mode:"content"
```

#### 3. **Review Related Pages**
- Check pages in the same flow/section
- Look at similar features in other sections
- Review the components documentation page

### During Implementation

#### 1. **Maintain Consistency**
- Use same prop names as similar components
- Follow established file naming patterns
- Match existing code formatting and structure

#### 2. **Apply Changes Broadly**
- If improving a component, apply to all usage locations
- If fixing a pattern, check for the same pattern elsewhere
- Update documentation when adding new patterns

### After Implementation

#### 1. **Update Documentation**
- Add new component variants to `components/page.js`
- Document new patterns in this file
- Update prop descriptions and examples

#### 2. **Test Integration**
- Verify existing functionality still works
- Test new features in different contexts
- Check responsive behavior on different screen sizes

---

## 📝 Code Quality Standards

### 1. Component Documentation
Every component should have:
- Clear prop definitions with defaults
- Usage examples in `components/page.js`
- Comments for complex logic
- PropTypes or TypeScript definitions where applicable

### 2. Error Handling
- Graceful fallbacks for missing data
- User-friendly error messages
- Console warnings for development issues
- Proper loading states

### 3. Performance Considerations
- Avoid unnecessary re-renders
- Use lazy loading for heavy components
- Optimize images and assets
- Cache expensive calculations

### 4. Accessibility
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

---

## 🛠️ Tools and Commands

### Essential Search Commands
```bash
# Component usage patterns
Grep: "ComponentName" output_mode:"content" -n

# Find imports
Grep: "import.*ComponentName" 

# File structure exploration
Glob: "**/*component-name*"
Glob: "**/*feature-name*"

# Check for external dependencies
Grep: "from ['\".].*package-name"
```

### Pre-Implementation Checklist
- [ ] Searched for existing similar implementations
- [ ] Checked component usage patterns in codebase
- [ ] Reviewed related files and pages
- [ ] Identified reusable patterns vs. one-off needs
- [ ] Planned backward-compatible enhancements
- [ ] Considered responsive and accessibility implications

### Post-Implementation Checklist
- [ ] Updated component documentation
- [ ] Added examples to showcase page
- [ ] Tested existing functionality still works
- [ ] Applied improvements to related pages
- [ ] Documented new patterns established
- [ ] Verified responsive behavior
- [ ] Checked accessibility compliance

---

*This document should be updated when new patterns are established or existing patterns evolve. Keep it as the single source of truth for development practices on this project.*