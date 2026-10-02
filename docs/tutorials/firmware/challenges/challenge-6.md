---
layout: default
title: "Challenge 6: Push to GitHub"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-6/
---

# Challenge 6: Push to GitHub

Now that you have completed your firmware challenges, it is time to upload your work to the team repository. In Git terminology, uploading your local commits to a remote server is called **pushing**.

#### What you'll need

- STM32CubeIDE project from Challenge 5

---

## Git vs. GitHub

* **Git** is a distributed version control system that runs locally on your computer to track changes in files and coordinate work among team members.
* **GitHub** is a cloud-based hosting platform where we store our central Git repositories, manage pull requests, and review code.

---

## The Workflow: Step-by-Step

### 1. Switch to the Target Branch
In firmware development, we **never push directly to `main`**. All work happens on dedicated feature branches.

Pull up a Terminal window.

If you haven't already, clone the Avionics repo:

```
git clone https://github.com/UMN-Rocket-Team/Avionics.git
```

This is how you get the url for cloning if you're not sure how to:

<img width="738" height="442" alt="Screenshot 2026-10-02 at 3 41 02 PM" src="https://github.com/user-attachments/assets/d400eafd-28e0-4389-a74a-1b91fae111ba" />

<img width="734" height="445" alt="Screenshot 2026-10-02 at 3 41 45 PM" src="https://github.com/user-attachments/assets/c1c48aa1-8005-469e-b257-c64af3c3e300" />

{: .note}
If you don't have access to the Avionics repo, contact the Firmware lead.

Switch to the challenges branch:

```
git checkout firmware-challenges
```

{: .important }
If you already made changes before switching branches, Git will usually carry your unstaged changes over to `firmware-challenges`. If Git blocks you due to conflicting files, reach out to the Firmware lead before proceeding or resolve merge conflicts if you know how to.

### 2. Pull the Latest Remote Changes
Before staging or pushing, ensure your local copy has the newest changes that others may have added:

```
git pull origin firmware-challenges
```

{: .note }
Pulling frequently prevents merge conflicts—which happen when two or more people edit the same lines of code in different ways.

### 3. Check What Changed
Inspect your workspace to see modified, untracked, or deleted files:

```
git status
```

{: .important }
Always run `git status` before staging files to verify you are not accidentally adding code that you don't mean to add 
(eg. test code, personal project, etc.)

### 4. Stage Your Files
Stage only the specific files you want to include in this submission:

```
git add path/to/your/file.cpp
```

If you are sure every modified file belongs in this commit, stage everything in the current directory:

```
git add .
```

### 5. Commit Your Changes
A commit is a permanent snapshot of your staged changes. Always provide a concise, descriptive commit message explaining the change:

```
git commit -m "completed challenge 6"
```

### 6. Push to GitHub
Send your local commits to the remote GitHub repository:

```
git push origin firmware-challenges
```

## Quick Reference: Common Git Commands

| Command | Purpose | Example / Note |
|:---|:---|:---|
| `git checkout <branch>` | Switches your working directory to the specified branch. | `git checkout firmware-challenges` |
| `git pull origin <branch>` | Fetches and merges the latest updates from the remote repo into your branch. | Run this often to stay synchronized with the team. |
| `git status` | Displays modified, untracked, and staged files. | Run before staging or committing to avoid accidental commits. |
| `git diff` | Shows exact line-by-line additions and deletions in unstaged files. | Useful for reviewing code before staging. |
| `git add <path>` | Stages a file or directory for the next commit. | Use `git add .` to stage all changes in the directory. |
| `git commit -m "<msg>"` | Records staged changes to local history with an explanatory message. | Requires the `-m` flag to supply an inline message. |
| `git push origin <branch>` | Uploads local commits to the remote repository on GitHub. | Makes your committed changes visible to the team. |

## Typical Command Loop
```
git checkout <branch>
git pull origin <branch>
# ... make your code edits ...
git status
git add <files>
git commit -m "msg"
git push origin <branch>
```

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-5/" class="btn btn-outline">&#10094; Previous: Challenge 5</a>
</div>