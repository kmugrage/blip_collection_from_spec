# Technology Radar Blip Submission - User Guide

This guide helps you submit high-quality blips to the Technology Radar.

## Table of Contents

- [What is a Blip?](#what-is-a-blip)
- [Before You Submit](#before-you-submit)
- [Step-by-Step Submission](#step-by-step-submission)
- [Using the AI Coach](#using-the-ai-coach)
- [Understanding Rings](#understanding-rings)
- [Tips for Success](#tips-for-success)
- [FAQs](#faqs)

## What is a Blip?

A **blip** is a single entry on the Technology Radar representing:
- A technology, tool, technique, or platform
- Your organization's experience and recommendation
- Guidance for other teams on adoption

Each Technology Radar publishes approximately **120 blips** selected from all submissions.

## Before You Submit

### Requirements

1. **Real Experience**: Submit only technologies you've used
2. **Concrete Examples**: Provide specific client/project examples
3. **Clear Reasoning**: Explain why you recommend this adoption level
4. **Audience Awareness**: Write for senior technologists

### Quality Matters

The editorial team reviews all submissions. Quality and specificity dramatically increase your chance of being selected.

## Step-by-Step Submission

### 1. Enter the Blip Name

Use the **most widely recognized name**:

✅ Good:
- "React"
- "Kubernetes"
- "Continuous Integration"

❌ Avoid:
- Internal codenames
- Abbreviations (unless universally known)
- Product versions (unless significant)

**Tip**: The system checks if this technology appeared on prior radars and provides context.

### 2. Select Quadrant

Choose the category that best fits:

- **Techniques**: Processes, practices, approaches
- **Tools**: Software tools for development/operations
- **Platforms**: Infrastructure, cloud services, runtime environments
- **Languages & Frameworks**: Programming languages, frameworks, libraries

### 3. Choose Ring

Select your recommended adoption level:

#### 🟢 Adopt
**Proven and recommended for broad use**
- Requirements: 2+ client examples
- Use when: Technology is mature, low-risk, ready for any suitable project
- Example: "We've successfully used this on 10+ projects across different domains"

#### 🔵 Trial
**Worth pursuing; build this capability**
- Requirements: 1+ client example
- Use when: Promising technology, actively building expertise
- Example: "We're using this on 3 pilot projects to understand its strengths"

#### 🟡 Assess
**Worth exploring to understand impact**
- Requirements: None (description only)
- Use when: Early exploration, understanding potential
- Example: "We've done proof-of-concepts and see potential value"

#### 🔴 Caution
**Proceed carefully; not recommended for new work**
- Requirements: Detailed reasoning about problems encountered
- Use when: You've faced significant issues or found better alternatives
- Example: "We experienced performance issues and migration difficulties"

### 4. Write Description

Your description should answer:

1. **What is it?** (Brief, senior technologists may already know)
2. **Why does it matter?** (What problem does it solve?)
3. **What's your experience?** (Concrete observations)
4. **Why this ring?** (Justify the recommendation)

**Length**: 100-2000 characters

Example (Adopt):
```
We've adopted React as our default web framework after using it on 15+
client projects over 18 months. The component model and hooks significantly
reduced our state management complexity, cutting development time by ~30%
compared to Angular. The mature ecosystem (Next.js, React Query) and
strong community support make it our confident choice for enterprise
web applications. We've successfully trained 20+ developers and encountered
no blockers.
```

### 5. Add Client Examples (Adopt/Trial)

For **Adopt** ring, provide **2+ examples**
For **Trial** ring, provide **1+ example**

Each example should include:
- Client name (not anonymized)
- Industry/domain
- Context and use case
- Outcome or result

Example:
```
FinanceClient in banking - Migrated trading platform from Angular to React.
Reduced page load time from 3s to 800ms, improved developer velocity by 40%.
Team of 8 developers, 6-month migration completed on schedule.
```

### 6. Add Caution Reasoning (Caution only)

For **Caution** ring, explain:
- Specific problems encountered
- What you tried to resolve them
- Why teams should be cautious

Example:
```
We attempted to use Technology X on 3 client projects but encountered
significant performance issues at scale (>10k requests/minute). Despite
working with vendor support and implementing recommended optimizations,
we couldn't achieve acceptable response times. The configuration complexity
also led to frequent production incidents. We've since migrated to
Alternative Y with better results.
```

### 7. Review and Submit

Before submitting:
- ✅ All required fields completed
- ✅ AI Coach suggestions addressed
- ✅ Description is specific and concrete
- ✅ Client examples include details
- ✅ Ring choice is justified

## Using the AI Coach

The **AI Coach** provides real-time feedback as you type:

### What It Does

- Identifies vague or generic content
- Suggests improvements for clarity
- Recommends adding specific details
- Highlights missing justification

### How to Use It

1. **Start typing** - Coaching appears automatically after ~2 seconds
2. **Read suggestions** - AI identifies specific improvements
3. **Update your submission** - Apply the coaching advice
4. **Iterate** - Coaching updates as you refine

### Understanding Coaching

🟡 **Advisory, not blocking** - You can submit even if coaching suggests improvements, but addressing feedback increases selection chances

The AI knows:
- Selection is competitive (~120 from all submissions)
- Audience is senior technologists
- Specificity and real experience matter most

## Understanding Rings

### When to Use Each Ring

| Ring | Use When | Don't Use When |
|------|----------|----------------|
| **Adopt** | Proven across multiple projects, confident recommendation | Only used once, still learning, edge cases remain |
| **Trial** | Building capability, promising early results | Proof-of-concept only, no production usage |
| **Assess** | Early exploration, understanding potential | Haven't tried it yet, just reading about it |
| **Caution** | Significant problems experienced | Minor issues, fixable with configuration |

### Ring Movement

If technology is already on the radar, you can:
- **Reblip**: Recommend it appear again unchanged
- **Move**: Suggest moving to different ring (with justification)
- **Update**: Propose updated description

## Tips for Success

### ✅ Do This

- **Be specific**: Names, numbers, contexts
- **Share experience**: What you actually observed
- **Explain why**: Reasoning behind recommendations
- **Include outcomes**: What happened as a result
- **Write for peers**: Senior technologists who may not know this technology

### ❌ Avoid This

- **Generic descriptions**: "This is good" or "We like it"
- **Marketing speak**: Vendor descriptions, buzzwords
- **Vague claims**: "Improves productivity" without specifics
- **Technology comparisons**: Focus on your experience, not alternatives
- **Future promises**: What it might do vs. what you've seen

### Example Transformation

**Before** (Weak):
```
React is a good library for building user interfaces. It's fast and
easy to use. We recommend it.
```

**After** (Strong):
```
We've adopted React on 12 client projects after comparing it to Angular
and Vue. The component model reduced our state management code by 40%,
and the mature ecosystem (Next.js, testing libraries) accelerated
delivery. At RetailClient, we rebuilt their e-commerce platform in
React, reducing page load from 4s to 1.2s and improving conversion
by 15%. Team training took 2 weeks per developer.
```

## FAQs

**Q: Can I submit multiple blips?**
A: Yes! Submit as many as you have real experience with.

**Q: Can multiple people submit the same technology?**
A: Yes. Different perspectives and use cases are valuable.

**Q: How long does review take?**
A: The editorial team reviews periodically. You won't receive individual feedback, but selected blips appear on the published radar.

**Q: Can I edit after submitting?**
A: No. The system is submission-only. Make sure your submission is complete before submitting.

**Q: Do I need client permission to name them?**
A: This is an internal tool. Examples are not anonymized, but verify internally that sharing is appropriate.

**Q: What if the AI Coach seems wrong?**
A: The AI provides suggestions, not requirements. Use your judgment. Coaching is advisory only.

**Q: What happens to my submission?**
A: It's stored and reviewed by the editorial team. Approximately 120 blips are selected for each published radar.

**Q: Can I see what others submitted?**
A: No. Submissions are private to the editorial team.

**Q: What if I get an error?**
A: The system validates your submission. Address any errors shown, then resubmit. If problems persist, contact support.

## Need Help?

- **Technical Issues**: Check DEPLOYMENT.md troubleshooting section
- **Questions**: Create an issue on GitHub
- **Security Concerns**: Email security@thoughtworks.com

---

**Ready to submit?** Access the application and share your technology experience with the radar community! 🚀
