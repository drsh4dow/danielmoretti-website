---
title: 'How To Survive In The Terminal - Part One'
description: 'What you need to know to get started and get comfy on the terminal.'
date: 2022-11-26
updated: 2022-11-27
banner: /images/blog/terminal-survival.jpg
bannerAlt: 'linux terminal basics'
bannerCredit: 'Photo by <a href="https://unsplash.com/@lukash">Lukas</a> on <a href="https://unsplash.com/s/photos/linux-terminal">Unsplash</a>'
---

# Introduction

How often have you resourced to copy and paste coding snippets without realizing what you are doing? Or have you seen a tutorial that jumps from any moment to the terminal, and you have no idea what's going on. Well, today, that's gonna end. Here we will cover the fundamentals of navigating through the terminal and the most basic commands that, if you learn well, will let you feel right at home whenever you are in the terminal.

## Getting Started

First and foremost, open your terminal; on most Linux distros, this can be achieved with Ctrl+Alt+Tor Super+T (I'm looking at you, Pop!_OS), or you can simply search for the application itself. If you are using Gnome, it is called gnome-terminal; on KDE, it is Konsole, but just looking for "terminal" do the trick most of the time. Once it comes up, you will be welcomed with a prompt that looks something like this:

```
[username@hostname ~]$
```

Now we can get started; the terminal itself is nothing scary. It is just an interface to talk to your computer and the programs it has installed, and it is intelligent. In fact, nothing will happen if you type a lot of gibberish and press enter. It just gonna say to you, "command not found."

## The Movements and interactions

When it comes to the basic movements, you have the Up and Down Arrow that will cycle through your history of commands; you have the left and right to move horizontally through words; you have Ctrl+C to cancel the current command that is running; you have Ctral+A and Ctrl+E to go to the beginning of the line and the end respectively, and you have many more shortcuts you can use inside the terminal. Still, for the time being, those are the most crucial. A quick note regarding copying and pasting from and to the command line, you can't use Ctrl+C to copy or Ctrl+V to paste. You have to use Ctrl+Shift+C to copy and Ctrl+Shift+V to paste.

## Navigation with the terminal

In Unix-based operating systems like Linux or macOS, the file system is organized in a Tree-Like way. This means that we have only one directory at the root level (conveniently called root and denoted with /) that contains other directories and files. Your terminal works relatively to one of these paths inside your file system, and conveniently, by default, this path is the same as the main folder of your user, located on ***/home/[username]** *, You can interactively ask what the current path is with the command _**pw**d_ (print working directory):

```
[username@hostname ~]$ pwd
/home/username
[username@hostname ~]$
```

Now, to know which files and folders are available under the current path, you could use the command _**l**s_:

```
[username@hostname ~]$ ls
Desktop  Documents  Downloads  Music  Pictures Public Videos
[username@hostname ~]$
```

And the last piece of the puzzle is the command to move through your filesystem, which lets you change the current working directory by specifying the directory you want to go to. This command is ***cd** *(change directory):

```
[username@hostname ~]$ cd Downloads
[username@hostname ~]$ pwd
/home/username/Downloads
[username@hostname ~]$
```

And you can also specify the absolute path you want to navigate to!. And if you don't specify any arguments, it will throw you back to the user home directory.

```
[username@hostname ~]$ cd /usr/share/fonts
[username@hostname ~]$ pwd
/usr/share/fonts
[username@hostname ~]$ cd
[username@hostname ~]$ pwd
/home/username
```

A quick note regarding filenames, these are case-sensitive, so you must use the correct casing. Some other useful shortcuts when it comes to navigation are the dot and the double dot. These symbolize the current and the parent directory, respectively, as it is shown in the following example:

```
[username@hostname ~]$ pwd
/home/username
[username@hostname ~]$ cd ..
[username@hostname ~]$ pwd
/home
[username@hostname ~]$ cd ..
[username@hostname ~]$ pwd
/
```

## Command options

Commands are not fancy features built-in in the terminal. No, they are their own independent application, each one of them. These are applications designed to work optimally through a command-line interface, and these applications usually come with options to modify their default behavior entering options. Options are a way to change the behavior of these applications, and they look like single letters preceded by a dash. For example, to list all files and folders in the current directory, including the hidden ones (the ones that begin with a period), you can specify the ***-**a* option to _**l**s_:

```
[username@hostname ~]$ ls -a
.bashrc  .cargo     Downloads  Pictures  Videos
.config  Documents  Music      Public
[username@hostname ~]$
```

Usually, you can get a more in-depth explanation of each one of those flags with the _**--hel**p_ flag in the command itself:

```
[username@hostname ~]$ pwd --help
pwd: pwd [-LP]
    Print the name of the current working directory.

    Options:
      -L	print the value of $PWD if it names the current working
    		directory
      -P	print the physical directory, without any symbolic links

    By default, `pwd' behaves as if `-L' were specified.

    Exit Status:
    Returns 0 unless an invalid option is given or the current directory
    cannot be read.
[username@hostname ~]$
```

## Basic commands to interact with files and folders

Now we know how to move around in the terminal, but that is little to no use if we can't interact with the pieces of it. Enter '_**touc**h_', '_**c**p_', '_**m**v_', '_**mkdi**r_', '_**l**n_', and '_**r**m_'. Here is a short description of each one:

- _**touc**h_: allows you to create files.

- _**c**p_: copy the files specified from one location to another.

- _**m**v_: move or rename the files from one place to another.

- _**mkdi**r_: create directories.

- _**l**n_: create symbolic links

- _**r**m_: remove files.

These commands and the previously described ones are among the most used commands. So let's check them one by one with an example for each one.

### The touch command

The touch command is used to create empty files or to update the access and modification timestamps of an already existing file. His syntax is as follows:

```
[username@hostname ~]$ cd
[username@hostname ~]$ ls -l
drwxr-xr-x@ - username  3 Nov 19:59 Desktop
drwxr-xr-x@ - username 17 Nov 00:29 Documents
drwxr-xr-x@ - username 26 Nov 17:40 Downloads
drwxr-xr-x@ - username  3 Nov 19:59 Music
drwxr-xr-x@ - username 27 Nov 00:08 Pictures
drwxr-xr-x@ - username  3 Nov 19:59 Public
drwxr-xr-x@ - username  3 Nov 19:59 Templates
drwxr-xr-x@ - username  3 Nov 19:59 Videos
[username@hostname ~]$ touch hello.txt
[username@hostname ~]$ touch world.txt how.html is.md your.sh
[username@hostname ~]$ ls -l
drwxr-xr-x@ - username  3 Nov 19:59 Desktop
drwxr-xr-x@ - username 17 Nov 00:29 Documents
drwxr-xr-x@ - username 26 Nov 17:40 Downloads
.rw-rw-r--  0 username 27 Nov 00:17 hello.txt
.rw-rw-r--  0 username 27 Nov 00:17 how.html
.rw-rw-r--  0 username 27 Nov 00:17 is.md
drwxr-xr-x@ - username  3 Nov 19:59 Music
drwxr-xr-x@ - username 27 Nov 00:08 Pictures
drwxr-xr-x@ - username  3 Nov 19:59 Public
drwxr-xr-x@ - username  3 Nov 19:59 Templates
drwxr-xr-x@ - username  3 Nov 19:59 Videos
.rw-rw-r--  0 username 27 Nov 00:17 world.txt
.rw-rw-r--  0 username 27 Nov 00:17 your.md
```

### The cp command [wip]

# Conclusion

We have learned many useful commands, but this is just the tip of the iceberg in the terminal world. I hope you enjoyed this mini guide, and keep an eye out for part two. Cheers.
