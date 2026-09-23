---
layout: default
title: Software
parent: Tutorials
has_children: true
nav_order: 1
permalink: /docs/tutorials/software/
---

# Software Tutorials
{: .no_toc }

Onboarding for the Software subteam. We build the team's ground station software, mostly
[WINGS]({{ '/docs/projects/wings/' | relative_url }}), and most people join knowing very little of what we use. That's
what training is for.
{: .fs-5 .fw-300 }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

This page is based on the software subteam's Fall 2025 training guide. More training material is in the
[team Drive folder](https://drive.google.com/drive/folders/18WF66WM5EvuoDrnNFPkNWKOSpb3U-uqz?usp=drive_link) and the
[software-training-2025](https://github.umn.edu/Rocket-Team/software-training-2025) repo (both need team access).

## What we work on

- **[WINGS]({{ '/docs/projects/wings/' | relative_url }})**, the team's open-source ground station. It talks to the UFC
  and to commercial flight computers over radio and shows the data live during and after launches. It's written in Rust
  and TypeScript as a Tauri desktop app.
- **A Grafana project**, started for 2026–27. A new back end that talks to the rocket like WINGS does and serves the data
  to [Grafana](https://grafana.com/) dashboards, plus a web service so several people at the launch site can watch live.
  It's being designed from scratch, which makes it a good way to get hands-on with system design, back-end
  development, and data pipelines.

## How to get going

- **Come to software worktimes.** The first few weeks are all training, and worktimes are where you work on it and ask
  questions. Times are announced in the #avionics channel on Slack.
- **Ask questions**, in worktimes, on Slack (#avionics, or a DM to the software lead or avionics lead), or in the
  [WINGS Discussions](https://github.com/UMN-Rocket-Team/WINGS/discussions).
- **You don't need to know everything.** A working knowledge of a few of the technologies below is enough to start
  contributing.
- **Search engines and generative AI are fine to use.** This isn't coursework. Tools like ChatGPT or GitHub Copilot are
  encouraged, as long as you use them responsibly, avoid plagiarism, and cite sources where you need to.

The best way to learn is by doing, so come to as many worktimes as you can.

## Things to install

- [ ] A code editor. [VS Code](https://code.visualstudio.com/) is what most of us use.
- [ ] [Git](https://git-scm.com/downloads)
- [ ] [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/installation), for the front end
- [ ] Everything on Tauri's [prerequisites page](https://tauri.app/start/prerequisites/) (this includes Rust)
- [ ] The [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) VS Code extension, which
      points out errors and style problems in TypeScript
- [ ] The [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) VS Code extension
- [ ] A **public** [GitHub account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github).
      WINGS is on public GitHub, not the UMN Enterprise server, so your UMN account isn't enough.

Then follow the [WINGS README](https://github.com/UMN-Rocket-Team/WINGS#developing) to build and run it
(`pnpm install`, then `pnpm tauri dev`).

## What to learn

| Technology | Used for | Needed for |
|:--|:--|:--|
| Git and GitHub | Source control | Everyone |
| TypeScript | Front-end logic | Front end |
| SolidJS (with JSX/TSX) | Reactive UI components | Front end |
| Tailwind CSS | Styling | Front end |
| pnpm | Front-end packages | Front end |
| Rust | Talking to radios, parsing and processing data | Back end |
| Tauri | Makes WINGS a desktop app, and connects the front end to the back end | Back end (a little for everyone) |

**Pick a side first.** Decide whether you're more interested in front-end tasks (what's on screen) or back-end tasks
(radios, parsing, data), and work through that section from the top. If you're not sure, start with the front end; it's
easier to pick up. Doing both is fine too.

### Git and GitHub

Essential, and you'll need it for classes and jobs anyway.

- [About GitHub and Git](https://docs.github.com/en/get-started/start-your-journey/about-github-and-git)
- [Git cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf). You'll use `git checkout`, `git pull`,
  `git add`, `git commit`, and `git push` the most, so learn those for sure.
- [Introduction to GitHub](https://github.com/skills/introduction-to-github): creating a branch, committing, and opening
  and merging a pull request. We do all of these on the software subteam.

### Front end

HTML gives a page structure, CSS styles it, and TypeScript makes it do things. Learn those three first.

1. **HTML and CSS.** We don't write plain HTML or CSS in our projects, but everything else builds on them. Start with
   the W3Schools intros to [HTML](https://www.w3schools.com/html/html_intro.asp) and
   [CSS](https://www.w3schools.com/css/css_intro.asp).
2. **JavaScript and TypeScript.** TypeScript is JavaScript with types, and it's harder to pick up than HTML and CSS, so
   give it real time.
   - [JavaScript tutorial (W3Schools)](https://www.w3schools.com/js/default.asp)
   - [Asynchronous JavaScript (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS).
     This is probably the hardest concept you'll need.
   - [TypeScript tutorial](https://www.typescripttutorial.net/). Just enough to be comfortable with the basic types.
   - Your browser's JavaScript console (right-click a page → Inspect → Console) is a handy place to experiment.
3. **Put it together** with this [to-do list app project](https://www.codedex.io/projects/create-a-to-do-list-app-with-html-css-js).
4. **SolidJS.** The reactive UI library WINGS uses. The `.tsx` files in WINGS are TypeScript with HTML mixed in (JSX).
   Work through the [SolidJS tutorial](https://www.solidjs.com/tutorial/introduction_basics) far enough to cover the
   basics, JSX, signals, effects, the `Show` and `For` components, `onMount`, events, props, nested reactivity, and
   the context API. If you already know React, a lot of it will look familiar.
5. **Tailwind CSS.** Instead of writing CSS files, you add short classes like `p-4` (padding) or `text-xl` directly to
   elements. Look classes up in the [Tailwind docs](https://tailwindcss.com/docs) as you need them (Ctrl+K and search,
   e.g. "padding"), or try things in the [playground](https://play.tailwindcss.com/).

### Back end

The back end is where WINGS talks to radios and flight computers, parses and processes data, handles commands from the
front end, and manages the app's state. It's harder to learn than the front end. Having taken CSCI 1933 and CSCI 2021,
or having a solid background in C or C++, helps a lot.

1. **Memory basics first.** Make sure you understand pointers, the
   [stack and the heap](https://www.geeksforgeeks.org/dsa/stack-vs-heap-memory-allocation/), memory leaks, scope, and
   mutable vs. immutable values. Rust handles memory with **ownership**: values are owned by variables and freed
   automatically when the variable goes out of scope. That gives you memory safety like a garbage-collected language
   without the runtime cost, and without the leaks you can get from manual `malloc`/`free`.
2. **Rust.** It has a steep learning curve, even if you know other languages, but once your code compiles a lot of
   common bugs are already gone. Read [the Rust Book](https://doc.rust-lang.org/book/title-page.html), especially:
   - [Common programming concepts](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html)
   - [Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) (take your time with this one)
   - [Structs](https://doc.rust-lang.org/book/ch05-00-structs.html), [enums and pattern matching](https://doc.rust-lang.org/book/ch06-00-enums.html),
     [vectors](https://doc.rust-lang.org/book/ch08-01-vectors.html), and [hash maps](https://doc.rust-lang.org/book/ch08-03-hash-maps.html)
   - [Packages, crates, and Cargo](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html) (skim)
   - [Error handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
   - [**Writing tests.**](https://doc.rust-lang.org/book/ch11-00-testing.html) This one is important: you'll need to
     write unit tests for your back-end code.
   - [Generics, traits, and lifetimes](https://doc.rust-lang.org/book/ch10-00-generics.html)

   Run [`cargo clippy`](https://doc.rust-lang.org/clippy/index.html) to catch problems in your Rust code.
3. **Tauri.** You don't need to know much to start. The important part is how the front end talks to the back end:
   [what Tauri is](https://v2.tauri.app/start/), [calling Rust from the front end](https://v2.tauri.app/develop/calling-rust/),
   and [state management](https://v2.tauri.app/develop/state-management/).

## Your first contribution

Read the WINGS [README](https://github.com/UMN-Rocket-Team/WINGS), [wiki](https://github.com/UMN-Rocket-Team/WINGS/wiki),
and [CONTRIBUTING.md](https://github.com/UMN-Rocket-Team/WINGS/blob/main/CONTRIBUTING.md), then ask at a worktime for a
starter task. WINGS works, but what flew at IREC 2025 was closer to a proof of concept than a finished product, so there
are plenty of bugs and features to pick from.

The Drive also has older hands-on tutorials from 2023 ("Hello World and Beyond", which builds a small Tauri and SolidJS
app step by step). Some of the setup details are out of date, but the SolidJS component examples still apply.
