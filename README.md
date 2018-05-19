# gitlit

gitlit is a very simple desktop app that allows you to handle [git lfs file locks](https://github.com/git-lfs/git-lfs/wiki/File-Locking).

![gitlit main window](screenshots/main.png)

## download

Just go to releases and download the version for your platform.

## usage

gitlit takes one command line argument: the git repository directory on your filesystem you want to handle the locks for.

So if you want to look at the locked files on the `/home/s2/myApp` directory, run gitlit like this:
```
gitlit /home/s2/myApp
```

If no folder is specified, gitlit looks at the current path.
