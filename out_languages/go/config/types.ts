/* Copyright 2026 Miguel Ferreira Mazetto
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/
// Function override types for Typoly C++ transpiler

export interface FunctionOverrideCondition {
  type: 'parameterCount' | 'optionValue' | 'dataType';
  value?: number | string;
  secondParamType?: string;
}

export interface FunctionOverride {
  condition?: FunctionOverrideCondition;
  cppFunction: string;
  returnType?: string;
  description?: string;
}

export interface FunctionOverrideConfig {
  description: string;
  optionParameter?: number;
  optionName?: string;
  overloads: Record<string, FunctionOverride>;
  default: FunctionOverride;
}

export interface FunctionOverridesFile {
  version: string;
  description: string;
  functions: Record<string, FunctionOverrideConfig>;
}

export interface ResolvedOverride {
  cppFunction: string;
  returnType?: string;
}
