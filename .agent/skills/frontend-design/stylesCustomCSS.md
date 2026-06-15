## STYLES CUSTOM CSS

### 1. RULES BASIC
- Always have it modularized by `reset`, `base`, and `utilities` styles, for example:
    - reset:
       ```css
            *,::after, ::before{
                box-sizing: border-box;
                padding: 0;
                margin:0;
            }

            body{
               
                width: 100dvw;  <!-- or 100% -->  
                min-hight: 100dvh;
                ...
            }
       ```

        - base: all p, h1, h2, a, etc or classes shared across several `tags` and that in their applied values have a default value (base). example:
            ```css
                .p{
                    color:red;
                } 

                .block__content{
                    width: 500px;
                }
                ...
            ```
        - utilities: all the properties and values that are shared more than once in code and allow optimization. example:
            ```css
                .flex{
                    display: flex;
                } 

                .flex-align-center{
                    align-center: center;
                }

                ...
            ```

- Analyze with **rigor** the order of waterfalls and references with greater weight to avoid "stepping on" the expected styles.
- avoid the use of '!important' (unless external libraries do not have a more optimal way)
- Always choose to use shorthands and values that do not generate performance problems in the browser.
- Always take into account the order of the "painting" and application of styles for better performance and behavior in animations.

### 2. METHODOLOGY OF STYLES CSS
- use BEM methodology. example:
    ```css
        .block{
            ...
        }

        .block__title{
            ...
        }

    ```
- use modifiers example:
    ```css
        .block{
            ...
        }

        .block__content{
            ....
        }

        .block__contente-title{
            ...
        }

        <!-- MODIFICADOR -->
         .block__contente-title--red{
            ...
        }
    ```

### 3. RESPONSIVENESS
- Use `mobile-first` methodology
- Coherent and readable font sizes according to font and size.
- Take advantage of `flex`, `grid`, and their `shorthands`
- Positioning relative to each size. Effective.

### 4. OUTPUT AND EXPECTATIVES
- Stable and maintainable code
- Optimized
- Clarity
- Organized
- Readable
- Good performance in the browser
- Stable and effective animation behavior and delays.
