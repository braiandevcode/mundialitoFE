## REACT RULES AND BEST PRACTICES

### 1. USING HOOKS
- **Limit of useEffects:** Do not allow more than 3 useEffects per file.  
- **useMemo:** Don’t overuse useMemo(), only in coherent and necessary occasions.  
- **useCallback:** Use useCallback() to avoid re-rendering the same instance.  
- **react.memo:** Consider using it to prevent unnecessary renders in child components.  
- **useReducer:** Create separately in case of having complex **states**.  
- **CustomHooks:** Custom hooks that follow coherent logic and are reusable in a certain context.  
- **Provider:** Consider its creation and use for isolated context issues.

### 2. ABOUT FILE EXTENSIONS
- File extensions will be `.tsx` if there are at least minimal uses and calls of the `children` prop and native React functions (useState, useEffect, etc.) in the internal logic; otherwise, they should be `.ts`.

- *useEffect, useCallback, useMemo, useReducer, etc.* should call the function, not create and execute it at the same time: for example, for cleaner code:
```tsx
  const myFunction = (): boolean => {
     return true
  }

  useEffect(myFunction, [dep])
```

### 3. RULES OF CLEAN CODE AND HOOKS
- Every useContext must be read by a `custom hook` to be reusable
- Dependencies in `hooks` should **NEVER** cause **infinite loops** or **unnecessary re-renders**
- Effects with subscriptions should **always** return the `clean up`, for example:
```tsx
    const myFunction = (): boolean => {
     let suscriptionExample = false;
     suscriptionExample = true;

     return () => {
        suscriptionExample = false;
     }

    }
   useEffect(myFunction, [dep])
```
- Dependencies in `useEffect` should only be external, try to avoid having local state dependencies whenever possible. 

- Visual components that have mappings or a lot of conditional logic should be refactored and modularized efficiently to keep the code `clean` and `maintainable`. Look for improvement alternatives. Here's an example that you should avoid and why it's better to improve it:
```tsx

   /** 
      Clean, improve, optimize, modularize, and refactor this kind of messy logic in renders, which doesn't allow scalability or control.
   **/

   const componentWhitLogicComplex = () => {
      return (
         <>
            <div>
               {
                  isLoad === false ? <>
                     dataList.map((d) => (
                        <>
                          <div key={d.id}>
                             <div>
                                 <h3>d.title</h3>
                                 ...
                              </div>
                          </div>
                        </>
                     ))
                  </> : <>
                     <div>
                        <h3>d.title</h3>
                           ...
                        </div>
                     </div>
                  </>
               }
            </div>
         </>
      )
   }

```
- always 'pass a function reference'. Example:
```tsx
   // Avoid mixed logic inside JSX
   <button 
      onClick={(e) => {
         const newValue = e.target.value;
         console.log("Procesando...");
         setData(newValue);
      }}
   >
   Update
   </button>



   // What you should always apply: Isolated and referenced logic
   const handleUpdate = (e) => {
      const newValue = e.target.value;
      console.log("Procesando...");
      setData(newValue);
   };

   // In JSX you just declare what should run
   <button onClick={handleUpdate}>
      Update
   </button>
```

### 4. CASE ICONS
- instalar las librerias estandar por ejemplo `lucide-react`, `react-icons` o la que este mas actualizada y estandarizada
- Para mejor escalabilidad y evitar problemas pasar por `default` un componente de icono custom en formato `svg` de simbolo `help` "?". En caso de no venir el de X libreria renderizar el default.

## REFERENCES
- [PERFORMANCE](./performance.md)