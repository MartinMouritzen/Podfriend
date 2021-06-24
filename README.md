<a href="https://www.podfriend.com/">
    <img src="https://www.podfriend.com/img/podfriend-logo-retina.png" alt="Podfriend logo" title="Podfriend" align="right" height="60" />
</a>

# Podfriend Podcast Player

:star: Please give us a Star here on GitHub — it's super motivating!

[Podfriend](https://www.podfriend.com) is your friendly Podcast Player

[![Podfriend Preview](https://www.podfriend.com/img/app-preview.png)](https://www.podfriend.com/)

## Installation

Clone the repo, run yarn

# Web
Run the development build by using `yarn dev-web` and build for production using `yarn build-web`

# Desktop
Run the development build by using `yarn dev` and package windows using `yarn package-win` and Mac using `yarn package`

# iOS
Package using `yarn build-android ` and then package it using the Android Studio

# Android
Package using `yarn build-android ` and then package it using the Android Studio

## The code is not working for me
Please open an issue, there's probably a lot of things that needs to be fixed and streamlined for it to work across more devices than just my own Windows machine and Mac laptop :)

## Why is the code so weird
The code grew from being a Desktop only podcast app, to including web and mobile. The mobile version started out as a React-Native solution, before moving to Cordova. This means that a lot of components are separated in 2 components, a logic component and a UI component, to reuse logic across mobile, web and desktop. This separation is not needed for the Cordova version, so I moved away from that pattern later, but because of time haven't had the chance to reimplement a lot of that logic.

To further make the code ugly, the project started out using React class components, before transitioning to functional components.
