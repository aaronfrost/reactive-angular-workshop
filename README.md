# Reactive Angular Workshop

## What will be covered?

This workshop will teach attendees how to use reactive techniques in your Angular app. It will be
based heavily on RxJS.

-   Intermediate Reactive concepts
    -   BehaviorSubjects
    -   combineLatest
    -   several new operators: pluck, map, tap, distinctUntilChanged
-   Intermediate Angular patterns
-   Intermediate TypeScript
-   Basic State Management
-   Angular Performance

## What will NOT be covered?

The following topics will not be covered in this class. To be fair to all involved, any questions
that dive into these topics will be deferred until breaks, until after the workshop is over, or
indefinitely.

-   Angular Basics, or beginner Angular questions
-   TypeScript Basics, or beginner TypeScript questions
-   Reactive Basics, or anything that TOO basic around Observables

## Before you come to class

In order to work on this project and go through the trainings, please do each of the following:

-   Install `git` on your machine.
-   Install node & npm
    -   Install node v14 (or higher)
    -   Installing node v14 automatically installs `npm`
-   Install latest Angular CLI .
    -   `npm install -g @angular/cli`
-   Install your favorite IDE
    -   Most people use VSCode
    -   Frosty uses Webstorm
-   Clone the project
    -   Open your Terminal/Powershell
    -   `cd` into where you want the code
    -   Run `git clone https://github.com/aaronfrost/reactive-angular-workshop`
-   Run `npm install`

    -   `cd` into the folder you just cloned
    -   Run `npm install`

-   Get APIKEY from [developer.marvel.com](https://developer.marvel.com/)
    -   Go to [https://developer.marvel.com/](https://developer.marvel.com/)
    -   Create a developer account
    -   Add `localhost` to the `Your Authorized Referers` section
    -   Add your public and private keys into `environments.ts` files
-   Read [Don't Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87) blog by Ben Lesh

Please do all of this before the training starts. Otherwise we will have to spend the first
part of the training up and running. If there are any questions, reach out to me (Frosty) me on Twitter.

## Start Developing

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
