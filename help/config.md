# Configurations

## Arguments

Arguements are the varying values which are not same for adding different codes. These Arguements are passed while using `cohls add ...args` command.
These args are replaced with $i+1 in commands batch or filename.
These can be set while following prompts

1. [Filename while adding](#filename-while-adding)
2. [Batch of commands to run program](#batch-of-commands-to-run-program)

To Use these arguements we've to use $i+1 in config command.

## Filename While Adding

This is the first prompt which is shown first in config command.
This filename should be like a pattern which uses the args passed while adding.

Example:

```ps
cohls add App
```

here the App is arg which will be replaced with $1 in filename and all commands configured.

```ps
PS D:\DEV\testing___apps\chnp_cli> cohls config
Enter filename while adding: $1.java
```

here, the $1 will be replaced with arg[0] which is App in this case.

So, The code will be read from the file App.java

## Batch of commands to run program

Batching of commands lets you do processing of output. this processing can be done by using batching.
The config operator asks for same.

Example:

To run a java program we require to generate class file using javac so we've to run javac filename then the java classname command.

So for following add command case,

```ps
cohls add App
```

we should have this config

```ps
PS D:\DEV\testing___apps\chnp_cli> cohls config
Enter filename while adding: $1.java
Enter commands to run program while adding:
1. > javac $1.java
2. > java $1
3. >

```

> To Finish adding simply leave the command empty and press enter.

Here, $1 will be replaced with App so commands will run like

```ps
PS D:\DEV\testing___apps\chnp_cli> cohls add App
Running command:  javac App.java
Running command:  java App
Hello World
ShGI
ShGI Hello There
Operation is done SUCCESSFULLY
```
