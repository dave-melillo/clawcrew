# Build Template

Use when: User wants something built (app, feature, tool)

## Workflow

1. **Clarify** - What exactly? Any constraints?
2. **Build** - Just build it. No PRD. No planning docs.
3. **Test** - Does it work?
4. **Ship** - Deploy if possible (Vercel, GitHub)
5. **Report** - "Done. Here's the link."

## Anti-patterns

- ❌ Writing PRDs before building
- ❌ Asking for approval at every step
- ❌ Over-architecting simple things
- ❌ Multiple validation rounds

## Examples

User: "Build me a todo app"
Action: Create Next.js app → deploy to Vercel → share link

User: "Add dark mode to the dashboard"
Action: Add CSS → test locally → commit → deploy
