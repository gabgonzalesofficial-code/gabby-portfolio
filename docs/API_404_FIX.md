# Fixing 404 Error for API Route

If you're getting a 404 error for `/api/chat`, follow these steps:

## Step 1: Verify the File Exists

1. Check that `api/chat.js` exists in your repository
2. Make sure it's not in `.gitignore` or `.vercelignore`
3. Verify the file is committed to git

## Step 2: Check Vercel Deployment

1. Go to your Vercel Dashboard
2. Click on your latest deployment
3. Go to the **Functions** tab
4. Look for `api/chat` in the list

**If you don't see `api/chat`:**
- The file might not be deployed
- Check that `api/chat.js` is in your git repository
- Make sure it's not excluded in `.vercelignore`

## Step 3: Verify vercel.json Configuration

Your `vercel.json` should have:
```json
{
  "functions": {
    "api/chat.js": {
      "runtime": "nodejs20.x"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

## Step 4: Redeploy

After making changes:
1. Commit and push your changes
2. Wait for Vercel to deploy
3. Check the Functions tab again

## Step 5: Test the Route Directly

Try accessing the API route directly:
- Production: `https://your-domain.vercel.app/api/chat`
- You should see a "Method not allowed" error (405) for GET requests, which means the route exists

## Common Issues

### Issue: File not in repository
**Solution:** Make sure `api/chat.js` is committed to git and pushed

### Issue: File in .vercelignore
**Solution:** Remove `api/` from `.vercelignore` if it's there

### Issue: Testing locally with `npm run dev`
**Solution:** Use `vercel dev` instead. The `api/` folder only works with Vercel CLI or on Vercel deployment.

### Issue: Function not appearing in Vercel
**Solution:** 
- Check the deployment logs
- Verify the file structure matches exactly: `api/chat.js` (not `api/chat.ts` or other extensions)
- Make sure the export is correct: `export default async function handler(req, res)`

## Still Not Working?

1. Check Vercel deployment logs for any errors
2. Verify the function appears in the Functions tab
3. Try accessing `/api/chat` directly in your browser (should show 405 error)
4. Check that your Vercel project is configured as a Vite project
