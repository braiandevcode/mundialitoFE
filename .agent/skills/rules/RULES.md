## RULES

### 1. TERMINAL EXECUTION RULE

- FORBIDDEN to run merges, deployments, tests, or automatic changes WITHOUT MY CONFIRMATION.
- run `node --version` and check update status
- run `vite --version` to know its version and if it's already installed.
- check the `node` version with the framework and other technologies used in the project to avoid incompatibilities
- After installing, run `pnpm audit`  
- **Dependency check:** review dependencies and their sub-dependencies to make sure that in their `package.json` under `scripts` there are no suspicious commands like `curl`, `wget`, or similar network commands; if there are, avoid running them and document it for me.  
- Always use the framework’s installation commands in the “standard” and “recommended” way according to the documentation. For example: run the command `nest create new .` or `pnpm add create vite@latest .` to create a project with folders and default configurations pre-set by Vite.

### 2. RULES FOR INCONSISTENCIES + OPTIMIZATION

- **Avoid reinventing the wheel:** Before creating complex logic that a dependency can solve, explain the reason for the suggestion.
- **FORBIDDEN** to generate spaghetti code (DIVIDE AND CONQUER).
- **PRIORITY AND CRITERION** in optimization and scalability.
- **FORBIDDEN** to use `npm` or `npx` (in case of issues, explain and consult me)
- **FORBIDDEN** to read environment variables

- Apply comments in the code in first person human form and in UPPERCASE explaining logic. Example:
```ts
let num: number = 1;
let num2: number = 2;
let result: number = num + num2; //SUMO AMBOS NUMERO

// FUNCION PARA EL DESCUENTO ESPERA UN ARGUMENTO TIPO NUMERICO
const myFunc = (desc: number): number => {
  return result - desc; // DESCUENTO EL RESULTADO
};

myFunc(3); //INVOCO FUNCION CON RESULTADO FINAL
```

- Nombrar variables, objetos, funciones etc siempre en ingles pero manteniendo coherencia:
  - Una funcion es un verbo, debe ser coherente con lo que hace, ej:

  ```ts
    let num: number = 1;
    let num2: number = 2;
    let result: number = num + num2; //SUMO AMBOS NUMERO

    // FUNCION PARA EL DESCUENTO ESPERA UN ARGUMENTO TIPO NUMERICO
    const subtract = (desc: number): number => {
      return result - desc; // DESCUENTO EL RESULTADO
    };

    subtract(3); //INVOCO FUNCION CON RESULTADO FINAL
    ```
- An interface defines a data structure, it should be consistent and should start with 'I' e.g., `IDataUser`
- A type defines a specific data type, it should be consistent and should start with 'T' e.g., `TDataUser`


### 3. Analysis of Dependency Versions

- **OBLIGATION:** whenever you want to install dependencies, do a deep `search` of **X** dependency and use the latest version `@latest`.
- Analyze deprecated functions and objects to avoid using them.
- Always try to avoid **local** or **global** installations when possible by using `pnpm dlx` or the correct pnpm methods.


### 4. Networking and Configuration

- Don't hardcode URLs; use env vars (`VITE_API_URL`).
- State handling: loading, empty, error.
- Retries/backoff and timeouts in fetch when applicable.