# Interactive avatar

<!--- # some integrations are still in progress... # -->

Interactive avatar is an application built using Google's [Talking Character](https://github.com/google/generative-ai-docs/tree/main/demos/palm/web/talking-character), OpenAI's [Whisper](https://github.com/openai/whisper), Google's [MediaPipe](https://developers.google.com/mediapipe), and Google's large language learning model [PALM](https://ai.googleblog.com/2022/04/pathways-language-model-palm-scaling-to.html).
Users can interact with the avatar using natural language, facial expressions and gestures, simulating real-life interaction.
The goal of this project is to develop an app that children with autism and without may interact with, monitoring interests and behaviours through games, dialogue, and facial expressions.
The ultimate goal of the project is to use the data collected during the interaction for autism preliminary screening.

## Table of contents

<!--- - [Interactive Avatar](#interactive-avatar) -->

<!--- - [Table of Contents](#table-of-contents) -->
<!---   - [How it Works](#how-it-works) -->

- [Installation guidelines](#installation-guidelines)
<!---    - [API Keys](#api-keys)  -->
- [Available scripts](#available-scripts)

<!--- # TODO: we will work on that later in time #
## How it Works
Interactive Talking Avatar utilizes Talking Character, which is powered by PaLM, Google's large language learning model. As a result, users can interact with the avatar using natural language, simulating real-life interaction.
-->

## Installation guidelines

You can clone this repository and install all necessary packages by running the following commands in your terminal.

```shell
git clone https://github.com/AmberLien/interactive-talking-avatar.git
cd interactive-talking-avatar
npm install
```

<!--- TODO: inserting and editing these variables through the web interface to make it more simple for new devs working on the project
### API Keys
This project may require two API keys and uses one optional key.

The required keys are
- `GOOGLE_CLOUD_API_KEY`: for speech recognition and converting text to speech
- `LANGUAGE_MODEL_API_KEY`: for accessing language model PaLM

You can edit these keys in the file `src/context/constants.ts`.

This project can also use (but does not require) the use of an API key from [huggingface](https://huggingface.co/docs/huggingface.js/inference/README). The project will work without one but you will be rate limited eventually.

You can add your key in the file `src/apis/speechRecognition.ts` by following the example from huggingface below.

```
const hf = new HfInference('your access token here')
```
-->

## Generating Animations

After customizing your avatar, you can generate animations by providing your avatar's url in generated_animations.js. You'll also need to fill in the path to your virtual environment (venvPath), and add the path corresponding [generate avatar animations](https://github.com/AmberLien/generate-avatar-animations) (cwdPath). Once filled, create your animations by running

```
(base) talking-interactive-character % node generate_animations.js
```

Your animations may take a few minutes to generate. Once completed, they can be used in this project!

<!-- After customizing your avatar using the project, you can take the url corresponding with your avatar (at the moment printed to the console) and use it in the corresponding project to generate avatar animations: https://github.com/AmberLien/generate-avatar-animations.

Once generated, to use your animation, add it to this project's context folder and import it to the character page like the example below.

```
import talking.gif from '../context/talking.gif';
```

Your animation will now be visible whenever the character responds. -->

## Available scripts

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
