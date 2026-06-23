# Playwright Test Automation

End-to-end test suite built with [Playwright](https://playwright.dev/).

## Project Structure

```
playwright-tests/
├── tests/e2e/       # Test specs organized by feature
├── pages/           # Page Object Models
├── fixtures/        # Custom Playwright fixtures
├── utils/           # Shared helpers and utilities
└── playwright.config.ts
```

## Getting Started

```bash
npm install
npx playwright install
```

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Step through tests with inspector |
| `npm run test:report` | Open last HTML report |
