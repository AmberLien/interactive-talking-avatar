# Interactive Talking Avatar
Interactive talking avatar is an application built using Google's [Talking Character](https://github.com/google/generative-ai-docs/tree/main/demos/palm/web/talking-character) and [Whisper](https://github.com/openai/whisper). The goal of this project is to develop an app that children with autism may interact with, monitoring interests through games, dialogue, and facial expressions.

## How it works
Interactive Talking Avatar utilizes Talking Character, which is powered by PaLM, Google's large language learning model. As a result, users can interact with the avatar using natural language, simulating real-life interaction.

## Installation Guidelines
Begin by cloning this repository (information on cloning a repository can be found [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)) to download get the project. You can pull the required dependencies by running in the project

```shell
npm install
```

Interactive Talking Avatar uses [huggingface.js](https://huggingface.co/docs) to use Whisper. To make use of [Hugging Face's Inference API](https://huggingface.co/docs/huggingface.js/inference/README), you'll need to install it by running one of the following commands.

```shell
npm install @huggingface/inference

pnpm add @huggingface/inference

yarn add @huggingface/inference
```
