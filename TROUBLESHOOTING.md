# Troubleshooting: "Failed to get response from AI" Error

If you're seeing the error "Failed to get response from AI. Please try again." on your Vercel deployment, follow these steps:

## Step 1: Check Vercel Function Logs

1. **Go to your Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **View Deployment Logs**
   - Click on your latest deployment
   - Go to the **Functions** tab
   - Click on `api/chat` function
   - Look at the **Logs** section

3. **Look for Error Messages**
   - Check for "GROQ_API_KEY is not configured" → API key missing
   - Check for "401" or "Unauthorized" → Invalid API key
   - Check for "429" or "rate limit" → Rate limit exceeded
   - Check for network errors → Connection issues

## Step 2: Verify Environment Variable

1. **Check Vercel Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Verify `GROQ_API_KEY` exists
   - Check that it's set for **Production** environment
   - Make sure there are no extra spaces or quotes

2. **Test the API Key**
   - Copy your API key from Vercel
   - Go to [Groq Console](https://console.groq.com/)
   - Verify the key is active and not expired

## Step 3: Common Issues and Solutions

### Issue: "API key not configured"
**Solution:**
- Add `GROQ_API_KEY` to Vercel environment variables
- Make sure to select **Production** environment
- Redeploy your application

### Issue: "Invalid API key" or "401 Unauthorized"
**Solution:**
- Verify the API key is correct (no extra spaces)
- Get a fresh API key from [Groq Console](https://console.groq.com/)
- Update it in Vercel and redeploy

### Issue: "Rate limit exceeded" or "429"
**Solution:**
- Wait a few minutes before trying again
- Check your Groq usage limits
- Consider upgrading your Groq plan if needed

### Issue: Network/Connection Errors
**Solution:**
- Check if Groq API is operational
- Verify your Vercel deployment region
- Try again after a few minutes

### Issue: Model Not Available
**Solution:**
- The model `llama-3.1-70b-versatile` might not be available
- Try changing to `llama-3.1-8b-instant` in `api/chat.js`
- Or check [Groq's available models](https://console.groq.com/docs/models)

## Step 4: Test Locally First

Before deploying, test locally:

1. **Make sure `.env` file exists** with your API key:
   ```
   GROQ_API_KEY=your_key_here
   ```

2. **Install Vercel CLI** (if not already):
   ```bash
   npm install -g vercel
   ```

3. **Run locally**:
   ```bash
   vercel dev
   ```

4. **Test the chatbot** at `http://localhost:3000`

5. **Check console** for any errors

## Step 5: Check the Error Details

The improved error handling now shows more details. Look for:

- **Error message** in the chatbot response
- **Browser console** (F12 → Console tab) for client-side errors
- **Vercel function logs** for server-side errors

## Step 6: Verify Deployment

After making changes:

1. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Fix chatbot error handling"
   git push
   ```

2. **Wait for Vercel to deploy** (check deployment status)

3. **Test on production** URL

## Still Having Issues?

1. **Check Vercel Status**: [https://www.vercel-status.com/](https://www.vercel-status.com/)
2. **Check Groq Status**: Visit Groq Console for service status
3. **Review Error Logs**: Check both browser console and Vercel function logs
4. **Try a Different Model**: Change the model in `api/chat.js` to `llama-3.1-8b-instant`

## Quick Checklist

- [ ] `GROQ_API_KEY` is set in Vercel environment variables
- [ ] Environment variable is set for **Production**
- [ ] API key is valid and active in Groq Console
- [ ] Application has been redeployed after adding the variable
- [ ] Checked Vercel function logs for specific errors
- [ ] Tested locally with `vercel dev` (if possible)

## Need More Help?

- **Vercel Logs**: Check your deployment → Functions → `api/chat` → Logs
- **Groq Console**: [https://console.groq.com/](https://console.groq.com/)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
