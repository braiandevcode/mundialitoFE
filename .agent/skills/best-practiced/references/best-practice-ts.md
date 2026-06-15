## TYPESCRIPT BEST PRACTICE RULES

### 1.BEST PRACTICE TO CONTRACTS ESTRUCTURE
- Create Types when: what you want to create as a `contract` can't be achieved with a native interface.
- Don't create or repeat the same contract signatures that cause redundancies.
- Only if possible, use `Omit` or similar to take the same property types.
- Make use of Generics for better flexibility.
- Organize and modularize signatures/contracts in a coherent and optimal way across different files according to context. example:
```ts
    /*
        data structure in the context of a user in the same file
    */
    interface IUserData{
        name:string;
        dni:string;
        address:IAddress;
        dosg:IDog[]
    }

    interface IAddress{
        street:string;
        number:number;
    }


    /*
        data structure in the context of a pet in a separate file file
    */
    interface IDog{
        nameDog:string;
        race:string;
    }

```
- use of `enum` to avoid typos in values with loose strings that are very repetitive in the project.

### 2. TYPING AND QUALITY
- Avoid `any`; use interfaces and generics.
- Always use strict typing:
- Example:
    ```ts
        let edad:number;
        const cadena:string;
        const obj:ExampleCustomType={}
    ```