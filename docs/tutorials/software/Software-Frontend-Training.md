# Software Training Tutorials

## Installation & Setup

### 1. Download [VScode][extern1] 
VSCode is an IDE (Integrated Development Environment). An IDE is meant to be an all-in-one workspace for a developer, this is where you will be writing any of your code.

### 2. Download [Git][extern2]  
git is what allows us to backup and collaborate on the project

[extern1]: https://code.visualstudio.com/download
[extern2]: https://git-scm.com/downloads

### 3. Install [Nodejs](https://nodejs.org/en/download)  
This will be necessary to run and install Typescript

### 4. Download [pnpm](https://pnpm.io/installation)  
This is the package manager we will use to install and update dependencies

### 5. Install [Rust](https://www.rust-lang.org/tools/install)
Note that Windows users will need to install the Microsoft C++ build tools when prompted by the installer, this is about a 3GB download

once its installed 

## First Javascript Project
### Creating a Tauri app 
0. Using the `cd` command, navigate into a directory where you will be making your new app(not an empty folder)
1. Execute `pnpm create tauri-app`
* when given options for setup, select:
   * Whatever the default identifier is
   * Typescript/Javascript
   * Pnpm
   * SolidJS
   * Typescript
3. Execute `cd your-project-name-here`
4. Execute `pnpm install`

If you open the newly created folder in VScode, you will see that there are framework folders inside it. This is a starter kit for you to build your app off of.  
* Execute `pnpm tauri dev` to compile your code and run it
* Rust code is held within src-Tauri
* Typescript code is held within src

###  Create a local repository 
0. Reopen the project directory in VScode
1. Open the terminal and make sure you are within the project directory
1. Run `git init` to register that folder with git as a repository
2. Run `git add .`
3. Run `git commit`
> This will open a file called something like "COMMIT_EDITMSG", whatever you type into the file will be the name of your commit.

> The commit won't happen until you close the commit message file, so if you don't type anything into the file and close it the commit gets aborted.

> If you want to bypass the file process you can type in `git commit -m my_commit_name`  but replace my_commit_name with what you want to name your commit

Your local repository now contains the entire Tauri project. 
to make back ups of your code, run `git add .` followed by `git commit`

### Coding a TSX function
Currently, the front-end page is being stored within the App.tsx file  
Within the App TSX function, there is a block of logos in a row, we are going to generalize these logos with a TSX function  
|before|after|
|------|-----|
|![image](https://media.github.umn.edu/user/26316/files/85d6af9c-52f2-4c79-af0a-8029e264eefe)|![image](https://media.github.umn.edu/user/26316/files/40bc8d34-287d-482e-885a-d86497f2781a)|

Create the icon function right beneath the import statements. Because it is a TSX function it needs to be structured like so:

``` ts
let iconFunction = (link: string, imageSRC: string, name: string) => {
    //code to format any input strings
    return(
       //html here
    );
```
Tips for completing the function:
* Don't worry about the alt text being capital, you can leave it lowercase.
* Variables can be put into html fields using `{}` (ie. `{logo}` in the original HTML image for solidjs

### Bonus Activity:
[Add the Rocket team logo to the list!][rktimg1]  

You will also need to add an extra class to the App.css file  

[rktimg1]: https://drive.google.com/file/d/1zGbHqxvaGmoX7hIZPeAfRC4xmC45U050/view?usp=sharing  

<img width="458" alt="image" src="https://media.github.umn.edu/user/26316/files/3b091523-f6a9-4018-bd3a-c8e255772530">












# Section 2. Learning SolidJS

## Section 2 Reference Material:
[Official SolidJS tutorial](https://www.solidjs.com/tutorial/introduction_basics)   
[Odin project(for Javascript,HTML,CSS)](https://www.theodinproject.com/)   
## Section 2 Activity:
### World's most over-engineered calculator

To learn the ins and outs of solidJS we are going to turn the default Tauri preset into a calculator.  

0. To start we should rename the two signals(greetMsg & name) to be more fitting to a calculator:  
```ts
  const [output, setOutput] = createSignal("");
  const [input, setInput] = createSignal("");
```
Make sure to rename the variables everywhere in the code(the easiest way is by hitting F2 when the variable is selected in vs code)

1. The calculator will need its own UI so we will need to rework the existing form and button: 
  * Delete the Greet button
  * Cinside the `input` element change the placeholder tag from "enter a name" to "enter a number"

2. Just like a real calculator we only have 1 input box, so we will need to add a way to store both the number before an operation along with the current operation.
  * neither of these are going to be displayed with HTML so we can define them as regular variables

```ts
  let savedNum: number | null = null;
  let savedOperation: Function | null = null;
```

3. Now we can add buttons for our operations after the text input inside the `<form>` element:
```html
<br></br>
<br></br>
<div class="row">
  <button type = "reset" onclick={() => runOperation((a: number,b: number) => a + b)}>+</button>
  <button type = "reset" onClick={() => runOperation((a: number,b: number) => a - b)}>-</button>
  <button type = "reset" onClick={() => runOperation((a: number,b: number) => a * b)}>X</button>
  <button type = "reset" onClick={() => runOperation((a: number,b: number) => a / b)}>/</button>
  <button type = "reset" onClick={() => runOperation(null)}>=</button>
</div>
```
`<br>` tags are used as line breaks(just to format the output)  
`<div>` just defines a group of elements to which we want to apply an attribute, in this case, we put them in a row  
`<button>` is a button
  * The `type` variable is used to tell the form that the button clears the input box
  * The `onClick` variable gives the button a function that it will execute when clicked  
    * The `() =>` syntax defines a function that returns the `runOperation` function. If it wasn't there we would be giving the output of runOperation.   

`runOperation` is a function we will be defining ourselves, it will be responsible for doing the calculator's math.  

4. We can now implement the runOperation function to make the calculator work
the runOperation function will take a calculation function as one of its parameters, it will also be able to check the input() Signal to see what is in the input box. It will update the output directly so it doesn't have to return anything. 
```ts
let runOperation = (newOperation: Function | null) => {
    //Todo in step 5
  };
```
<br><br/>
your app should now look something like this:  
<img width="295" alt="image" src="https://media.github.umn.edu/user/26316/files/c88349f1-478e-42f3-a4cc-9f3c7235665e">  

5. Fill out the runOperation function according to the following requirements:
  * If there isn't a valid number in the calculator input, don't do anything  
  * If there is stored data from a previous function call, do the saved operation on the saved number, and the number in the input box, and store the new value as the new saved number  
  * If the last operation was an equal sign, save the number in the Input box to the SavedNum variable  
  * save the operation function given as a parameter so it can be referenced by the next function call
  * if the current operation is an equal, or there has been an operation that was performed, update the output to show the saved number
  * reset the input signal to match the input box

### Adding Memory
Let's display a list of the calculator's answers, to that we will need to implement a store function

0. Define an object type called answer, it contains an id and text:

```ts
type Answer = {
  id: number,
  textStored: string 
};
```
1. Next we can modify the output signal into a store, we will need to create an empty array of Answers in order to initialize it:

```ts
  let answerArray : Answer[] = [];
  const [output, setOutput] = createStore(answerArray);
  let outputID = 0;
```
outputID will be used to assign each ANswer a different id number
2. To better reflect the fact that the variable is a store, rename output and setOutput to outputs and setOutputs

3. Create an addOutput function, this will create a new array that includes the existing array with one extra element added on:

```ts
  const addOutput = (textInput: string): void => {
    setOutputs([...outputs, { id: ++outputID, textStored: textInput}]);
  }
```
this should now be called by runOperation instead of setOutput

4. Next we should replace `<p>{outputs}<p/>` with a display format that supports Stores

```ts
<For each = {outputs}>{(answer) => {
  const { textStored } = answer;
  return <div class = "row">
    <input type='checkbox' onClick={() => deleteOutput(answer)}>X</input>
    <span>{textStored}</span>
 </div>
}}</For>
```

* The `For` element acts like a for each loop, where each element in outputs is iterated through and assigned to the variable answer
* by setting the input type to `checkbox` we create a little checkbox button
* The `span` element is purely decorational like `div`

5. finally we need to define a deletOutput function(right next to addOutput)

```ts
const deleteOutput = (answerToDelete: Answer): void => {
    setOutputs(outputs.filter(answer => answer !== answerToDelete));
  }
```

The filter function returns a list that has all elements that match a condition( in this case not being the element we want to delete)











# Section 3. Introduction to Rust

For learning rust we will be using a different format than the previous two sections. Each rust related topic will have its own activity that you can work on. The activities are similar in format to the labs you see in compsci classes where you have to fill in certain funtions in order to make the entire project work.   
Activities will be stored in zip files, and instructions for the activities will be contained in the README.md file inside the zip folder.
Each section has set Readings and Videos to go along with it. These cover the exact same content you don't need to do both.  
Readings come from the digital [rust book](https://doc.rust-lang.org/book/).  
For videos you can choose between two video playlists:  
[Lets Get rusty](https://www.youtube.com/playlist?list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8)  
[Tom McGurl](https://www.youtube.com/playlist?list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6).  
<p><br/><br/><p/>     

The playlists and the book all cover the same topics    
**YOU DO NOT NEED TO DO ALL THREE**   

|Topic|Reading|Video|Activity|
|-----|-------|-----|--------|
|Common Programming Concepts|[Rust book Chapter 3](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html)|[Rusty video 3](https://www.youtube.com/watch?v=2V0JaMVjzws&list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8&index=3) or [McGurl video 2](https://www.youtube.com/watch?v=x4P7UGk-3wo&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=2)|WIP|  
|Ownership|[Rust book Chapter 4](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)|[Rusty video 4](https://www.youtube.com/watch?v=VFIOSWy93H0&list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8&index=4) or [McGurl video 3](https://www.youtube.com/watch?v=Poll5Q19qRA&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=3) [& McGurl video 4](https://www.youtube.com/watch?v=l8QbPDHvoLw&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=4)|WIP|
|Structs|[Rust book Chapter 5](https://doc.rust-lang.org/book/ch05-00-structs.html)|[Rusty video 5](https://www.youtube.com/watch?v=n3bPhdiJm9I&list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8&index=5) or [McGurl video 5](https://www.youtube.com/watch?v=Iy5pvVPZT50&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=5)|WIP|





















***
<p><br/><br/><p/>  

***
<p><br/><br/><p/>  

***

# Reference









## Command Line Interface

CLI (Command line interface) is an alternate way for you to navigate and use your computer. CLI is a predecessor to the GUI (the modern system of using a mouse and having buttons on the screen). The CLI essentially acts as a way to use your computer without a mouse, it lets you navigate directories, and execute commands at those directories. A programmer must learn CLI because applications like git and pnpm are built to be accessed through CLI, and do not have a native GUI for programmers to use.
Each operating system has its own Terminal Application to access CLI, The names of the Terminal Applications are as follows: 

* Linux/MacOS: 'Terminal'  
* Windows: 'Command Prompt'


### Learning how to navigate directories  

When using CLI, the commands you execute will often apply to the directors currently displayed in the Terminal application.   
Navigating files is primarily done through the command `cd`. Attached are some command prompt tutorials, but generally knowing how to use the cd command on your operating system is the most important.

* Linux/MacOS:  
  [Tutorial_1](https://www.digitalocean.com/community/tutorials/an-introduction-to-the-linux-terminal)  
  [Tutorial_2](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview)
* Windows:  
  [Tutorial_1](https://www.cs.princeton.edu/courses/archive/spr05/cos126/cmd-prompt.html)  

 *** 















## Git & Github

The Git-github ecosystem is the primary way programmers collaborate on projects. Git is used locally to manage different versions of your project in an intuitive way, while GitHub is used to quickly share and collaborate on projects. Note that Github was built to be used through terminal, but there are multiple other ways to use it(such as the built-in GUI for VScode, or a standalone GUI like fork)


## Git
In order to keep track of your project changes, Git lets you store versions of your project in a timeline called a "repository" (sometimes shortened to repo).  
  
![image](https://media.github.umn.edu/user/26316/files/40c99fe8-a6e4-48c6-bef4-e3e9ffd12753)


To add a version to the repository you have to stage the changes you've made since the last version, and then "commit" those changes, Because of this project iterations in a repository are often called "git commits"  
```
git add .
git commit
```
> The `add` command stages changes so that they can be committed, using `.` adds all files that have been changed.  
> The `commit` command is then used to commit all staged changes  

Because git doesn't just store versions linearly, you can also have multiple working repository "branches"  
  
![image](https://media.github.umn.edu/user/26316/files/efc50feb-3bf1-4369-8479-6d51846c8133)
> Branches are made with the `branch ''` command ie. `git branch test` to create a test branch
>> Each branch is defined by its most recent commit. The first branch that the project is started from, is normally just called `Main`.  
>> `Head` is the branch that your next commit will be added onto.
>> Switching where the Head is can be done using the `switch` command ie. `git switch test`











## Using Git with Github

### Remote Repositories
GitHub is a service that stores remote repositories on their own servers. These repositories can be viewed through the GitHub website

To create your own Repository: 
0. Open up a page on the UMN Git Hub. Any page. This wiki page you're on right now works great.
1. In the upper-right corner of any page on github, click the "+" and select New repository.
2. In the "Repository name" box, type hello-world.
3. In the "Description" box, type a short description.
4. Select whether your repository will be Public or Private.
5. Select Add a README file.
6. Click Create Repository.












### Git commands

|Command             |Explanation|Picture|
|--------------------|-----------|-------|
|`git clone repo.git`|<p>Creates a local clone of the remote repository. <br/> repo.git is replaced with the https link found within the green "<>code" button on a repositories code tab:<br/><img width="638" alt="image" src="https://media.github.umn.edu/user/26316/files/28c99e97-a95e-40d2-89b5-61bba17b7dbd"><p/>|![image](https://media.github.umn.edu/user/26316/files/b363a356-bfab-4cb6-8851-32540c587f4f)|
|`git push`          |<p>When you have made changes to your local repository, they don't automatically apply to the remote, and just stay on your local cloned repository.<br/><br/>The `git push` command has to be used to update a remote branch with all the commits you've added to your local branch  <p/>|![image](https://media.github.umn.edu/user/26316/files/c08f7574-48fc-4abf-a8f0-b387b6f2ca37)|
|`git fetch`         |<p>When changes have been pushed to the remote repository by someone else, your local repository won't automatically update either. <br/><br/> To update the branch you are currently viewing with new commits from the remote, you can use the `git fetch` command|![image](https://media.github.umn.edu/user/26316/files/9f509740-347f-4275-bd63-e5f2a902014a)
|`git pull`          |<p> When changes have been made to two different branches, git pull allows you to integrate the changes of one branch into the branch you are working on.<br/><br/> This can be incredibly useful when updating your branch to changes that someone else has made on the remote<br/><br/><br/><br/><br/><br/>Git pull can also be used to join branches back Together. This allows branches to be used as isolated workspaces for a specific feature. giving you the assurance that other developer's commits won't mess with your code|<p>![image](https://media.github.umn.edu/user/26316/files/08ec46a2-22d6-4014-9be6-a439198be837)<br/>![image](https://media.github.umn.edu/user/26316/files/1d9bc111-594d-4858-a6e6-cc2bae44857d)
<p/>

Practicing these commands:

0. Download [git](https://git-scm.com/downloads)
1. On the UMN GitHub website, navigate to the repository you made in the last section. 
2. Press the green button that says `<> code` on the top right
3. In the window that appears navigate to the "HTTPS" tab
  * ![image](https://media.github.umn.edu/user/26316/files/518d940a-e798-4746-b8c7-070043609877)
4. Press the button to copy the https link to your clipboard
5. Open an application with a command prompt
6. Use the `cd` command to navigate to an empty folder, you can use the tab key to cycle between options that auto-complete the command
7. Type `git clone` 
8. Add a space and paste the link you copied onto the same line
9. Press enter to run the command  

This should have generated a folder with the new README inside of it, you now have a local clone of the GitHub repository you made in the last section

10. In your file system, navigate to the folder you selected
11. Find the README.md inside and open it in a text editor or IDE
12. Inside the file, 
  * add two spaces after "My first repository!" (In .md files, two spaces indicate a new line)
  * on the next line, write something along the lines of: "This is my first Change", then save the file
  * ![image](https://media.github.umn.edu/user/26316/files/8f51de63-4e49-4448-b21b-99e6d3101c8a)

13. Returning to the Terminal application use `cd` to navigate into the newly generated folder
14. Enter the command `git add .`
15. Enter the command `git commit`
  * ![image](https://media.github.umn.edu/user/26316/files/e5e92266-a026-4785-abc2-f02de0b3866e)
16. In the file that gets opened, use the first line to type in a description of the changes you made in step 12 ie. "added a new line to README"
17. Save and close the file to finish the commit

you have now committed a change to your local repository(set up in steps 1-9) but those changes haven't been applied to the repository on GitHub. If you look on the repository GitHub page the file will still be displayed as 2 lines. In order to send your changes to the GitHub repository you need to use the push command.

18. reopen the terminal and navigate back to the directory with your repository
19. in the terminal run `git push`

You have now pushed your changes to the remote server. If you reload the repository page the changes should be present.

Right now, you are the only contributor to your GitHub repository, but one of the main benefits of a remote repository is that multiple people can use it. To simulate someone else pushing to your repository we are going to make a change directly on the GitHub website.

20. Go to the code page for your repository
21. Press "add file"
22. press "Create new file"
  * <img width="630" alt="image" src="https://media.github.umn.edu/user/26316/files/6f1ca2ef-63f4-4b7a-95a7-b6f261da6998">

23. Name the file "second_file.txt"
24. Add some txt or code to the file (note that you can't run the code, which is why we don't normally add files this way)
25. Click `commit to the main branch` at the bottom of the text box

Note that if we return to our local repository the new file isn't there, so if someone else had added code to our project, our files wouldn't automatically update. To update our local files to the new changes, you need to run the pull command.

26. Using the terminal, navigate to the repository directory
27. Run the `git pull command`

If you navigate to the local repository file, you will see that second_file.txt has been pulled onto your local repository, you can now change it, commit it, and push those changes back to the remote.

### The Github website
Just like Git, there are multiple ways to use Github, but the primary way is through the GitHub website. In addition to storing repositories, github also allows you to view and interact with them in different ways.  
<p><br/><p/>  

**Wiki Page**  
If you are reading this wiki through the GitHub website then you are on the Wiki Tab, this allows developers to write a wiki for their code and attach it to the repository.  
Wiki pages are written in markdown, and are edited in commits just like a repository, unlike a repository you can make commits without git, right here on the website.
<p><br/><p/>  

**Code Page**  
The code page allows you to view the contents of a repository, you can browse between the last commit of every branch in the repository and see the commits inside. This is also where you go to find the html link for cloning the git repository.
<p><br/><p/>  

**Issues Page**
The issues page is a forum/tasklist where you can communicate with everyone else working on the repository. 
Issues are added by anyone and are used to describe a feature or change that needs to be added to the codebase, 
Larger Issues are split into smaller tasks that can be completed like a checklist. Once an issue is created it can be assigned to a GitHub user to denote that they are working on the problem

Making an Issue on your repository

0. Navigate to your repository on the UMN GitHub website
1. Navigate to the issues page
2. Press the `new issue` button on the top right
  * <img width="800" alt="image" src="https://media.github.umn.edu/user/26316/files/51c90733-3b17-40db-a774-e21496744a57">
3. Give your issue a title like "bad grammar in README.md"
4. Use the task list feature (on the toolbar at the top of the text box) to add some tasks for your issue
  * <img width="645" alt="image" src="https://media.github.umn.edu/user/26316/files/ab19f495-e308-4f53-b9af-eb6f4d5f1d3c">
5. Use the labels menu on the right-hand side to give the task some labels
  * ![image](https://media.github.umn.edu/user/26316/files/e919b74b-0aa7-4104-a4d9-276580cc0638)

6. Press `Submit new Issue`

By submitting an issue you allow other people working on the repository to be more informed about what needs to get done. To let others know you are working on an issue, you should assign it to yourself.

7. Try assigning yourself to the issue with the menu on the right-hand side
8. Try marking tasks as complete, notice how the task tracker at the top of the screen changes
9. Add a comment with an extra task, notice that the total number of tasks increases
10. Try returning to the main issue tab notice that you can see who is assigned and the tasks within the list card.
11. Once you feel like you have a good understanding of the issue UI, press the close the issue button in the comment section of your issue.

When working on projects work will be distributed via Issue













## Programming Basics With Typescript  

The front end of the Wings ground station is programmed using Typescript. Typescript is a version of Javascript that is statically typed, meaning that variables can restrict what type of data can be assigned to them. 

### Variables  
Variables can be declared with or without value  
```ts
let x = 1;
```
```ts
let x: number;
x = 1;  
```  

### Constants
Constants are declared using the const keyword  
```ts
const y = 3;
```

### Conditional statements
Note that three equal signs are used when checking equality
```ts
if (y === 4){
    console.log("blah");
} else {
    console.log("blue");
}  
```   

### Loops
for loops have nearly identical syntax to those of Java and other C-based languages  
```ts
for (let i = 0; i < 5; i++) {
  console.log(i.toString());
}
```
### Export and import statements

To let another file use your variables, you need to add an export statement like so:  
```ts
export let testVar: string = "HellowWorld!";
```

To then use your exported variable somewhere else you need an import statement  
```ts
import testVar as newName from "file/path";
console.log(newName);
```

***









## Solid JS

Solid JS is a framework that makes it easier to have reactive application elements that can change in response to user input. 

With Solid JS, HTML components can be passed as variables through the use of functions in a form called TSX
```ts
function HelloWorld() {
  return <div>Hello World!</div>;
}
```
TSX is its own language and needs to be put in .tsx files. However, you don't need to worry about learning another programming language since tsx is just typescript, with the added functionality of HTML components. 
> Keep in mind that the component functions in TSX always need to return only one component.  
>This doesn't work:  
> ```html
> return <div>Hello</div><div> World!</div>
> ```
> But this does since there is only one component overall:
> ```html
> return <div><div>Hello</div><div> World!</div></div>
> ```

Components can then be used in other TSX components, allowing for more reactive development, where sections of the display are dynamic and change according to variables  (think of a social media feed, where each post is identical in form, but also highly dependent on data).  

In order to actually render something you have to use the following command:
```ts
render(() => <HelloWorld />, document.getElementById("root"));
```
> `<HelloWorld />` is the component we defined before, and `"root"` is an HTML element we can insert the variable into for it to actually get displayed.

***













## OOP with Typescript  

### Custom Types
In Typescript, Types are essentially mathematical sets or arrays, and operators such as | can be used to conjoin them
```ts
type Result = "pass" | "fail";    //this type can only hold 2 values
type Numstring = number | string; //This type can hold any value that is a number or string
```

### Functions
Functions in typescript can be declared like so:
```ts
function bar(input: number) => string | number {
    if (input == 1) {
        return “Hello world!”;
    } else {
        return 0;
    }
}
```

Note that the function syntax is as follows:  
```ts
function functionName(parameter: paramaterType) => ReturnType {code;}
```

Functions are also variables and can be re-assigned.  
to prevent them from being re-assigned they can be declared as constants like so:  
```ts
const functionName = (parameter:paramaterType) => {code;}
```

###  Objects
Objects are groups of variables under a single "object" name. Unlike other languages like Java and Python, Javascript objects are not always defined in a class and don't have functions tied specifically to them. Objects just act as a grouping of variables that can be easily accessed.
just like variables, objects can be declared with or without assigned values
```ts
let pizza = { slices: 8, flavor: "pepperoni" };
```
```ts
let pizza = { slices: number, flavor: string };
pizza.slices = 8;
pizza.flavor = "pepperoni";
```
(Note that I was hungry when writing this section)

*** 





































