# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Environment Variables**: Prepare your production environment variables

## Environment Variables Setup

In your Vercel dashboard, add these environment variables:

### Required Variables:

-   `MONGODB_URI` - Your MongoDB Atlas connection string
-   `JWT_SECRET` - A strong secret key for JWT tokens
-   `NODE_ENV` - Set to "production"

### Optional Variables:

-   `CLOUDINARY_CLOUD_NAME` - For image uploads
-   `CLOUDINARY_API_KEY` - For image uploads
-   `CLOUDINARY_API_SECRET` - For image uploads
-   `CORS_ORIGINS` - Comma-separated list of allowed frontend URLs

### Example CORS_ORIGINS:

```
https://your-frontend.vercel.app,https://www.your-domain.com
```

## Deployment Steps

### Option 1: Using Vercel CLI

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Login to Vercel:

    ```bash
    vercel login
    ```

3. Deploy:
    ```bash
    vercel --prod
    ```

### Option 2: Using Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository in Vercel dashboard
3. Set the root directory to `backend`
4. Add environment variables in project settings
5. Deploy

## Post-Deployment

1. **Test your API**: Visit `https://your-api-url.vercel.app/api/health`
2. **Update Frontend**: Update your frontend API URLs to point to the new Vercel URL
3. **Update CORS**: Add your frontend URL to CORS_ORIGINS environment variable

## API Endpoints

After deployment, your API will be available at:

-   Health Check: `https://your-api-url.vercel.app/api/health`
-   Events: `https://your-api-url.vercel.app/api/events`
-   Auth: `https://your-api-url.vercel.app/api/auth`
-   Students: `https://your-api-url.vercel.app/api/students`
-   Candidates: `https://your-api-url.vercel.app/api/candidates`
-   Magazines: `https://your-api-url.vercel.app/api/magazines`

## Troubleshooting

### Common Issues:

1. **MongoDB Connection**: Ensure MONGODB_URI is correctly set
2. **CORS Errors**: Check CORS_ORIGINS environment variable
3. **Build Errors**: Ensure vercel.json is properly configured with builds section
4. **Function Timeout**: Vercel has a 10-second timeout for Hobby plan, 30 seconds for Pro plan

### Logs:

-   Check deployment logs in Vercel dashboard
-   Use `vercel logs` command for real-time logs

## Configuration Files

-   `vercel.json` - Vercel deployment configuration
-   `.vercelignore` - Files to exclude from deployment
-   `.env.example` - Template for environment variables

## Notes

-   Vercel automatically handles serverless deployment
-   Each API route becomes a serverless function
-   Static files are served from the edge
-   Database connections are pooled automatically
