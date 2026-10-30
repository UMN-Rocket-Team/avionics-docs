---
layout: default
title: General Guidelines
parent: Resources
has_children: false
nav_order: 1
permalink: /docs/tutorials/firmware/resources/general-guidelines/
---

# General Guidelines (aka "how do I submit my code?")

Before you start working on anything, please read through these guidelines! This is how we keep our code organized and avoid accidentally breaking things for everyone else.

### 1. DO NOT push directly to main

Seriously. **We DO NOT push directly to main.** All changes should go through a separate branch and a pull request (PR).

### 2. Commit somewhat often (but not excessively)

What I mean is don't just commit everything at the very end. If you do that, it's going to be a lot harder to figure out what changes you made when you look back.

Try to commit whenever you've made a meaningful change to your code. Each commit should ideally represent one specific change or addition.

### 3. Create a branch BEFORE you start working on your code

It's okay if you forget to do this at the beginning, but **MAKE SURE you create a branch before committing or pushing**. Otherwise, you might accidentally end up pushing to main.

To create a branch, run:

```bash
git branch <branch-name>
```

**Branch naming rules:**
- Branch names should describe what you're working on.
- For new features, always start with `feature/`.
- After `feature/`, briefly explain what your branch is for.
- Good branch name: `feature/second-servo`
- Bad branch name: `code1`

{: .note }
Not every branch has to be a feature branch! For example, bug fixes can use `fix/` and documentation changes can use `docs/`. Just make sure your branch name actually describes what you're doing.

### 4. Switch to your branch

Now that you've created your branch, switch to it using:

```bash
git checkout <branch-name>
```

You can double-check which branch you're on with:

```bash
git branch
```

The branch with the `*` next to it is your current branch.

### 5. Check what files you've changed

Once you're done making changes and are ready to commit your code, run:

```bash
git status
```

Look through the files and make sure you haven't accidentally edited anything that shouldn't be committed.

{: .important }
**This is an EXTREMELY important step!!** Do not move on until you've checked your files. We do not want random files or changes accidentally making their way into the repo.

### 6. Stage your changes

Once you're sure you ONLY have the correct files, run:

```bash
git add .
```

This stages all changes in your current directory and its subdirectories.

{: .warning }
`git add .` stages ALL changes in the current directory and its subdirectories, so please make sure you've checked `git status` first!

If you only want to stage specific files, you can use:

```bash
git add <file-name>
```

Run `git status` again to double-check what's staged.

### 7. Commit your code

Before committing, make sure you're still on the correct branch:

```bash
git branch
```

Then commit your changes with:

```bash
git commit -m "your message here"
```

**Commit message rules:**
- Your commit message should briefly describe what you changed or added
- Please make your messages descriptive enough that someone else can understand what you did
- None of this: `fixes`, `fix1`, `final fix`, `final final fix`, `definitely the final`
- Good commit message: `added second servo pwm`

### 8. DOUBLE-CHECK EVERYTHING before pushing

Yes, we're checking again. I'm repeating this because it's THAT important.

First, make sure you're on your branch:

```bash
git branch
```

Then check your files again:

```bash
git status
```

If you want to see which files are included in your latest commit, you can also run:

```bash
git show --stat --oneline HEAD
```

Make sure you're not accidentally including files that have nothing to do with your changes.

### 9. Push your code to GitHub

Once you're ABSOLUTELY sure you're on the correct branch and haven't committed any extra files, push your code with:

```bash
git push -u origin <branch-name>
```

{: .note }
The `-u` sets the upstream branch the first time you push. After that, you can just use `git push` when pushing additional commits to the same branch.

### 10. Open a Pull Request (PR)

Once you've pushed your branch to GitHub:

1. Move your Notion task to **Review**
2. Open a pull request (PR) from your branch into `main`
3. Add the **firmware lead and at least one other firmware member** as reviewers

Please make sure your PR has a clear title and description explaining what you changed. This makes it a lot easier for reviewers to understand what your code is supposed to do.

### 11. Review the Pull Request

If you're assigned as a reviewer, please actually review the code instead of just approving it!

**As a reviewer, you should:**
- Read through the code and make sure you understand what it's doing
- Test the code (when applicable) to make sure it works as expected
- Check for any bugs, unnecessary changes, or potential issues
- If something doesn't work, something looks wrong, or you just have a question about the code, leave a comment on the relevant line(s)
- **DO NOT approve the PR until all issues and comments have been resolved.**

{: .note }
If you're unsure how to review a PR, take a look at [this video](https://www.youtube.com/watch?v=lSnbOtw4izI).

### 12. Merge your Pull Request

**DO NOT merge your pull request until BOTH reviewers have approved it.**

Once your PR has been approved by both reviewers and successfully merged into `main`, you can move your Notion task from **Review** to **Done**.

And that's it! You've successfully submitted your code without (hopefully) breaking anything for everyone else.