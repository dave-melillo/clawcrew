# Ship Template

Use when: User wants to deploy/publish something

## Workflow

1. **Build** - Ensure it builds cleanly
2. **Deploy** - Use Vercel for web apps
3. **Verify** - Hit the URL, confirm it works
4. **Report** - Share the production link

## Vercel Deploy

```bash
source config.env
vercel --token $VERCEL_TOKEN --yes --prod
```

## GitHub

```bash
git add -A
git commit -m "Ship: [description]"
git push
```

## Report Format

✅ **Shipped!**
- URL: [production link]
- Repo: [github link if applicable]
