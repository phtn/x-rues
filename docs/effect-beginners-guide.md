# Effect Library: A Beginner's Guide

This guide provides a gentle introduction to using the Effect library in a React/Next.js project. It focuses on practical, minimal implementations to help you get started without overwhelming complexity.

## Why Effect?

Effect is a powerful TypeScript library for handling asynchronous operations, errors, and side effects in a type-safe way. Benefits include:

- Strong typing for errors and results
- Built-in retry and timeout mechanisms
- Composable operations
- Testable code with fewer side effects

## Start Small: Focus on One Use Case

Rather than trying to use Effect everywhere at once, pick a single, isolated feature to implement first:

1. **API Requests**: This is often the easiest place to start since API calls have clear inputs and outputs, plus obvious error cases.

2. **Form Validation**: Another good candidate where you can benefit from Effect's error handling.

## Practical First Steps

### 1. Simple API Request with Effect

```typescript
// src/hooks/use-effect-api.ts
import { Effect } from "effect";
import { apiEffect } from "@/lib/effect/api";
import React from "react";

// A simple hook to fetch data using Effect
export function useEffectApi<T>(url: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    
    // Create the Effect
    const fetchEffect = apiEffect<T>(url);
    
    // Run the Effect
    Effect.runPromise(fetchEffect)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  return { data, error, isLoading };
}
```

### 2. Use It in a Component

```tsx
// src/components/user-profile.tsx
import { useEffectApi } from "@/hooks/use-effect-api";

type User = {
  id: string;
  name: string;
  email: string;
};

export function UserProfile({ userId }: { userId: string }) {
  const { data: user, error, isLoading } = useEffectApi<User>(`/api/users/${userId}`);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Learning Path

As you get comfortable with these basics, you can gradually expand:

### 1. Add Retry Logic

Once basic API calls work, add retry logic for flaky endpoints:

```typescript
import { withIdempotentRetry } from "@/lib/effect/retry";

// In your hook or service
const fetchWithRetry = apiEffect<T>(url).pipe(
  withIdempotentRetry
);
```

### 2. Compose Multiple Effects

When you need data from multiple sources:

```typescript
const fetchUserAndPosts = Effect.gen(function* (_) {
  const user = yield* _(apiEffect<User>(`/api/users/${userId}`));
  const posts = yield* _(apiEffect<Post[]>(`/api/users/${userId}/posts`));
  
  return { user, posts };
});
```

### 3. Error Recovery

Add fallbacks for specific error cases:

```typescript
const fetchUserWithFallback = apiEffect<User>(`/api/users/${userId}`).pipe(
  Effect.catchTag("NetworkError", () => 
    // Try a backup API or return cached data
    apiEffect<User>(`/api/backup/users/${userId}`)
  )
);
```

## Common Patterns

### API Request Pattern

```typescript
// 1. Define your data type
type ApiResponse = { /* your data structure */ };

// 2. Create the effect
const myApiEffect = apiEffect<ApiResponse>('/api/endpoint');

// 3. Add any transformations or error handling
const processedEffect = myApiEffect.pipe(
  Effect.map(data => /* transform data */),
  Effect.catchTag("HttpError", (error) => /* handle specific error */)
);

// 4. Run the effect
Effect.runPromise(processedEffect)
  .then(result => /* handle success */)
  .catch(error => /* handle error */);
```

### Form Submission Pattern

```typescript
// 1. Define your form data and validation
const validateForm = (data: FormData) => 
  Effect.try({
    try: () => {
      // Validation logic
      if (!data.email) throw new Error("Email is required");
      return data;
    },
    catch: (error) => new ValidationError(String(error))
  });

// 2. Create submission effect
const submitForm = (data: FormData) => 
  validateForm(data).pipe(
    Effect.flatMap(validData => 
      apiEffect('/api/submit', {
        method: 'POST',
        body: JSON.stringify(validData)
      })
    )
  );

// 3. Run the effect
Effect.runPromise(submitForm(formData))
  .then(() => /* success handling */)
  .catch(error => /* error handling */);
```

## Practical Tips

- **Don't rewrite everything**: Add Effect to new code or when refactoring problematic areas.
- **Keep it simple**: Start with the basic pattern (create Effect → run Effect → handle result).
- **Use TypeScript**: Effect works best with TypeScript, so leverage type checking.
- **Isolate Effect code**: Keep Effect-based logic in dedicated files/functions at first.
- **Learn incrementally**: Master the basics before diving into advanced features.

## Documentation Resources

When you're ready to learn more:

1. [Effect Documentation](https://effect.website/docs/introduction) - Start with the basics
2. [Effect Examples](https://effect.website/docs/examples/introduction) - See practical examples
3. [Effect API Reference](https://effect.website/api/effect/Effect) - Detailed API documentation

## Glossary of Common Effect Terms

- **Effect**: A description of a computation that may fail, succeed, and use some context.
- **Pipe**: A method to chain operations on an Effect.
- **Layer**: A description of how to build a service or resource.
- **Schema**: A description of data structure with validation.
- **Tag**: A unique identifier for a service or resource.
- **Context**: The environment an Effect needs to run.