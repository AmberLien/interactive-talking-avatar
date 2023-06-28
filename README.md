# Interactive Talking Avatar

Interactive talking avatar is an application built using Google's [Talking Character](https://github.com/google/generative-ai-docs/tree/main/demos/palm/web/talking-character) and [Whisper](https://github.com/openai/whisper). The goal of this project is to develop an app that children with autism may interact with, monitoring interests through games, dialogue, and facial expressions.

## Table of Contents
- [Interactive Talking Avatar](#interactive-talking-avatar)
  
- [Table of Contents](#table-of-contents)
  
  - [How it Works](#how-it-works)
    
  - [Installation Guidelines](#installation-guidelines)
    - [API Keys](#api-keys)  
    - [Available Scripts](#available-scripts)

## How it Works

Interactive Talking Avatar utilizes Talking Character, which is powered by PaLM, Google's large language learning model. As a result, users can interact with the avatar using natural language, simulating real-life interaction.

## Installation Guidelines

You can clone this repository and install all necessary packages by running the [following script](./docs/interactive-talking-avatar-script.sh) in your terminal. Begin by opening terminal and changing your working directory to where you wish the cloned folder to be located. Make sure your script is in the same location, and then run the following.

```shell
bash interactive-talking-avatar-script.sh
```

### API Keys

This project requires two API keys and uses one optional key.

The required keys are

- `GOOGLE_CLOUD_API_KEY`: for speech recognition and converting text to speech
- `LANGUAGE_MODEL_API_KEY`: for accessing language model PaLM

You can edit these keys in the file `src/context/constants.ts`.

This project can also use (but does not require) the use of an API key from [huggingface](https://huggingface.co/docs/huggingface.js/inference/README). The project will work without one but you will be rate limited eventually.

You can add your key in the file `src/apis/speechRecognition.ts` by following the example from huggingface below.

```
const hf = new HfInference('your access token here')
```

### Available Scripts

You can run the following in the project directory.

### `npm start`

This will run the app in development mode.
If you navigate to [https://localhost:3000](https://localhost:3000), you will be able to see the project in the browser.

The page will reload when edits are made, and you'll see lint errors in the console.

### `npm test`

This launches the test runner in the interactive watch mode. You can look [here](https://create-react-app.dev/docs/running-tests/) for more information on running tests.

### `npm run build`

This will build the app for production in the build folder. You can look [here](https://create-react-app.dev/docs/deployment/) for more information on deployment.

### `npm run eject`

**Note: Once you eject you cannot go back.**

You can run `eject` at any time if you aren't satisifed with the build tool and configuration options. This command will remove the single build dependency from your project, copying configuration files and transitive dependencies into your project so you can have full control over them. All commands except for `eject` will continue to work.
