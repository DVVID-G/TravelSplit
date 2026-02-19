# Unit Testing Examples

Framework-agnostic patterns. Adapt syntax to Jest, Vitest, or Mocha.

## Plain Function

```typescript
describe('calculateTotal', () => {
  it('should return sum when given valid numbers', () => {
    const result = calculateTotal([10, 20, 30]);
    expect(result).toBe(60);
  });

  it('should return 0 when given empty array', () => {
    const result = calculateTotal([]);
    expect(result).toBe(0);
  });

  it('should throw when given null', () => {
    expect(() => calculateTotal(null)).toThrow('items is required');
  });
});
```

## Service with Mocked Repository (NestJS-style)

```typescript
describe('UserService', () => {
  let service: UserService;
  let repo: MockRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
      ],
    }).compile();
    service = module.get(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'a@b.com' };
      repo.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
```

## React Component (Testing Library)

```typescript
describe('Button', () => {
  it('should render children and call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Submit</Button>);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Custom Hook

```typescript
describe('useCounter', () => {
  it('should return initial count and increment function', () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.count).toBe(0);

    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('should not fetch when id is undefined', () => {
    const { result } = renderHook(() => useUser(undefined));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

## Async with Error

```typescript
it('should reject when API returns 404', async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 404 });

  await expect(fetchUser('invalid-id')).rejects.toThrow(NotFoundError);
});
```
