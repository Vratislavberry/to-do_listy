# Next.js To-Do App

A simple to-do app built with **Next.js** that allows users to **create notes**, **sort**, and **filter** them. This app uses **json-server** as a mock backend to store and retrieve notes.

## Installation & Setup

Follow these steps to get the app running locally:

### 1. Clone the Repository

```sh
git clone https://github.com/Vratislavberry/to-do_listy.git
cd to-do_listy
```

### 2. launch json-server

```sh
cd be
npm install
npx json-server db.json --port 4000
```

### 3. launch NextJS

```sh
cd fe
npm install
npm run dev
```
Web will be available on: http://localhost:3000
