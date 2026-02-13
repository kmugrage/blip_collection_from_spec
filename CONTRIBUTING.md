# Contributing to Technology Radar Blip Submission

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Standards](#code-standards)
- [Project Structure](#project-structure)

## Code of Conduct

This project follows the Thoughtworks Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- An Anthropic API key (for LLM features)

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tech-radar-blip-submission.git
   cd tech-radar-blip-submission
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your ANTHROPIC_API_KEY to .env
   ```

5. **Fetch radar data:**
   ```bash
   npm run fetch-radar-data
   ```

6. **Run tests to verify setup:**
   ```bash
   npm test
   ```

7. **Start development servers:**
   ```bash
   # Terminal 1: Backend
   source .env && npm run dev:server

   # Terminal 2: Frontend
   npm run dev:client
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in logical, atomic commits
2. Write or update tests for your changes
3. Ensure all tests pass: `npm test`
4. Update documentation as needed

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

Examples:
```
feat(coaching): add custom coaching prompts
fix(validation): correct ring-specific validation for Trial
docs(deployment): update Docker instructions
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Place tests next to the code they test (e.g., `radar-matcher.test.ts` next to `radar-matcher.ts`)
- Aim for 80%+ code coverage
- Include both happy path and error cases
- Test security vulnerabilities (XSS, SQL injection, etc.)

### Test Categories

1. **Unit Tests** - Test individual functions/components
2. **Integration Tests** - Test service interactions
3. **Security Tests** - Test XSS, injection, prompt injection
4. **Resilience Tests** - Test error handling and fallbacks

## Submitting Changes

### Pull Request Process

1. **Update your branch:**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Push your changes:**
   ```bash
   git push origin your-feature-branch
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference to any related issues
   - Screenshots for UI changes
   - Test results

4. **PR Checklist:**
   - [ ] Tests pass locally (`npm test`)
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] No security vulnerabilities introduced
   - [ ] Breaking changes documented
   - [ ] Commit messages follow conventions

### Code Review

- Address all review comments
- Keep PRs focused and reasonably sized
- Be responsive to feedback
- Update tests based on review suggestions

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Provide explicit types, avoid `any`
- Use interfaces for object shapes
- Document complex type definitions

### React

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for prop types
- Follow React best practices

### Security

- Sanitize all user input
- Never use `dangerouslySetInnerHTML` without sanitization (except for trusted Markdown)
- Validate data on both frontend and backend
- Follow OWASP guidelines

### Naming Conventions

- **Files**: `kebab-case.ts`, `PascalCase.tsx` for components
- **Variables/Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Code Style

This project uses ESLint and Prettier. Run before committing:

```bash
npm run lint
```

## Project Structure

```
├── server/               # Backend (Express + TypeScript)
│   ├── index.ts         # Server entry point
│   ├── types.ts         # Shared types
│   └── services/        # Business logic
│       ├── radar-matcher.ts
│       ├── storage.ts
│       ├── validation.ts
│       └── llm-coaching.ts
├── src/                 # Frontend (React + TypeScript)
│   ├── App.tsx         # Main app component
│   ├── components/     # React components
│   └── services/       # API client
├── data/               # Data files
│   └── radar/         # Historical radar data
├── scripts/           # Build/utility scripts
└── tests/             # Test files (co-located with source)
```

## Areas for Contribution

### High Priority

- Database migration (replace JSON storage)
- User authentication
- Blip editing/management
- Search and filtering
- Export functionality

### Medium Priority

- Additional LLM providers
- Configurable quadrants/rings
- Email notifications
- Analytics dashboard
- Accessibility improvements

### Documentation

- Tutorials and guides
- API documentation
- Deployment examples
- Troubleshooting guides

### Testing

- Increase test coverage
- E2E tests
- Performance tests
- Accessibility tests

## Getting Help

- **Documentation**: See README.md and DEPLOYMENT.md
- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Email security@thoughtworks.com for security issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project README and release notes.

Thank you for contributing! 🎉
