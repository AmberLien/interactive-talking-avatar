/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const GOOGLE_CLOUD_API_KEY = sessionStorage.getItem("googleApiKey"); //process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;

export const LANGUAGE_MODEL_API_KEY = sessionStorage.getItem("palmApiKey"); //process.env.REACT_APP_LANGUAGE_MODEL_API_KEY;

export const HUGGING_INFERENCE_KEY = sessionStorage.getItem("huggingFaceApiKey"); //process.env.REACT_APP_HUGGING_INFERENCE_KEY;

export const LANGUAGE_MODEL_BASE_URL =
    'https://generativelanguage.googleapis.com';

export const LANGUAGE_MODEL_URL = `${
    LANGUAGE_MODEL_BASE_URL}/v1beta2/models/chat-bison-001:generateMessage?key=${
    LANGUAGE_MODEL_API_KEY}`;