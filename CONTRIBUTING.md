# Contributing to Locha Mesh Chat

Thank you for taking the time to contribute!

The following is a set of guidelines to contribute to [Locha Mesh Chat]()

#### Table of Contents

- [Contributing to Locha Mesh Chat](#contributing-to-turpial-firmware)
 - [Table of Contents](#table-of-Contents)
  - [Before starting](#before-starting)
  - [How can I contribute?](#how-can-i-contribute?)
    - [I have a question](#i-have-a-question)
    - [Suggestions for improvements](#suggestions-for-improvements)
    - [Reporting a bug](#reporting-a-bug)
  - [How to make a Pull Request](#how-to-make-a-Pull-Request)
    - [Start a new change](#start-a-new-change)
    - [Upload your changes and make Pull Request](#upload-your-changes-and-make-pull-request)

## Before starting 
Please read our [code of conduct](CODE_OF_CONDUCT.md)

## How can I contribute?
We would love to accept your patches and contributions to this project. There are only a few small guidelines that you should follow.

### I have a question
For any question or doubt you can write to us via Twitter @Locha_io
through the form you will find on our website ** locha.io **

### Suggestions for improvements
ToDo

### Reporting a bug

You can open a new issue or bug from a specific line or lines of code in a file or pull request.

When we open an issue or bug from the code, the issue contains a line or portion of code that you select.

To do this you just have to follow these steps:

1. Within GitHub go to the main page of the project
2. open the branch and file you want to reference
3. To reference the line or lines of code, just press and hold the ctrl + click key on the line you wish to select.
4. When you finish selecting the code you want to reference, click on any line number, which will make a three-point menu visible, then we select to reference in a new issue
5. We assign a title to the issue and submit the issue.


## How to make a Pull Request

For each Pull Request you are going to do you have to do the following.

### Start a new change
Before you start making modifications, run these commands to create a new branch that is synchronized with dev:

     git fetch --all # download the branches in the repository.
     git checkout dev # changes you to the dev branch if you are not in it.
     git pull origin dev # to synchronize the dev branch locally.
     git checkout -b featureNameYouWantToDo # creates a new branch synchronized with dev.
     git push pr featureNameYouWantToDo # fan your change to GitHub

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





