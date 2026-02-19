---
name: unit-testing
description: Writes unit tests following industry best practices: Arrange-Act-Assert, isolation via mocking, descriptive naming, and edge case coverage. Use when creating or modifying unit tests, when asked to add tests, or when reviewing test coverage. Framework-agnostic; adapts to Jest, Vitest, Mocha, or similar.
---

# Unit Testing

## Core Principles

1. **Isolation**: Test one unit at a time. Mock external dependencies (APIs, DB, file system, time).
2. **Arrange-Act-Assert**: Structure each test in three clear phases.
3. **Behavior over implementation**: Assert outcomes and observable behavior, not internal method calls.
4. **Determinism**: Tests must be repeatable and order-independent.

## Test Structure

### Arrange-Act-Assert (AAA)

```
Arrange: Set up test data, mocks, and preconditions.
Act:     Execute the function or trigger the behavior under test.
Assert:  Verify the expected outcome.
```

Use blank lines or comments to separate phases when helpful. One logical assertion per test when possible.

### Test Naming

Use descriptive names that read as specifications:

- `should [expected behavior] when [condition]`
- `should [expected behavior] with [input]`
- `should throw [exception] when [condition]`

Write names in English. Avoid generic names like `test1`, `works`, `it works`.

### File Placement

- **Co-located**: Place test files next to source (`user.service.spec.ts` next to `user.service.ts`).
- **Or centralized**: Use a `test/` or `__tests__/` directory mirroring source structure.
- **Naming**: Match project convention (`*.spec.ts`, `*.test.ts`, `*.test.tsx`). Check existing tests first.

## Mocking

- Mock all external dependencies: repositories, HTTP clients, third-party services, file I/O.
- Use framework mocks: `jest.fn()`, `jest.mock()`, `jest.spyOn()` (Jest/Vitest) or equivalent.
- Reset mocks in `beforeEach` when tests share setup.
- Verify calls only when the interaction is part of the contract: `expect(mock).toHaveBeenCalledWith(expectedArgs)`.

## What to Test

- **Happy path**: Normal input, expected output.
- **Edge cases**: Empty arrays, null/undefined, zero, negative numbers, boundary values.
- **Error paths**: Invalid input, exceptions, rejected promises.
- **Side effects**: State changes, callbacks invoked, events emitted.

## What NOT to Test

- Implementation details (private methods, internal variable values).
- Third-party library behavior (assume it works).
- Trivial getters/setters with no logic.
- Multiple unrelated behaviors in one test.

## Checklist Before Writing

- [ ] Identify the unit under test and its dependencies.
- [ ] List dependencies to mock.
- [ ] List scenarios: happy path, edge cases, errors.
- [ ] Use AAA structure for each scenario.
- [ ] One assertion focus per test (or one logical behavior).

## Anti-Patterns

| Anti-Pattern | Instead |
|--------------|---------|
| Testing implementation details | Assert observable outcome |
| Real DB/API in unit tests | Mock external dependencies |
| Multiple behaviors in one test | Split into focused tests |
| Vague test names | Use `should X when Y` pattern |
| No cleanup (shared mutable state) | Reset mocks in `beforeEach` |
| Asserting on mock call count without reason | Assert only when it defines the contract |
| Testing private methods directly | Test via public API |

## Framework Hooks

- `beforeEach`: Setup that must run before each test (mocks, fresh instances).
- `afterEach`: Cleanup (reset mocks, clear timers).
- `beforeAll` / `afterAll`: Expensive one-time setup (use sparingly, avoid shared mutable state).

## Assertions

- Use semantic matchers: `toEqual`, `toThrow`, `toHaveBeenCalledWith`, `resolves`, `rejects`.
- Prefer `toEqual` over `toBe` for objects and arrays.
- For async: `await expect(promise).rejects.toThrow(ErrorType)` or `await expect(promise).resolves.toEqual(value)`.

## Workflow: What to Test

1. **Service/function**: Mock dependencies, call the function, assert return value or thrown error.
2. **Class method**: Instantiate with mocked dependencies, call method, assert outcome.
3. **React component**: Render with props, query by role/label, fire events, assert DOM or callbacks.
4. **Custom hook**: Use `renderHook`, trigger behavior, assert returned state or side effects.

## Describe Blocks

- Top-level `describe`: Unit under test (e.g. `describe('UserService', ...)`).
- Nested `describe`: Method or scenario (e.g. `describe('findOne', ...)` or `describe('when user not found', ...)`).
- Keep nesting shallow (max 2-3 levels) for readability.

## Additional Resources

- For framework-specific examples (Jest, Vitest, NestJS, React), see [examples.md](examples.md).

**MANDATORY** always check for problems in generated test and fix it.
