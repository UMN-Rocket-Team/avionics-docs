---
layout: default
title: Backend
parent: Software
has_children: false
nav_order: 1
permalink: /docs/tutorials/software/backend
---

# Rust Intro
The goal with this exercise is to learn the basic syntaxes of Rust and putting them together to build a Magic 8 Ball program that outputs a text response from a question and exits when the phrase "Goodbye" is sent to stdin.

To begin this exercise, you'll have to install the Rust tool chain following [this](https://Rust-lang.org/tools/install/) guide.

Once Rustup is installed, verify your installation by running ```Rustc --version``` in your terminal.

Cargo is the package manager of the Rust ecosystem, you can find documentation on how to use it [here](https://doc.Rust-lang.org/cargo/), but the commands necessary to complete this exercise will be listed in the steps below.

## Setup
1. Create a new Rust crate by executing ```cargo init``` in your terminal. This will create your src folder with a file named main.rs (the entry point of your application) and your Cargo.toml file (the file that describes the metadata and dependencies of your application).
2. In the main.rs file you should already have a working example of Rust's hello world.
3. Once your package is created, add the rand crate to your application by executing ```cargo add rand``` in your terminal as we will be needing it to create our Magic 8 Ball.
4. If you are using VSCode, ensure that you have the Rust Analyzer extension installed, as it is necessary to program in Rust happily.

## Concepts
### Variables
All variables in Rust are *immutable* by default. If you would like to change the mutability of a variable such that you can assign it a new value after declaration, you must declare it as *mut*
```Rust
let mut x = 0;
x += 1;
```
Attempting to assign a new value to an immutable variable will result in a compiler error
```Rust
error[E0384]: cannot assign twice to immutable variable `x`
--> src/main.rs:3:5
|
2 |     let x = 0;
|         - first assignment to `x`
3 |     x += 1;
|     ^^^^^^ cannot assign twice to immutable variable
|
help: consider making this binding mutable
|
2 |     let mut x = 0;
|         +++
```

### Strings, strings, and things
Rust does not have one data type to represnt a String, and the difference between them is memory allocation.
A *string* or ```&str``` in Rust is a static data type. A ```&str``` is *stack* allocated.
A ```String``` however, is *heap* allocated.
You are able to simply convert between the two when necessary, and knowing when to do so is a key part of writing faster and more efficient Rust programs.
```Rust
let my_str: &str = "This is a &str";
let my_string: String = "This is a string".to_string();
```
Notice how we had to call the ```to_string()``` function to declare a ```String``` from static text. This is telling the compiler to take our static string of characters and move it to the heap.
You can declare an empty string by calling ```new();``` from the String struct implementation.
```Rust
let my_empty_string = String::new();
```

To get a &str from a String, we simply call ```.as_str()``` on our String
```Rust
let my_new_str: &str = my_string.as_str()
```

A thing to note, just as there are multiple data types to represent strings/Strings, we also have distinct data types for different integer/float primitives.
```Rust
// signed integers
let my_i8: i8 = -1;
let my_i16: i16 = -1;
let my_i32: i32 = -1;
let my_i64: i64 = -1;
let my_i128: i128 = -1;
let my_isize: isize = -1;

// unsigned integers
let my_u8: u8 = 0;
let my_u16: u16 = 0;
let my_u32: u32 = 0;
let my_u64: u64 = 0;
let my_u128: u128 = 0;
let my_usize: usize = 0;
// a _size is an signed/unsigned integer that is the same size as the current operating systems architecture i.e. 32bit/64bit

// floats
let my_f32: f32 = 0.0;
let my_f64: f32 = 0.0;
```

### Arrays/Vecs
In Rust an Array is a statically sized collection of items that is stack allocated, whereas a Vec is a dynamically sized collection of items that is heap allocated.

```Rust
let my_array: [&str; 2] = ["one", "two"];
let my_vec: Vec<&str> = vec!("one", "two");
```

Notice how my_vec is being created by a macro in the last example.
There are other ways to declare and fill a Vec as well.
```Rust
let mut my_vec: Vec<&str> = Vec::new();
my_vec.push("one");
my_vec.push("two");
```
or if you would like to predefine a capacity for the Vec (which can help speedup allocations/deallocations by ensuring the runtime provisions a proper block of memory to avoid hopping addresses in the RAM) you can declare it like this
```Rust
let mut my_vec: Vec<&str> = Vec::with_capacity(2);
my_vec.push("one");
my_vec.push("two");
```

Both arrays and vecs can be indexed directly
```Rust
assert_eq!(my_array[0], "one");
assert_eq!(my_array[1], "two");
assert_eq!(my_vec[0], "one");
assert_eq!(my_vec[1], "two");
```

### Loopdy Loops
1. If you would like to denote an infinite loop, you can simple use the ```loop``` keyword.
    ```Rust
    loop {
        do_forever();
    }
    ```
2. ```while``` loops function very similarly in Rust as most other languages
    ```Rust
    while true {
        do();
        break;
    }
    ```
    This while loop will execute do() once and break the loop.
3. ```for``` loops in Rust are quite different from most other languages, and are made to be very simple to declare
    ```Rust
    for [variable_name] in [iterator] {
        do();
    }
    ```
    This for loop will continue to ```do()``` until the iterator has reached its end. Rust has a number of ways to extract iterators from structs (Vecs, Arrays, etc.) but the simplest is a Range.
    ```Rust
    for x in 1..10 {
        println!("X: {}", x);
    }
    ```
    This for loop will print a new line for every value of ```x```. Notice the formatting template in the call to the ```println``` macro.
    The ```println``` macro accepts a format string for it's first parameter, and then accepts any number of variables that implement the Display/Debug trait to replace ```{}``` and ```{:?}``` respectively for its following parameters.

### Weighing Options, Obtaining Results
In Rust there is no concept of ```null```. This is a difficult thing to get your head around coming from other languages.
Anything that could return nothing, instead returns something. What that something is, is an
```Rust
Option<T>
```
Options are an enum wrapper around a data type. There are two branches to an Option enum.
```Rust
let my_none: Option<&str> = None;
let my_some: Option<&str> = Some("my wrapped &str");
```

A very common pattern in Rust, is to utilize options where you *expect* there to be nothing returned, and you handle both cases accordingly using the ```match``` keyword.

```Rust
let my_option: Option<&str> = Some("my option has some");
match my_option {
    Some(my_str) => {
        println!("{}", my_str);
    },
    None => {
        println!("my option has none")
    }
}
```

In an instance where you are *not* expecting None, and you would like to handle that as an error, we would use a
```Rust
Result<T,E>
```
Let's say we have a function called ```check_my_option``` where we want to inspect our Option, and if there is None, we return an error and then return it to the calling function. The following snippet is an example of how we would attain that functionality.
```Rust
#[derive(Debug)]
struct ReadOptionError();

impl std::fmt::Display for ReadOptionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "there is none")
    }
}

impl std::error::Error for ReadOptionError {}

fn main() {
    let my_option: Option<&str> = Some("there is some");
    match check_my_option(my_option) {
        Ok(my_str) => println!("{}", my_str),
        Err(err) => println!("{}", err),
    }
}

fn check_my_option(my_option: Option<&str>) -> Result<&str, ReadOptionError> {
    match my_option {
        Some(my_str) => Ok(my_str),
        None => Err(ReadOptionError())
    }
}
```

Woah, that was a lot of new stuff really quick. Let me explain it quickly so we don't get too overwhelmed.

Here we declare an empty struct with a *derive* attribute. This attribute lets us apply trait derive macros to quickly add built in functionality to our structs.
```Rust
#[derive(Debug)]
struct ReadOptionError();
```
The most common derive macros that you should familiarize yourself with are
```Rust
#[derive(Clone, Copy, Debug, Default, Eq, Hash, PartialEq)]
```
I won't be going into them all right now, but the thing to know is that these all provide default implementations of Traits which is Rust's way of defining *shared* behavior. Eventually, you will be writing your own derive macros, but that is a pain in the ass so don't worry about it for a long time.

Speaking of implementing Traits, this is how we define an *implementation*.
```Rust
impl std::fmt::Display for ReadOptionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "there is none")
    }
}
```

Here, we are implementing the std::fmt::Display trait for our ReadOptionError. This trait is required by the next trait we implement. This also allows us to template our error directly into our ```println``` macro that we call in our ```main()``` function.
```Rust
impl std::error::Error for ReadOptionError {}
```
As std::error::Error requires no function definitions for a struct to implement it, we leave our implementation empty.

Finally, notice how we never actually use the ```return``` keyword, but we're returning our value from ```check_my_option()```.
Rust will implicitly return the final expression of a statement when there is no ```;``` punctuating it.

### Hey Man Can I Borrow Your Variable
Have you noticed the '&'s? These are borrows.

In the previous example we declared a variable and sent it to a function. Everything was working great.
However, if we were to try to call that function twice with a String as our declared variable, what happens?
```Rust
fn main() {
    let my_option: Option<String> = Some("there is some".to_string());
    match check_my_option(my_option) {
        Ok(my_string) => println!("{}", my_string),
        Err(err) => println!("{}", err),
    }
    match check_my_option(my_option) {
        Ok(my_string) => println!("{}", my_string),
        Err(err) => println!("{}", err),
    }
}

fn check_my_option(my_option: Option<String>) -> Result<String, ReadOptionError> {
    match my_option {
        Some(my_string) => Ok(my_string),
        None => Err(ReadOptionError())
    }
}
```
We get a compiler error
```Rust
error[E0382]: use of moved value: `my_option`
  --> src/main.rs:18:27
   |
13 |     let my_option: Option<String> = Some("there is some".to_string());
   |         --------- move occurs because `my_option` has type `Option<String>`, which does not implement the `Copy` trait
14 |     match check_my_option(my_option) {
   |                           --------- value moved here
...
18 |     match check_my_option(my_option) {
   |                           ^^^^^^^^^ value used here after move
   |
note: consider changing this parameter type in function `check_my_option` to borrow instead if owning the value isn't necessary
  --> src/main.rs:24:31
   |
24 | fn check_my_option(my_option: Option<String>) -> Result<String, ReadOptionError> {
   |    ---------------            ^^^^^^^^^^^^^^ this parameter takes ownership of the value
   |    |
   |    in this function
help: consider cloning the value if the performance cost is acceptable
   |
14 |     match check_my_option(my_option.clone()) {
   |                                    ++++++++
```
In the previous example, we were sending a &str which can be *Copied*. Our value wasn't actually sent directly to the function, but a cheap *Copy* was created that was then processed by the function. So how do we send our value there directly without our Move error?

The answer is, we don't. We send a borrow of that variable instead, which lets us Move a reference to our value without relinquishing ownership to another function. Without a borrow, Rust would free our variable at the completion of our first ```check_my_option``` call.
```Rust
fn main() {
    let my_option: Option<&String> = Some(&"there is some".to_string());
    match check_my_option(my_option) {
        Ok(my_str) => println!("{}", my_str),
        Err(err) => println!("{}", err),
    }
    match check_my_option(my_option) {
        Ok(my_str) => println!("{}", my_str),
        Err(err) => println!("{}", err),
    }
}

fn check_my_option(my_option: Option<&String>) -> Result<&String, ReadOptionError> {
    match my_option {
        Some(my_str) => Ok(my_str),
        None => Err(ReadOptionError())
    }
}
```

## Oh Magic 8 Ball Can I Finally Write You
Yes, but here are some important things you might want to know to help you along.

1. Throughout the concepts portion, I am directly referencing various definitions through their full import path ```std::error::Error```.
    You could instead import ```std::error``` through a ```use``` statement and reference Error through the import.
    ```Rust
    use std::error;
    ...
    impl Error for ReadOptionError {}
    ```
    This is useful if you're going to be using a lot of things from a single crate.

2. You can ```match``` anything, not just an Option or a Result.
    ```Rust
    let x = 0;
    match x {
        0 => println!("Ope it's zero."),
        _ => println!("Ope it's another number")
    }
    ```
    Our ```_``` branch in our match is the *default* branch and can be used as a catch-all for pattern matching.

3. To recieve input from a command line, we are going to be calling the *stdio* function from std::io and storing the result in a variable like so.
    ```Rust
    let stdio = std::io::stdio();
    ```
    From here, we can call the *read_line()* function on our new stdio struct, which will save io input into a String buffer.
    ```Rust
    let mut buffer = String::new();
    stdio.read_line(&mut buffer);
    ```
    We must not only borrow our buffer string, but explicitly borrow it as *mutable*, as read_line will mutate the value of the borrowed variable.

4. You can easily generate a random integer from the rand crate by calling ```rand::from_range(R)``` and passing in a Range as an argument.

5. Input from stdin will contain a *new line* character at the end (```\n```), make sure to account for this if you are matching input to an expected value

Here is the data your Magic 8 Ball should rely on for responses, this constant can be placed outside of your main function below your imports
```Rust
const RESPONSES: [&str; 20] = [
    // Affirmatives
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    // Non-committal
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    // Negatives
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];
```

This should be all you need to know to get a fully functioning Magic 8 Ball up and running in Rust, but if you run into any problems, please open an issue in the repo and I will respons as quickly as possible.

### Extra Credit
1. Match the last character of your input to ensure you are getting a question. If the input is not a question, return a generic response.
2. Actually print a Magic 8 Ball using a generated string with the response in the center

### More Resources/Video Breakdowns
Readings come from the digital [rust book](https://doc.rust-lang.org/book/).  
Videos are from two video playlists:  
[Lets Get rusty](https://www.youtube.com/playlist?list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8)  
[Tom McGurl](https://www.youtube.com/playlist?list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6).

|Topic|Reading|Video|
|-----|-------|-----|
|Common Programming Concepts|[Rust book Chapter 3](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html)|[Rusty video 3](https://www.youtube.com/watch?v=2V0JaMVjzws&list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8&index=3) or [McGurl video 2](https://www.youtube.com/watch?v=x4P7UGk-3wo&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=2)|  
|Ownership|[Rust book Chapter 4](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)|[Rusty video 4](https://www.youtube.com/watch?v=VFIOSWy93H0&list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8&index=4) or [McGurl video 3](https://www.youtube.com/watch?v=Poll5Q19qRA&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=3) [& McGurl video 4](https://www.youtube.com/watch?v=l8QbPDHvoLw&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=4)|
|Structs|[Rust book Chapter 5](https://doc.rust-lang.org/book/ch05-00-structs.html)|[Rusty video 5](https://www.youtube.com/watch?v=n3bPhdiJm9I&list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8&index=5) or [McGurl video 5](https://www.youtube.com/watch?v=Iy5pvVPZT50&list=PLSbgTZYkscaoV8me47mKqSM6BBSZ73El6&index=5)|