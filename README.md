# Imapsync

Used to easily make the command to sync imap email accounts.

## Source
This is an Electron app that builds on top of Gilles Lamiral's work called imapsync. The binaries for each operating system is included in the program, so you can use it in macOS, Linux and Windows without worry.
[https://github.com/imapsync/imapsync](https://github.com/imapsync/imapsync)

## Downloads
[Link](https://github.com/CasperEngl/imapsync-app/releases/)

## Running the app

### To run the app in development mode
```
yarn electron:dev
```

### In the case that the app has already been started elsewhere
```
yarn electron:start
```

## Building the app

### Build for current OS
```
yarn electron:pack
```

### Build for macOS, Windows and Linux
Only include the OS's you want to build for
> -m = macOS  
> -w = Windows  
> -l = Linux

Alternatively, use the shorthard **-mwl**
```
yarn electron:prebuild
yarn electron:build -m -w -l
```
