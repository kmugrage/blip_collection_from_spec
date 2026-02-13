# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please send an email to:

**security@thoughtworks.com**

Include the following information:

- Type of vulnerability
- Full description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You should receive a response within **48 hours**.

## Security Measures

This application implements multiple security layers:

### Input Validation & Sanitization

- All user input is sanitized before processing
- XSS prevention through HTML tag removal and entity encoding
- SQL/NoSQL injection prevention via parameterized queries
- Input length limits enforced

### LLM Security

- **Prompt injection defense**: Clear delimiters between system prompts and user content
- **Output sanitization**: LLM responses treated as untrusted and sanitized
- **No code execution**: LLM has no access to tools, APIs, or system commands
- **Explicit instructions**: System prompt instructs LLM to ignore embedded directives

### API Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting (recommended for production)
- HTTPS/TLS enforcement (via reverse proxy)

### Data Security

- Sensitive data (API keys) stored in environment variables
- No user passwords (no authentication in v1)
- Submission data access controlled
- File-based storage with atomic writes

### Dependency Management

- Regular dependency audits (`npm audit`)
- Automated security scanning in CI/CD
- Dependency updates reviewed for security implications

## Security Best Practices for Deployment

### Production Environment

1. **Use HTTPS**: Deploy behind reverse proxy with valid SSL/TLS certificate
2. **Secure API Key**: Store `ANTHROPIC_API_KEY` in secure secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
3. **Restrict CORS**: Set `ALLOWED_ORIGINS` to specific domains
4. **Enable Rate Limiting**: Prevent abuse (not included in MVP, see deployment guide)
5. **Monitor Logs**: Watch for suspicious activity
6. **Regular Updates**: Keep dependencies up to date

### Environment Variables

Never commit `.env` files to version control. Use:
- Environment variables in production
- Secrets management services
- Encrypted configuration

### Network Security

- Expose only necessary ports (3001 or your configured port)
- Use firewall rules
- Deploy in private network with reverse proxy
- Use VPC/security groups in cloud deployments

## Known Limitations

### MVP Scope

This is an MVP release. The following are **not implemented** but recommended for production:

1. **Authentication**: No user authentication (v1)
2. **Authorization**: No role-based access control
3. **Rate Limiting**: No built-in rate limiting
4. **Audit Logging**: Basic logging only
5. **Encryption at Rest**: Data stored as plain JSON

### Planned Security Enhancements

For future versions:
- User authentication (OAuth, SAML)
- Role-based access control
- Audit logging
- Rate limiting
- Data encryption at rest
- IP allowlisting
- 2FA support

## Security Testing

The application includes security tests:

```bash
npm test
```

Tests cover:
- XSS prevention
- SQL injection prevention
- Prompt injection defense
- Input sanitization
- CSRF protection

### Running Security Audit

```bash
# Check for vulnerable dependencies
npm audit

# Check for high/critical vulnerabilities
npm audit --audit-level=high

# Fix automatically (if safe)
npm audit fix
```

## Responsible Disclosure

We appreciate the security research community's efforts. If you follow responsible disclosure:

1. **Private Notification**: Report privately, not publicly
2. **Reasonable Time**: Give us time to fix (typically 90 days)
3. **Good Faith**: Don't access/modify user data, disrupt service, or harm privacy
4. **Communication**: Stay in touch for updates and fixes

We will:
- Acknowledge receipt within 48 hours
- Provide estimated fix timeline
- Keep you updated on progress
- Credit you in release notes (if desired)
- Not take legal action against good-faith security researchers

## Security Updates

Security updates are released as:
- **Patch versions** (1.0.x) for low/medium severity
- **Minor versions** (1.x.0) for high severity
- **Hotfixes** for critical vulnerabilities

Subscribe to GitHub releases or watch the repository to receive security notifications.

## Contact

For security concerns:
- **Email**: security@thoughtworks.com
- **PGP Key**: [Link to PGP key if available]

For general issues:
- **GitHub Issues**: https://github.com/thoughtworks/tech-radar-blip-submission/issues

---

Last Updated: 2026-02-13
