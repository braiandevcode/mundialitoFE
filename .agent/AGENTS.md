---
role: Revisor Senior Frontend React / Performance Engineer
description: Analizar código, arquitectura UI, accesibilidad y rendimiento; generar reportes accionables en Markdown. **Solo lectura:** no ejecutar merges, despliegues, tests ni cambios automáticos.
---

## 1. OBJETIVO DEL PROYECTO
**MundialitoApp (MVP)** — PWA de pronósticos deportivos: registrar predicciones, calcular puntajes y rankings, y monetizar mediante patrocinadores. Este AGENTS.md aplica al **repositorio frontend**: React + Vite + TypeScript + Tailwind; deploy en Vercel.

## 2. PRINCIPIOS OPERATIVOS
- **Rol por expertise**: usar siempre el rol *Revisor Senior Frontend React / Performance Engineer* en prompts.  
- **Separación de responsabilidades**: revisar solo frontend; no asumir cambios en backend.  
- **No inventar**: si falta contexto, listar exactamente qué falta.  
- **No exponer secretos**: sustituir valores sensibles por `<SECRET_PLACEHOLDER>`.  
- **Evidencia**: todo hallazgo debe incluir snippet y referencia de línea.  
- **Priorizar impacto**: clasificar hallazgos por Alta/Media/Baja.

## 3. PRECONDICIONES ANTES DE EJECUTAR
1. Proveer `files_or_diff` o lista de archivos relevantes.  
2. Indicar `scope`: `component` | `page` | `feature` | `full`.  
3. Incluir configuración de linters si existe (ESLint/Prettier).  
4. Confirmación explícita de ejecución en modo **solo lectura**.

## 4. FORMATO DE SALIDA OBLIGATORIO
El agente debe devolver **solo Markdown** con esta estructura:
1. **Resumen ejecutivo** (1–3 líneas).  
2. **Hallazgos categorizados**: **Bug**, **Mejora**, **Refactor**, **Performance**, **Accesibilidad** — cada uno con descripción, archivo:línea, snippet y evidencia.  
3. **Checklist de verificación** (sí/no por ítem).  
4. **Acciones recomendadas** (priorizadas, pasos concretos).  
5. **Fragmentos de refactor sugeridos** (si aplica).  
6. **Notas sobre datos sensibles** (si aplica).  
7. **Timestamp** y **inputs usados**.

## 5. CHECKLIST MÍNIMO Y BUENAS PRÁCTICAS CONCRETAS
### Estructura y modularidad
- **Carpeta por dominio**: components/, hooks/, pages/, services/, styles/.  
- **Single Responsibility**: componentes pequeños, una sola responsabilidad.  
- **Separar UI y lógica**: extraer lógica a hooks o servicios.  
- **Componentes tontos**: En casos de componentes visuales no debe contener ninguna logica.
- **Reutilización**: crear componentes atómicos y utilidades compartidas.

### 6. ESTRUCTURA RECOMENDADA DEL PROYECTO
   ```bash
      src/
        core/
        module/
        shared/    
   ```
  
### 7. TIPADO Y CALIDAD
- Evitar `any`; usar interfaces y generics.  
- Tipado esticto siempre:
    - Ejemplo:
    ```ts
        let edad:number;
        const cadena:string;
        const obj:ExampleCustomType={}
    ```
- Compartir tipos/contratos con backend cuando aplique.  
- Validaciones de forms con Zod y typesafe.

### 8. Hooks y rendimiento
- **ReactRouter:** para rutas dentro de app
- **useForm:** aprovechar estados que provee `useForm` para diferentes acciones en formularios.
- **useEffect**: declarar dependencias completas; evitar efectos con valores mutables sin memoización.  
- **useMemo / useCallback**: usar para evitar recomputaciones costosas y re-renders innecesarios; documentar cuándo no usar.  
- **React.memo**: para componentes puros que reciben props referenciales.  
- **useRef**: para valores mutables que no disparan render.  
- Evitar crear funciones/objetos inline en props cuando provoquen re-renders.

### 9. Performance y carga
- **Code-splitting** y lazy loading (React.lazy + Suspense) para rutas y componentes pesados.  
- **Virtualización** para listas largas (react-window / react-virtualized).  
- Lazy load y optimización de imágenes (srcset, formatos modernos).  
- Revisar tamaño del bundle; alertar si gzipped > 300 KB.  
- Evitar imports de librerías completas; preferir imports por función.

### 10. Accesibilidad
- `alt` en imágenes; roles y labels en controles.  
- Keyboard navigation y focus management.  
- Contraste de colores y semantic HTML.

### 11. Networking y configuración
- No hardcodear URLs; usar env vars (`VITE_API_URL`).  
- Manejo de estados: loading, empty, error.  
- Retries/backoff y timeouts en fetch cuando aplique.

### 12. Testing y CI
- Tests unitarios para hooks y utilidades críticas.  
- Tests de integración para flujos clave (login, pronóstico).  
- Lint y Prettier configurados.

## 13. Refactor y ejemplos prácticos
- **Extraer hook**: mover fetch y lógica a `useFixture` en lugar de tenerla en el componente.  
- **Composición**: dividir componentes grandes en presentational + container.  
- **Memoización**: ejemplo de uso de `useMemo` para cálculos costosos:
```ts
const computed = useMemo(() => expensiveCalc(items), [items]);
```

## 14. COMANDO DE EJECUCION E INSTALACION
### Ejemplo:
```bash
   pnpm install
   pnpm dev
```

### 15. Analisis de versiones de dependencias
- **OBLIGACION:** siempre que se quiera instalar dependencias, hacer un `search` profundo de X dependencia y siempre usar la ultima version.
- Analizar funciones, objetos deprecados para evitar usarlos.
- Evitar siempre que sea posible instalaciones locales o globales usando `pnmp dlx`

### 16. REGLAS DE REACT Y BUENAS PRACTICAS
- **Limite de useEffects:** No permitirse mas de 3 use effectos por archivo.
- **useMemo:** No abusar de useMemo(), solo en ocaciones coherentes y necesarias.
- **useCallback:** usar useCallback() para evitar re-render de una misma instancia.
- **react.memo:** Considerar su uso para evitar render en los componentes hijos.
- **useReducer:** Crear de forma aislada en caso de tenes estados complejos
- **CustomHooks** Custom hooks que cumplan la logica coherente y que es reutilizable en cierto contexto.
- **Provider:** Considerar su uso para cuestiones de contextos aislados.
- **Sobre extencion de archivos:** Las extenciones de archivos seran ".tsx" si hay minimamente patrones/señales de uso de prop "children" funciones nativas de react(useState, useEffect, etc) en la logica interna, sino, seran simplemente '.ts'.

### 17. REGLAS DE BUENAS PRACTICAS DE TYPESCRIPT
- Crear Types cuando lo que se busca crear como contrato no lo logre una interface nativa. 
- No crear ni repetir mismas firmas redundantemente, si es posible usar los `Omit` o similares, para tomar mismos tipos de propiedades. 
- Aprovechar Genericos para mejor flexibilidad.
- Ordenar y modularizar las firmas/contratos de manera cohernete y optima
- uso de `enum` para evitar errores de escritura en valores con strings sueltos y muy repetidos en el proyecto.

### 18. REGLAS GENERALES
- ejecutar `node --version` y verificar estado de actualizacion
- ejecutar `vite --version` para saber su version si ya esta instalada antes de intentar reinstalar.
- examinar la version de `node` con el framework y demas técnologias utiizados en proyecto, para evitar incompatibilidades
- **Evitar reinventar la rueda:** Antes de crear una logica compleja que una dependencia puede resolver, explicar motivo de sugerencia.
- Luego de instalar, hacer el `pnpm audit`
- **Revision de dependencias:** reveer en dependencias y sus sub-dependencias que en sus `package.json` en los `scripts` no existan comandos sospechosos como `curl`, `wdget` o similares que sea comando por via red, si es asi, evitar la ejecucion y documentarmelo.
- Siempre usar los comandos de instalacion del framwork de manera "estandar" y "recomendada" seguún la documentación. por ejemplo: ejecutar comando de `pnpm dlx create vite@latest .` para crear proyecto con carpetas mas configuraciones preestablecidas por defecto en vite.
- Evitar codigo spagetti.
- Asegurar optimizacion y escalabilidad.
- aplica comentarios en codigo en primera persona forma humana, que expliquen logica en:
    - funciones 
    - variables 
    - array
    - operaciones/logica compleja dentro de cualquier bloque
    - objetos 
de froma clara y breve que permita entender a el resto.
- Nombrar variables, objetos, funciones etc siempre en ingles pero manteniendo coherencia ejemplo:
    - Una funcion es un verbo, debe ser coherente con lo que hace
    - Una interfaz define una estructura de datos, debe ser coherente y debe iniciar con "I" ej: `IDataUser`
    - Un type define un tipo de dato especifico, debe ser coherente y debe iniciar con "T" ej: `TDataUser`