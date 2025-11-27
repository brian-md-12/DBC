#!/bin/bash
# Quick deployment script - Push to both repos at once
echo "Deploying to all remotes..."

# Get current branch
BRANCH=$(git branch --show-current)

# Push to your main repo (this triggers Vercel auto-deploy)
echo "Pushing to ignatiusratemo26/dbc..."
git push ignatius $BRANCH

# Push to backup/old repo
echo "Pushing to brian-md-12/DBC..."
git push origin $BRANCH

echo "Deployed to both repos!"
echo "Vercel will auto-deploy from ignatiusratemo26/dbc"
