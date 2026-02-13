# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-13

### Added

#### Core Features
- **Blip Submission Form**: Complete form with validation for submitting technology radar blips
- **Prior Radar Lookup**: Automatic search of 33 historical radar volumes (2010-2025)
- **Real-Time LLM Coaching**: Integration with Anthropic Claude Sonnet 4.5 for submission guidance
- **Ring-Specific Validation**: Dynamic validation based on selected adoption ring
  - Adopt: Requires 2+ client examples
  - Trial: Requires 1+ client example
  - Caution: Requires detailed reasoning
  - Assess: Description only
- **Prior Radar Options**: Four submission types when match found (reblip, move, update, new)
- **Markdown Rendering**: Properly formatted AI coaching with headings, lists, and emphasis

#### Backend Services
- **Radar Matcher**: Intelligent matching with Levenshtein algorithm (85% threshold)
- **Storage Service**: JSON file storage with concurrency protection and atomic writes
- **Validation Service**: Comprehensive input validation and sanitization
- **LLM Coaching Service**: Secure Anthropic API integration with prompt injection defense
- **Express API**: RESTful endpoints for all operations
  - `/api/health` - Health check
  - `/api/prior-radar-lookup` - Search prior radars
  - `/api/coaching` - Get LLM coaching
  - `/api/submit` - Submit blips
  - `/api/stats` - Storage statistics

#### Security
- XSS prevention (HTML sanitization, entity decoding)
- SQL/NoSQL injection protection
- Prompt injection defense for LLM
- Helmet.js security headers
- CORS configuration
- Input length validation

#### Testing
- 73 backend tests with 70%+ coverage
- Unit tests for all services
- Security tests (XSS, SQL injection, prompt injection)
- Resilience tests (LLM unavailability, network errors)
- Concurrency tests (10 simultaneous writes)
- Performance tests (<2s radar lookup)

#### Documentation
- Complete README with quickstart
- Deployment guide (DEPLOYMENT.md)
- User guide (USER_GUIDE.md)
- Contributing guidelines (CONTRIBUTING.md)
- Security policy (SECURITY.md)
- Full specification (tech-radar-spec.md v1.2)

#### DevOps
- Docker containerization (multi-stage build)
- docker-compose.yml for easy deployment
- GitHub Actions CI/CD
  - Automated testing on push/PR
  - Docker image building
  - Security scanning (CodeQL, Trivy)
  - Dependency audits
- ESLint configuration
- TypeScript configuration

#### UI/UX
- Thoughtworks branding (pink/purple gradient)
- Responsive design (375px - 1920px viewports)
- Accessible forms with ARIA labels
- Loading states and error messages
- Success confirmation flow
- Character counters
- Dynamic field visibility

### Technical Details

#### Stack
- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js 20, Express, TypeScript
- **LLM**: Anthropic Claude Sonnet 4.5
- **Storage**: JSON with file locking
- **Testing**: Jest, React Testing Library
- **Markdown**: marked library

#### Dependencies
- `@anthropic-ai/sdk`: ^0.32.1
- `express`: ^4.18.2
- `react`: ^18.2.0
- `marked`: ^12.0.0
- `helmet`: ^7.1.0
- `cors`: ^2.8.5
- `zod`: ^3.22.4

### Performance
- Radar lookup: <2 seconds
- LLM coaching: <3 seconds (with loading state)
- Page load: <1 second
- 33 radar volumes bundled at build time

### Known Limitations
- No user authentication (MVP scope)
- No blip editing/deletion (submission-only)
- JSON file storage (not database)
- Concurrency protection for <5 simultaneous users
- No submission tracking/reference numbers

## [Unreleased]

### Planned Features
- User authentication (OAuth, SAML)
- Blip management (edit, delete, search)
- Database migration (PostgreSQL, MongoDB)
- Email notifications
- Export functionality (CSV, JSON)
- Analytics dashboard
- Configurable quadrants/rings
- Multiple LLM provider support
- Rate limiting
- Audit logging

---

## Version History

- **1.0.0** (2026-02-13): Initial release - MVP with all core features

---

For detailed commit history, see [GitHub Commits](https://github.com/thoughtworks/tech-radar-blip-submission/commits/main)
