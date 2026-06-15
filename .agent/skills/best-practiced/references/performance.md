### PERFORMANCE

### 8. Hooks and performance
- **ReactRouter:** for routes within the app
- **useForm:** take advantage of the states provided by `useForm` for different actions in forms.
- **useEffect:** declare complete dependencies; avoid effects with mutable values without memoization.
- **useMemo / useCallback:** use to avoid costly recomputations and unnecessary re-renders; document when not to use.
- **React.memo:** for pure components that receive referential props.
- **useRef:** for mutable values that don’t trigger render.
- Avoid creating inline functions/objects in props when they cause re-renders.

### 9. Performance and Loading
- **Code splitting** and lazy loading (React.lazy + Suspense) for heavy routes and components.
- **Virtualization** for long lists (react-window / react-virtualized).
- Load images lazily and optimize them (srcset, modern formats).
- Check bundle size; warn if gzipped > 300 KB.
- Avoid importing whole libraries; better to import at the function level.