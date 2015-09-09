# HW0 Solutions: Git Commands and Hooks #

## Git Basics ##

#### Level 1: Introduction to Git Commits ####
` git commit -m "First commit"` <br/>
` git commit -m "Second commit"`

#### Level 2: Branching in Git ####
` git branch bugFix` <br/>
` git checkout bugFix`

#### Level 3: Merging in Git ####
` git checkout -b bugFix` <br/>
` git commit` <br/>
` git checkout master` <br/>
` git commit` <br/>
` git merge bugFix`

#### Level 4: Rebase Introduction ####
` git checkout -b bugFix` <br/>
` git commit` <br/>
` git checkout master` <br/>
` git commit` <br/>
` git checkout bugFix` <br/>
` git rebase master` <br/>

#### Progress Screenshot ####
![git_basics](https://cloud.githubusercontent.com/assets/9260911/9706541/6f3b358e-54b5-11e5-8b10-16e22303bfa7.png)

## Git Bonus ##

#### Level 1: Detach HEAD ####
` git checkout C4`

#### Level 2: Relative Refs 1 ####
` git checkout bugFix^`

#### Level 3: Relative Refs 2 ####
` git branch -f master C6` <br/>
` git branch -f bugFix HEAD~2` <br/>
` git checkout HEAD^`

#### Level 4: Reversing Changes in Git ####
` git reset HEAD~1` <br/>
` git checkout pushed` <br/>
` git revert HEAD`

#### Progress Screenshot ####
![git_bonus](https://cloud.githubusercontent.com/assets/9260911/9706544/b54e1924-54b5-11e5-90df-b8e038e33610.png)

## Hooks ##

#### post-commit file ####
` #Open webbrowser after every commit` <br />

` xdg-open "https://wolfware.ncsu.edu/"``

#### Screencast ####

[Hooks Demo](https://youtu.be/GnS6t36hTX4)
