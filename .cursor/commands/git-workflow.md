---
name: /git-workflow
id: git-workflow
category: Git
description: Analyzes the workflow, creates a branch if it's a new feature, makes standard commits and pushes to remote.
triggers:
  - "commit"
  - "push"
  - "feature"
  - "branch"
  - "git workflow"
---

**Guardrails**
- Only execute git commands if there are changes to commit
- Do not force push if there are potential conflicts
- Use descriptive and standard commit messages
- Verify git status before each operation
- Do not commit if the working directory is clean
- **ALWAYS ask for user approval before creating commits**
- If the user rejects the message, offer option to modify or cancel
- Handle git errors descriptively and do not continue if there are critical errors
- **By default, create atomic and detailed commits** (one commit per logical group of changes)
- If the user explicitly requests atomic commits, split changes into multiple commits

**Steps**

1. **Verify initial Git status:**
   - Execute `git status --short` to see uncommitted changes in compact format
   - Execute `git branch --show-current` to get current branch
   - Execute `git log --oneline -1` to see last local commit
   - Execute `git status -sb` to see relationship with remote (ahead/behind)
   - If there are no changes in working directory or staged, inform the user and terminate

2. **Determine if it's a new or existing feature:**
   - Get current branch with `git branch --show-current`
   - Verify if the branch exists in remote: `git ls-remote --heads origin [current-branch]`
   - **NEW FEATURE if:**
     - Current branch is `main`, `master`, `develop`, `dev` or `staging`
     - Current branch does not exist in remote AND does not start with `feature/`
     - Current branch does not start with `feature/`, `fix/`, `hotfix/`, `refactor/`
   - **EXISTING FEATURE if:**
     - Current branch starts with `feature/`, `fix/`, `hotfix/`, `refactor/`
     - Branch exists in remote (even if it doesn't have local commits without push)

3. **If it's a NEW FEATURE:**
   - Analyze modified files with `git diff --name-only` and `git diff --stat`
   - Generate feature name automatically based on:
     - Modified file names (extract keywords)
     - Modified directories (e.g.: `modules/users` → `user-management`)
     - If it cannot be inferred, use format: `feature-[timestamp]` or ask the user
   - Create new branch: `git checkout -b feature/[feature-name]` (use kebab-case, no spaces)
   - **ANALYZE ALL CHANGES FOR ATOMIC COMMITS:**
     - Group files by logical change type (use step 5)
     - Generate commit message for EACH group using step 5.1
     - Store all groups with their proposed messages in a list
   - **SHOW ALL PROPOSED COMMITS AT ONCE:**
     - Display all proposed commits in a numbered list format:
       ```
       📝 Proposed commits (will be created in this order):
       
       1. [type(scope): brief description]
          Files: [list of files]
          Message:
          [full commit message with body]
       
       2. [type(scope): brief description]
          Files: [list of files]
          Message:
          [full commit message with body]
       
       ... (continue for all groups)
       ```
     - **REQUEST GLOBAL APPROVAL:**
       - Ask: "Do you approve all these commits? (yes/no/modify)"
       - If user approves (yes/y/ok): proceed to create all commits
       - If user wants to modify (modify/m): 
         - Ask: "Which commit number(s) do you want to modify? (e.g., 1, 3-5, or 'all')"
         - For each selected commit, ask for the new message
         - Show updated list and ask for approval again
       - If user rejects (no/n/cancel): cancel operation and terminate
   - **CREATE ALL COMMITS:**
     - For each approved group (in order):
       - Add files from the group: `git add [group-files]`
       - Create commit: `git commit -m "[approved-message]"`
   - Verify if remote is configured: `git remote -v`
   - If remote exists, push the new branch: `git push -u origin feature/[feature-name]`
   - If no remote, inform that commits are ready but remote needs to be configured
   - Inform user: "✅ Feature branch created: feature/[feature-name] | Commits: [number] | Push successful" (or only commits if no remote)

4. **If it's an EXISTING FEATURE:**
   - Get current branch name
   - **ANALYZE ALL CHANGES FOR ATOMIC COMMITS:**
     - Group files by logical change type (use step 5)
     - Generate commit message for EACH group using step 5.1
     - Store all groups with their proposed messages in a list
   - **SHOW ALL PROPOSED COMMITS AT ONCE:**
     - Display all proposed commits in a numbered list format:
       ```
       📝 Proposed commits (will be created in this order):
       
       1. [type(scope): brief description]
          Files: [list of files]
          Message:
          [full commit message with body]
       
       2. [type(scope): brief description]
          Files: [list of files]
          Message:
          [full commit message with body]
       
       ... (continue for all groups)
       ```
     - **REQUEST GLOBAL APPROVAL:**
       - Ask: "Do you approve all these commits? (yes/no/modify)"
       - If user approves (yes/y/ok): proceed to create all commits
       - If user wants to modify (modify/m): 
         - Ask: "Which commit number(s) do you want to modify? (e.g., 1, 3-5, or 'all')"
         - For each selected commit, ask for the new message
         - Show updated list and ask for approval again
       - If user rejects (no/n/cancel): cancel operation and terminate
   - **CREATE ALL COMMITS:**
     - For each approved group (in order):
       - Add files from the group: `git add [group-files]`
       - Create commit: `git commit -m "[approved-message]"`
   - Verify if there are local commits without push: `git status -sb` (look for "ahead")
   - Verify if remote is configured: `git remote -v`
   - If remote exists, push: `git push` (without -u since branch already exists)
   - If no remote, inform that commits are ready but remote needs to be configured
   - Inform user: "✅ Commits made in [current-branch]: [number] commits | Push successful" (or only commits if no remote)

5. **Grouping changes for atomic commits:**
  - Analyze modified files with `git diff --name-only` and `git diff --stat`.
  - Group files by logical change type:
    - **Group 1 - Dependencies:** `package.json`, `package-lock.json`, dependency configuration files.
    - **Group 2 - Configuration/Styles:** `tailwind.config.ts`, `*.css`, `index.html`, build configuration files.
    - **Group 3 - Services/API:** Files in `services/`, `api/`, `utils/` related to business logic.
    - **Group 4 - Components:** Files in `components/`, updates to existing components.
    - **Group 5 - Pages/Views:** Files in `pages/`, `views/`, new pages or views.
    - **Group 6 - Routing/Navigation:** Files in `routes/`, `router/`, `App.tsx` (routing configuration).
    - **Group 7 - Documentation:** Files in `docs/`, `openspec/`, `README.md`, `.md` files.
    - **Group 8 - Tests:** Files in `test/`, `__tests__/`, `*.test.ts`, `*.spec.ts`.
    - **Group 9 - Others:** Files that don't fit in the previous groups.
  - If a file can belong to multiple groups, prioritize by:
    1. If it's a new file → most specific group.
    2. If it's a modification → main functionality group.
  - Create one commit per group that has files.

5.1. **Standard commit message generation:**
  - For each group of files, analyze the change type.
  - Determine commit type:
    - `feat`: New files in `modules/`, `components/`, `pages/`, new endpoints, new features.
    - `fix`: Bug fixes, errors, validations.
    - `refactor`: Restructuring without functionality change, code improvements.
    - `docs`: Documentation changes, README, comments, OpenSpec.
    - `style`: Formatting, linting, spaces, visual changes without logic (CSS, Tailwind config).
    - `test`: Add or modify tests.
    - `chore`: Build, dependencies, tool configurations.
  - Determine scope based on:
    - Main directory modified (e.g.: `modules/users` → `users`).
    - Main component (e.g.: `components/Button.tsx` → `button`).
    - Functional area (e.g.: `pages/RegisterPage.tsx` → `auth`).
  - Generate brief description (maximum 50 characters) based on:
    - New files created.
    - Main functionality modified.
    - Most significant changes in the group.
  - Add commit body with details (optional but recommended):
    - List main files modified.
    - Describe key changes in bullet points.
    - Format: `- Change description`.
  - Final format:

    ```bash
    type(scope): brief description
    
    - Change detail 1
    - Change detail 2
    - Change detail 3
    ```

  - Examples:
    - `chore(frontend): add dependencies for form validation and state management`
    - `style(frontend): configure Tailwind with design system colors and fonts`
    - `feat(auth): add user registration page with form validation`
    - `refactor(components): update Input and Button to match design system`
    - `docs(openspec): update tasks checklist for registration feature`

6. **Error handling:**
   - If `git checkout -b` fails (branch already exists), inform and suggest using existing branch
   - If `git push` fails due to conflicts, inform and DO NOT force push
   - If `git push` fails due to missing upstream, use `git push -u origin [branch]`
   - If there are permission or remote errors, inform the user clearly
   - If the working directory has merge conflicts, inform and DO NOT continue

**References**
- Use `git diff --name-only` to see modified files
- Use `git diff --stat` to see change summary
- Use `git status -sb` to see relationship with remote
- Verify remote with `git remote -v` before push
- Use `git log --oneline -5` to see context of recent commits

