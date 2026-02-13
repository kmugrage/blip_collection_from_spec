# Release Checklist

Use this checklist when preparing a new release.

## Pre-Release

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code coverage meets threshold (70%+)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] TypeScript compilation successful
- [ ] Frontend builds without errors (`npm run build:client`)
- [ ] Backend builds without errors (`npm run build:server`)

### Testing
- [ ] Manual testing completed on all major features
- [ ] Prior radar lookup works with various inputs
- [ ] AI coaching provides relevant feedback
- [ ] Form validation catches errors appropriately
- [ ] Submission flow completes successfully
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive design verified
- [ ] Accessibility tested (keyboard navigation, screen readers)

### Documentation
- [ ] README.md updated with new features
- [ ] CHANGELOG.md updated with version notes
- [ ] USER_GUIDE.md reflects current functionality
- [ ] DEPLOYMENT.md includes any new deployment steps
- [ ] API documentation updated (if applicable)
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

### Dependencies
- [ ] All dependencies up to date
- [ ] License compatibility verified
- [ ] No deprecated packages in use
- [ ] Security audits clean

### Environment
- [ ] `.env.example` updated with new variables
- [ ] Environment variable documentation complete
- [ ] Docker configuration tested
- [ ] docker-compose.yml updated if needed

## Version Bump

- [ ] Update version in `package.json`
- [ ] Update version in `CHANGELOG.md`
- [ ] Update version references in documentation
- [ ] Create version tag: `git tag v1.x.x`

## GitHub Preparation

### Repository
- [ ] All PRs merged
- [ ] Branch is clean and up to date
- [ ] No merge conflicts
- [ ] CI/CD pipelines passing

### GitHub Actions
- [ ] CI workflow passing
- [ ] Docker build workflow passing
- [ ] CodeQL analysis passing
- [ ] Security scans passing

### Release Notes
- [ ] Draft release notes prepared
- [ ] Highlight key features
- [ ] List breaking changes (if any)
- [ ] Include upgrade instructions
- [ ] Credit contributors

## Release

### Create Release
- [ ] Push version tag: `git push origin v1.x.x`
- [ ] Create GitHub release from tag
- [ ] Attach release notes
- [ ] Mark as pre-release (if applicable)

### Docker
- [ ] Docker image builds successfully
- [ ] Image tagged with version
- [ ] Image pushed to registry
- [ ] Image security scanned
- [ ] docker-compose tested with new image

### Verification
- [ ] Download and test release artifacts
- [ ] Verify Docker image works
- [ ] Test deployment from scratch
- [ ] Verify documentation links work

## Post-Release

### Communication
- [ ] Announce release in relevant channels
- [ ] Update project website (if applicable)
- [ ] Post to social media (if applicable)
- [ ] Notify stakeholders

### Monitoring
- [ ] Monitor error logs for 24 hours
- [ ] Watch GitHub issues for bug reports
- [ ] Check CI/CD pipelines
- [ ] Verify API endpoints responding

### Documentation
- [ ] Update any external documentation
- [ ] Update tutorials/guides
- [ ] Archive old version docs (if applicable)

## Rollback Plan

If issues are discovered:
- [ ] Rollback procedure documented
- [ ] Previous version available
- [ ] Database migration reversal tested (when applicable)
- [ ] Communication plan for rollback

## Version-Specific Notes

### Major Version (x.0.0)
- [ ] Breaking changes clearly documented
- [ ] Migration guide provided
- [ ] Deprecation warnings added
- [ ] Backward compatibility considered

### Minor Version (1.x.0)
- [ ] New features documented
- [ ] Backward compatible
- [ ] Examples provided for new features

### Patch Version (1.0.x)
- [ ] Bug fixes documented
- [ ] No new features
- [ ] Regression testing completed

## Security Release

If this is a security release:
- [ ] Security advisory published
- [ ] CVE assigned (if applicable)
- [ ] Affected versions documented
- [ ] Upgrade urgency communicated
- [ ] Security researchers credited (if applicable)

---

**Release Manager**: _________________
**Release Date**: _________________
**Version**: _________________

## Sign-Off

- [ ] Technical Lead approval
- [ ] QA approval
- [ ] Security approval (for security-sensitive changes)
- [ ] Product Owner approval

**Ready to release**: ☐ Yes ☐ No

**Notes**:
