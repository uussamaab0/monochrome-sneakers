# Automated GitHub Pages Deployment Workflow

This guide details the step-by-step workflow to automatically create, configure, and publish static websites (or frontend single-page apps) to **GitHub Pages** using **GitHub Actions** and the **GitHub REST API**.

---

## Phase 1: GitHub Token Configuration
To automate repository creation and pages setup, you must use a GitHub Personal Access Token (PAT) with the following permissions:

1. Go to **Settings** -> **Developer settings** -> **Personal access tokens** -> **Fine-grained tokens**.
2. Create/update a token and set **Repository Access** to **All repositories**.
3. Under **Repository permissions**, grant:
   - **Administration**: `Read & Write` *(Required to create repositories)*
   - **Contents**: `Read & Write` *(Required to push code)*
   - **Pages**: `Read & Write` *(Required to configure Pages settings)*
   - **Workflows**: `Read & Write` *(Required to push GitHub Actions workflows)*

---

## Phase 2: Create and Configure the Repository
Once the token is ready, you can automate repository creation and configuration using the GitHub REST API (e.g., via PowerShell or curl).

### 1. Create the Repository
Send a `POST` request to create a new public repository:
```powershell
$token = "YOUR_GITHUB_TOKEN"
$headers = @{
  Authorization = "token $token"
  Accept        = "application/vnd.github+json"
}

$body = @{
  name        = "your-repo-name"
  description = "A brief description of your site."
  private     = $false
  auto_init   = $true # Creates the default branch (main) with a README
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://api.github.com/user/repos" -Headers $headers -Body $body -ContentType "application/json"
```

### 2. Configure GitHub Pages to use GitHub Actions
Tell GitHub to build and deploy Pages using a workflow instead of a static branch:
```powershell
$body = @{ build_type = "workflow" } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/pages" -Headers $headers -Body $body -ContentType "application/json"
```

---

## Phase 3: Project Files & Auto-Deployment Workflow
Your project folder should contain your website files (HTML, CSS, JS) and the GitHub Actions deployment workflow.

### 1. File Structure
```text
your-project-folder/
├── .github/
│   └── workflows/
│       └── static.yml
├── index.html
├── style.css
├── app.js
└── [Assets/Images...]
```

### 2. The Deployment Workflow (`.github/workflows/static.yml`)
Create this file exactly as follows to automate deployment on every push:
```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.' # Uploads everything in the root folder
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Phase 4: Pushing Files to GitHub
To push your local code using Git without affecting your global Git credentials, run this isolated push sequence in your project folder:

```powershell
# 1. Initialize local repository
git init

# 2. Configure local Git identity (Isolated to this folder)
git config user.name "YOUR_USERNAME"
git config user.email "YOUR_USERNAME@users.noreply.github.com"

# 3. Commit files
git add .
git commit -m "Initial commit of website"
git branch -M main

# 4. Add remote pointing to your repo (Authenticated via Token)
git remote add origin https://YOUR_GITHUB_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push code to trigger deployment
git push -u origin main --force
```

Once pushed, GitHub Actions takes over. You can monitor progress under the **Actions** tab of your repository. Your site will be live at:
`https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`
