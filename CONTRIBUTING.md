# Contributing to Portfolio Tracker

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

---

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript/Preact styleguides
* Include appropriate test cases
* Update documentation as needed
* End all files with a newline

---

## Development Setup

### Prerequisites
- Node.js 16+ (18+ recommended)
- npm or yarn
- Git

### Getting Started

1. Fork the repository
```bash
git clone https://github.com/YOUR-USERNAME/portfolio-tracker.git
cd portfolio-tracker
```

2. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

3. Install dependencies
```bash
npm install
```

4. Start development server
```bash
npm run dev
```

5. Make your changes and test

6. Commit with clear messages
```bash
git commit -am "Add clear description of changes"
```

7. Push to your fork
```bash
git push origin feature/your-feature-name
```

8. Create a Pull Request

---

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  * 🎨 when improving the format/structure of the code
  * 🚀 when improving performance
  * 📝 when writing docs
  * 🐛 when fixing a bug
  * ✨ when adding a feature
  * 🔒 when dealing with security
  * ♻️ when refactoring code
  * 💚 when fixing the CI build
  * ⬆️ when upgrading dependencies
  * ⬇️ when downgrading dependencies

### TypeScript Styleguide

* Use `const` by default, `let` if reassignment needed, avoid `var`
* Use arrow functions for callbacks
* Use explicit return types on functions
* No `any` types - use proper typing
* Use interfaces over types where appropriate
* Use descriptive variable names

```typescript
// Good
const calculateGain = (current: number, cost: number): number => {
  return current - cost;
};

// Bad
const calc = (c: any, co: any) => c - co;
```

### Component Structure

```typescript
// Props interface
interface ComponentProps {
  holdings: Holding[];
  onUpdate: (holding: Holding) => void;
}

// Component
export function MyComponent({ holdings, onUpdate }: ComponentProps) {
  // State
  const [state, setState] = useState<string>('');
  
  // Effects
  useEffect(() => {
    // initialization
  }, []);
  
  // Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### CSS Styleguide

* Use CSS variables for colors and sizing
* Use semantic class names
* Mobile-first responsive design
* Group related properties together
* Use BEM naming where appropriate

```css
/* Good */
.holding-card {
  padding: var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--border-radius);
}

.holding-card__symbol {
  font-weight: bold;
  color: var(--color-primary);
}

/* Bad */
.hc { padding: 10px; background: #fff; }
.symbol { color: blue; }
```

---

## Testing Requirements

All new features must include tests:

### Unit Tests
```typescript
// Use vitest
import { describe, it, expect } from 'vitest';
import { calculateGain } from './analytics';

describe('analytics', () => {
  it('calculates gain correctly', () => {
    expect(calculateGain(180, 150)).toBe(30);
  });
});
```

### Component Tests
```typescript
import { render, screen } from '@testing-library/preact';
import { Holdings } from './Holdings';

test('renders holdings', () => {
  render(<Holdings holdings={[]} />);
  expect(screen.getByText('Holdings')).toBeInTheDocument();
});
```

### Coverage Targets
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

Run tests:
```bash
npm run test              # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

---

## Documentation

When adding features, update relevant documentation:

* **Code comments** - Explain the "why", not the "what"
* **README.md** - Update feature list if needed
* **FEATURES.md** - Add detailed feature documentation
* **API docs** - Document new endpoints
* **Type definitions** - Keep TypeScript types accurate

Good documentation example:
```typescript
/**
 * Calculates Sharpe Ratio for a portfolio
 * 
 * Sharpe Ratio = (Return - Risk Free Rate) / Volatility
 * Used to measure risk-adjusted returns
 * 
 * @param returns Array of period returns (decimal)
 * @param riskFreeRate Risk-free rate (typically 2-3%)
 * @returns Sharpe ratio value
 * @throws Error if returns array is empty
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }
  // implementation
}
```

---

## Review Process

1. **Automated Checks**
   - Tests must pass
   - Linting must pass
   - Coverage targets must be met

2. **Code Review**
   - At least 1 approval required
   - Maintainers will review for:
     - Code quality
     - Performance impact
     - Security implications
     - Documentation completeness

3. **Merge**
   - Squash commits if many small commits
   - Use descriptive merge message
   - Delete branch after merge

---

## Performance Considerations

When submitting code:

* Minimize bundle size impact
* Avoid unnecessary re-renders in components
* Use memoization where appropriate
* Optimize database queries
* Consider memory usage for large datasets

```typescript
// Good - memoized component
const HoldingsTable = memo(({ holdings }: Props) => {
  return <table>{/* ... */}</table>;
}, (prev, next) => {
  return prev.holdings === next.holdings;
});

// Bad - unnecessary re-renders
const HoldingsTable = ({ holdings }: Props) => {
  return <table>{/* ... */}</table>;
};
```

---

## Security Guidelines

* Never commit secrets (API keys, passwords)
* Use environment variables for sensitive data
* Validate all user inputs
* Sanitize data before display
* Review dependencies for vulnerabilities
* Follow OWASP guidelines

```typescript
// Good - validated input
function addHolding(symbol: string, quantity: number) {
  if (!symbol || symbol.length > 5) throw new Error('Invalid symbol');
  if (quantity <= 0) throw new Error('Invalid quantity');
  // proceed
}

// Bad - no validation
function addHolding(symbol: any, quantity: any) {
  // proceed immediately
}
```

---

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag `v{version}`
4. Push to main branch
5. Create GitHub release
6. Deploy to production

---

## Getting Help

* **Documentation:** Check FEATURES.md and README.md
* **Issues:** Search existing issues first
* **Discussions:** Use GitHub Discussions for questions
* **Direct:** Email maintainers@portfolio-tracker.dev

---

## Appreciation

Your contributions make Portfolio Tracker better for everyone. Thank you! 🙏

---

*Last Updated: May 23, 2026*
