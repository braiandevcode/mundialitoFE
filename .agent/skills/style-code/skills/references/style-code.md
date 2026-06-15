## CODE STYLES

### 1. RULES BASIC
- TypeScript strict mode
- Single quotes
- use arrow functions:
```ts
  const myFunction = () => {}
```
- Type strict
- Not using `any`
- expose the return type in functions


### 2. METHODOLOGY OF PURE CSS HTML OR REACT CLASSES
- use BEM methodology. example:
    ```html
      <!-- HTML -->
       <div class= "block">
          <div class= "block__content">...</div>
       </div>
        <!-- OR -->
       <!-- tsx -->
       <div className= "block">
          <div className= "block__content">...</div>
       </div>
    ```
- use modifiers example:
  ```html
      <!-- HTML -->
       <div class= "block">
          <div class= "block__content">
              <h2 class="block__content-title">default title</h2>
          </div>
          <div class= "block__content">
              <h2 class="block__content-title block__content-title--red">Red title</h2>
          </div>
       </div>
        <!-- OR -->
       <!-- tsx -->
       <div className= "block">
          <div className= "block__content">
              <h2 className="block__content-title">default title</h2>
          </div>
          <div className= "block__content">
              <h2 className="block__content-title block__content-title--red">Red title</h2>
          </div>
       </div>
    ```