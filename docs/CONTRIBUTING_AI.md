# Contributing with AI

## Purpose

This guide explains how AI-assisted contributors should work in this repository.

## Mindset

This is a commercial financial operations portal built on top of MifosX and Apache Fineract. Contributors must optimize for compatibility, maintainability, and reusable product value.

## Before Coding

Answer:

1. What business problem is being solved?
2. Which users benefit?
3. Which existing module already supports part of this?
4. Which Fineract API or report is used?
5. What existing workflow could break?
6. What is the smallest safe PR?

## Coding Rules

- Keep changes small.
- Reuse existing modules and services.
- Do not rewrite the app.
- Do not bypass existing auth, tenant, or permission behavior.
- Do not add customer-specific code.
- Do not mix dependency upgrades with feature work.
- Do not introduce unused abstractions.
- Do not make unrelated formatting changes.

## Pull Request Requirements

Every PR must include business purpose, scope, out-of-scope items, Fineract compatibility notes, changed files, APIs used, tests run, known limitations, and screenshots for UI changes.

## Human Review

AI may propose and implement. Humans approve architecture decisions, business logic decisions, financial workflow changes, sensitive changes, and merge readiness.

## Done Means

A contribution is not done until it satisfies `docs/DEFINITION_OF_DONE.md`.
