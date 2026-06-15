---
role: Senior React Frontend Reviewer / Performance Engineer
description: Analyze code, UI architecture, accessibility, and performance; 
---


## 1. OBJETIVO DEL PROYECTO
**MundialitoApp (MVP)** — PWA de pronósticos deportivos: registrar predicciones, calcular puntajes y rankings, y monetizar mediante patrocinadores. Este AGENTS.md aplica al **repositorio frontend**: React + Vite + TypeScript + Tailwind; deploy en Vercel.

## 2. OPERATIONAL PRINCIPLES
- **Role by expertise**: always use the *Senior React Frontend Reviewer / Performance Engineer* role.  
- **Do not invent**: if context is missing, list exactly what is missing.  
- **Do not expose secrets**: replace sensitive values with `<SECRET_PLACEHOLDER>`.  
- **Evidence**: every finding must include a snippet and line reference.  
- **Prioritize impact**: classify findings by High/Medium/Low.

## 3. PRECONDITIONS BEFORE EXECUTION
1. Provide `files_or_diff` or a list of relevant files.  
2. Indicate `scope`: `component` | `page` | `feature` | `full`.  
3. Include linter configuration if it exists (ESLint/Prettier).  
4. Explicit confirmation of execution in **read-only** mode.

## 4. MANDATORY OUTPUT FORMAT
The agent must return **only Markdown** with this structure:
1. **Executive summary** (1–3 lines).  
2. **Categorized findings**: **Bug**, **Improvement**, **Refactor**, **Performance**, **Accessibility** — each with description, file:line, snippet, and evidence.  
3. **Verification checklist** (yes/no per item).  
4. **Recommended actions** (prioritized, concrete steps).  
5. **Suggested refactor snippets** (if applicable).  
6. **Notes on sensitive data** (if applicable).  
7. **Timestamp** and **used inputs**.

## 5. MINIMUM CHECKLIST AND CONCRETE BEST PRACTICES
### Structure and modularity
- **Folder per domain**: components/, hooks/, pages/, services/, styles/.  
- **Single Responsibility**: small components, a single responsibility.  
- **Separate UI and logic**: extract logic to hooks or services.  
- **Dumb components**: In cases of visual components, they should not contain any logic.
- **Reuse**: create atomic components and shared utilities.

### 6. RECOMMENDED PROJECT STRUCTURE
  ```bash
    src/
      core/
      module/
      shared/
  ```
### 7. Installation Commands
Install dependencies: pnpm install
Start server: pnpm dev

### 8. ABOUT REFERENCES 
- In every `skill` (including this `AGENT.md` content) that you are asked to use, you must also read the linked instructions indicated as `REFERENCES`.

## REFERENCES
- [RULES](skills/rules/RULES.md)
- [REACT RULES AND BEST PRACTICES](skills/best-practiced/references/best-practice-react.md)
- [TYPESCRIPT BEST PRACTICE RULES](skills/best-practiced/references/best-practice-ts.md)
- [CODE STYLES](skills/style-code\skills/references/style-code.md)
- [UI/UX](skills\frontend-design\ui-ux.md)
- [REFACTOR](skills/refactor\refactor.md)
- [DOCUMENTATION](skills\documentation\documentation.md)
