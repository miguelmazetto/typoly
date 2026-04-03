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
