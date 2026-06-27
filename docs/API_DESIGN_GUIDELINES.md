# API Design Guidelines

## Purpose

Keep frontend API usage clean, reusable, and compatible with Apache Fineract.

## Do

- Use relative URLs for Fineract API calls where possible.
- Let interceptors apply base URL, tenant header, and auth header.
- Put API calls inside services.
- Add typed interfaces for new response shapes.
- Handle loading, empty, and error states.
- Keep transformations testable.

## Do Not

- Hardcode full API URLs in components.
- Duplicate tenant/auth headers in every service.
- Put API calls directly inside visual-only components.
- Mix external API behavior into Fineract services.

## Service Design

A service should have a clear purpose, such as dashboard summaries, risk signals, or collection queues.

Avoid generic catch-all services.

## Write Actions

Write actions require extra review if they affect loan state, savings state, client records, group records, accounting records, or maker-checker tasks.

## API Review Checklist

1. Which endpoint is used?
2. Is it read-only or write?
3. Which permission controls it?
4. Is tenant behavior preserved?
5. Are errors handled?
6. Is the response typed?
7. Can the same service be reused elsewhere?
