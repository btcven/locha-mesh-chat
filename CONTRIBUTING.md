# Contributing to Locha Mesh Chat

Thank you for taking the time to contribute!

The following is a set of guidelines to contribute to [Locha Mesh Chat]()

#### Table of Contents

- [Contributing to Locha Mesh Chat](#contributing-to-locha-mesh-chat)
      - [Table of Contents](#table-of-contents)
  - [Before starting](#before-starting)
  - [How can I contribute?](#how-can-i-contribute)
    - [I have a question.](#i-have-a-question)
    - [Reporting a bug](#reporting-a-bug)
    - [How to make a Pull Request](#how-to-make-a-pull-request)
    - [Start a new change](#start-a-new-change)
    - [Upload your changes and make Pull Request](#upload-your-changes-and-make-pull-request)
  - [Style guide for the source code](#style-guide-for-the-source-code)
    - [Objectives of the style guide](#objectives-of-the-style-guide)
    - [Commit messages](#commit-messages)
    - [Declaration of variables](#declaration-of-variables)
    - [Nomenclature Rules](#nomenclature-rules)
    - [Functions or methods](#functions-or-methods)
    - [Class](#class)
    - [if / if-else](#if--if-else)
    - [Callbacks](#callbacks)
    - [Comparison Operators](#comparison-operators)
    - [Imports](#imports)
    - [Indentation](#indentation)

## Before starting 
Please read our [code of conduct](CODE_OF_CONDUCT.md)

## How can I contribute?
We would love to accept your patches and contributions to this project. There are only a few small guidelines that you should follow.

### I have a question.

If you have a question you can write to use using Twitter at
[@Locha_io](https://twitter.com/Locha_io), or through our website
[locha.io](https://locha.io).


### Reporting a bug
You can use our issue tracker to share your idea, it will be discussed by the
Locha Mesh team members. If we all agree and makes sense to implement this
feature, it will be kept opened.

You can open a new issue or bug from a specific line or lines of code in a file or pull request.

When we open an issue or bug from the code, the issue contains a line or portion of code that you select.

To do this you just have to follow these steps:

1. Within GitHub go to the main page of the project
2. open the branch and file you want to reference
3. To reference the line or lines of code, just press and hold the ctrl + click key on the line you wish to select.
4. When you finish selecting the code you want to reference, click on any line number, which will make a three-point menu visible, then we select to reference in a new issue
5. We assign a title to the issue and submit the issue.

please provide detailed information about the issues you're expecting.


### How to make a Pull Request

For each Pull Request you are going to do you have to do the following.

### Start a new change
Before you start making modifications, run these commands to create a new branch that is synchronized with dev:

    git fetch --all # Download the branches in the repository.
    git checkout dev # it changes you to the dev branch in case you are not in it
    git pull origin dev # to synchronize the dev branch locally.
    git checkout -b featureNameYouWantToDo # create a new branch synchronized with dev.
    git push pr featureNameYouWantToDo # upload your change to github

make some changes

### Upload your changes and make Pull Request
Once you made the changes you want to propose, perform the following steps:
    
    git add -A
    git commit -m "Here a description of your changes".
    
Configure your user data (You only need to enter this information the first time you push):

    git config --global user.email "tu-email@gmail.com"
    git config --global user.name "<tu-usuario>"

Push your commit to your repository fork: 
    
    git push featureNameYouWantToDo # upload your change to github
    git push -u pr

Go to the GitHub page, if you go to your repository fork, click on the Branch button and select the branch in which you made the name changes of the nature you want to do. Then press the Pull request button.


## Style guide for the source code

This project currently uses the eslint style guide for ECMAScript 6

### Objectives of the style guide

The objectives of the style guide as we see them today are based on optimizing for the reader and not for the writer; Our code base (and most of the individual components) is expected to continue for quite some time

- Optimize for the reader, not for the writer
Our code base (and most of the individual components sent to it) is expected to continue for quite some time. As a result, more time will be spent reading most of our code than writing it. We explicitly choose to optimize the experience of our average software engineer by reading, maintaining and debugging code in our code base instead of facilitating the writing of that code. "Leaving a trail for the reader" is a particularly common subpoint of this principle: when something surprising or unusual is happening in a code snippet (for example, transfer of ownership of the pointer), leaving textual clues for the reader at the point of Use is valuable (std :: unique_ptr demonstrates the transfer of ownership unambiguously at the site of the call).

- Be consistent with existing code
Using a style consistently through our code base allows us to focus on other (more important) problems. Consistency also allows automation: the tools that format your code or adjust your #include only work correctly when your code is consistent with the expectations of the tools. In many cases, the rules attributed to "Be consistent" are reduced to "Simply choose one and stop worrying about it"; The potential value of allowing flexibility at these points is offset by the cost of having people discuss them.

### Commit messages
A message of commitment should be short, clear and with a description of the proposed changes or improvements.

If the commitment includes changes in several files or sections, we must include an extended message with a description of the proposed changes one by one.

### Declaration of variables

do not use the prefix `var` to declare variables always use `const` or `let`

```js
  // Use this:
    let x = "y";
    const CONFIG = {};

  // Instead of:
     var x = "y";
     var CONFIG = {};
  ```
### Nomenclature Rules

- Use a descriptive name that is consistent with the style when writing code.
- All names must be written in **English**.
- use **lowerCamelCase** for variable names

```js
  // Use this:
    let variableName = "y";
    
  // Instead of:
    let VariableName = "y"    
 ```
### Functions or methods

- Use descriptive verbs and their names starting with lowercase letters, if the name is composed, continue with capital letters.
- Arrow Function since they allow us to write a shorter function syntax

```js
  // Use this:
  const  hello = () => {
     return "Hello World!";
   }
   
  // or
  const hello = () => "Hello World!";
 
  // Instead of:
  const hello = function() {
    return "Hello World!";
  }
 ```
 
- Try to limit the number of parameters in the functions whenever possible, one or two would be ideal. 

```js
  // Use this:
    const crearMenu = ({ title, contex, textButton, cancel }) => {
      // ...
    }
    
  // Instead of:
    const crearMenu = ( title, contex, textButton, cancel ) {
      // ...
    }
    
 ```
 ### Class 
 
The javascript classes, introduced in ECMAScript2015(ES6) provide a much clearer and simpler syntax for creating objects and dealing with inheritance.


```js
  // Use this:
    class Car {
  constructor() {
    this.make = 'Honda';
    this.model = 'Accord';
    this.color = 'white';
  }

  setMake(make) {
    this.make = make;
    // NOTE: Returning this for chaining
    return this;
  }

  setModel(model) {
    this.model = model;
    // NOTE: Returning this for chaining
    return this;
  }

  setColor(color) {
    this.color = color;
    // NOTE: Returning this for chaining
    return this;
  }

  save() {
    console.log(this.make, this.model, this.color);
    // NOTE: Returning this for chaining
    return this;
  }
}

const car = new Car()
  .setColor('pink')
  .setMake('Ford')
  .setModel('F-150')
  .save();
    
    
 ```
### if / if-else
- avoid using if / else if you are going to return something

```js

// Use this:
 if (a > b) {  
  return a
 }
 return b

// Instead of:
 if (a > b) {  
  return a
 } else{
  return b
 }

```

- You can also use the ternary conditional operator included in ECMAScript2015(ES6)

```js
// Use this:
 const result  = age > 18 ? true : false 

```

### Callbacks 
A callback function is a function that is passed to another function as an argument, which is then invoked within the external function to complete some type of routine or action, note that callbacks are often used to continue code execution after a synchronous operation has been completed.

- Use ES6 callbacks as they are much easier to understand.
 
```js 

// Use this:
   const  doHomework = (subject, callback) => {
      alert(`Starting my ${subject} homework.`);
      callback();
    }

    doHomework('math', ()=> {
      alert('Finished my homework');
    });
  
// Instead of:
   const doHomework = (subject, callback) => {
    alert(`Starting my ${subject} homework.`);
    callback();
  }
  
  doHomework('math', function alertFinished(){
    alert('Finished my homework');
  });

```
- avoid using multiple callback (hell callback) if you need to execute multiple functions asynchronously we recommend using **promises**


### Comparison Operators
- It is required to use comparison operators such as *===* and *!==* This rule is aimed at eliminating insecure type equality operators.


```js

// Use this:
  value === undefined
  value !== undefined
  
// Instead of:
  value == undefined
  value != undefined

```


### Imports 
- no duplicate imporst 
```js
 // Use this:
   import { merge, find } from 'module';
   import something from 'another-module';

  
 // Instead of:
   import { merge } from 'module';
   import something from 'another-module';
   import { find } from 'module';


```

### Indentation

- Use 2 spaces as default identation

```js
// Use this:
  const hello = ( name ) => {
    console.log('hi', name)
  }

```




