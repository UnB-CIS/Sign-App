# UX Design Principles

When designing or improving UI components, apply these core principles to create intuitive, beautiful, and highly usable interfaces.

## Core Design Principles

1. **Progressive Disclosure**
   - Show only what's needed initially, reveal complexity gradually
   - Don't overwhelm users with all options at once
   - Use patterns like accordions, tabs, or expand/collapse to manage complexity
   - Example: Collapsible sections that start collapsed for optional features

2. **Visibility of System Status**
   - Users should always know what state the system is in
   - Show clear indicators: configured vs empty, saved vs unsaved, loading vs loaded
   - Use status badges, counts, and visual indicators
   - Example: "(2 of 5 configured)" shows progress at a glance

3. **Recognition over Recall**
   - Make context and options visible, don't make users remember
   - Show previews of content rather than just labels
   - Keep important context on screen
   - Example: Show message preview text instead of just "Message 1"

4. **Flexibility & Efficiency**
   - Design should work for both quick edits and detailed work
   - Support multiple workflows (keyboard shortcuts, drag-drop, etc.)
   - Allow batch operations where appropriate
   - Don't force users through unnecessary steps

5. **Aesthetic & Minimalist Design**
   - Remove visual clutter and unnecessary elements
   - Every element should serve a clear purpose
   - Use whitespace effectively
   - Prefer clean, simple interfaces over busy ones
   - Show action buttons (like "Clear") only when relevant

6. **Maintain Context**
   - Don't take users out of their workflow unnecessarily
   - Prefer inline editing over modals when possible
   - Keep related information visible
   - Example: Edit messages inline rather than opening a separate page

7. **Scannability**
   - Users should be able to quickly scan and understand state
   - Use visual hierarchy (size, weight, color) effectively
   - Group related items clearly
   - Show summaries before details
   - Example: Status indicators, preview text, clear section headers

## Evaluating UI Patterns

When choosing between multiple UI approaches, evaluate each option using a matrix:

| Approach | Progressive Disclosure | Minimalism | Scannability | Context | Flexibility | Space Efficiency |
|----------|------------------------|------------|--------------|---------|-------------|------------------|
| Option A | ⭐⭐⭐                | ⭐⭐       | ⭐⭐⭐       | ⭐⭐    | ⭐⭐        | ⭐⭐⭐           |
| Option B | ⭐⭐                  | ⭐⭐⭐     | ⭐⭐         | ⭐⭐⭐  | ⭐⭐        | ⭐⭐             |

Rate each option (⭐ to ⭐⭐⭐) against all relevant principles, then choose the option with the best overall balance.

## Context-Specific Considerations

Always consider the specific use case:

- **Frequency of use**: Features used rarely should be more hidden (progressive disclosure), frequently used features should be immediately visible
- **Optional vs Required**: Optional features should take up minimal space by default
- **Typical usage patterns**: If users usually configure 2-3 of 10 items, optimize for that case
- **Form position**: Features deep in a long form need to be more space-efficient
- **User expertise**: Consider whether users are beginners or power users

## Common UI Patterns and When to Use Them

1. **Accordion (Collapsible List)**
   - **Use when**: Users need to configure a subset of many items (e.g., 2-3 of 10)
   - **Benefits**: Space efficient, scannable, shows status at a glance
   - **Implementation**: Show preview text when collapsed, chevron icon, smooth animations
   - **Example**: Post-answer messages where most are optional

2. **Tabs**
   - **Use when**: Content is mutually exclusive or users work on one thing at a time
   - **Benefits**: Clean, organized, clear focus on one section
   - **Implementation**: Show status indicators (dots, checkmarks) on tabs
   - **Example**: Different configuration panels that don't need simultaneous visibility

3. **Modal/Drawer**
   - **Use when**: Task needs focused attention or more space
   - **Benefits**: Removes distractions, provides dedicated workspace
   - **Drawbacks**: Loses context of main form, requires extra click
   - **Example**: Complex multi-step configurations

4. **Inline Expansion**
   - **Use when**: Editing is quick and context needs to be maintained
   - **Benefits**: No navigation, stays in flow, context preserved
   - **Implementation**: Click anywhere on row to expand, show actions inline
   - **Example**: Quick text edits in a list

5. **Card Grid**
   - **Use when**: Items are visual or equal in importance
   - **Benefits**: Scannable, visually engaging, works well with images
   - **Drawbacks**: Takes more space, less dense
   - **Example**: Selecting from preset templates or themes

## Case Study: Post-Answer Messages Accordion

**Problem**: Post-answer messages took up too much space, appeared before number-of-questions selector, and had a non-functional "Collapsed" button.

**Solution**: Implemented accordion pattern with these features:

- Summary header: "(2 of 5 configured)" for instant status visibility
- Collapsible rows showing preview: `▶ After question 1 — "Thanks for sharing..."`
- Empty states shown as: `▶ After question 2 — Empty [+ Add]`
- Click anywhere to expand/collapse (not just icon)
- Smooth chevron rotation animation
- "Clear" button only appears when message exists
- Positioned after number-of-questions selector (logical flow)

**Principles Applied**:

- ✅ Progressive Disclosure (collapsed by default)
- ✅ Visibility of System Status (count + previews)
- ✅ Recognition over Recall (preview text visible)
- ✅ Aesthetic & Minimalist (clean, only 1 line per item when collapsed)
- ✅ Scannability (see all items and status at a glance)
- ✅ Space Efficient (compact when not in use)

**Results**: Space-efficient, scannable, beautiful, and highly usable interface that scales from 0 to 10+ messages gracefully.

## Best Practices Checklist

When implementing UI improvements:

- [ ] Consider all 7 core principles
- [ ] Evaluate multiple approaches using the matrix framework
- [ ] Think about typical usage patterns (not just edge cases)
- [ ] Implement hover states and visual feedback
- [ ] Add smooth transitions/animations (but keep them subtle)
- [ ] Test with real content (not just placeholders)
- [ ] Ensure keyboard accessibility
- [ ] Verify responsive behavior on different screen sizes
- [ ] Check that empty states are clear and helpful
- [ ] Confirm that common tasks require minimal clicks

## Anti-Patterns to Avoid

- ❌ Buttons that don't do anything (non-functional UI elements)
- ❌ Showing all complexity upfront when most users won't need it
- ❌ Forcing users through modals for simple inline edits
- ❌ Missing status indicators (users can't tell what's configured)
- ❌ Poor ordering (putting dependent settings before their prerequisites)
- ❌ Action buttons that appear inconsistently
- ❌ Unclear empty states or placeholder text
- ❌ Too much vertical space for optional features
- ❌ Animations that are too slow or distracting

