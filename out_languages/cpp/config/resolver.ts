import * as fs from 'fs';
import * as path from 'path';
import type { 
  FunctionOverridesFile, 
  FunctionOverrideConfig, 
  FunctionOverride, 
  ResolvedOverride 
} from './types';

// Load function overrides from JSON config
let overridesCache: FunctionOverridesFile | null = null;

export function loadFunctionOverrides(configPath?: string): FunctionOverridesFile {
  if (overridesCache) return overridesCache;
  
  const defaultPath = path.join(__dirname, 'function_overrides.json');
  const actualPath = configPath || defaultPath;
  
  try {
    const content = fs.readFileSync(actualPath, 'utf-8');
    overridesCache = JSON.parse(content);
    return overridesCache!;
  } catch (e) {
    overridesCache = { version: '1.0.0', description: '', functions: {} };
    return overridesCache!;
  }
}

// Get override config for a specific function
export function getFunctionOverrideConfig(
  functionName: string
): FunctionOverrideConfig | undefined {
  const config = loadFunctionOverrides();
  return config.functions[functionName];
}

// Check if a function has overrides
export function hasFunctionOverrides(functionName: string): boolean {
  return getFunctionOverrideConfig(functionName) !== undefined;
}

// Resolve which overload to use based on call arguments
export function resolveFunctionOverride(
  functionName: string,
  args: any[],
  optionValue?: string,
  dataType?: string
): ResolvedOverride {
  const config = getFunctionOverrideConfig(functionName);
  if (!config) {
    return { cppFunction: functionName.split('.').pop() || functionName };
  }
  
  // Check overloads for matching conditions
  for (const [name, overload] of Object.entries(config.overloads)) {
    if (!overload.condition) continue;
    
    const condition = overload.condition;
    
    switch (condition.type) {
      case 'parameterCount':
        if (args.length === condition.value) {
          return {
            cppFunction: overload.cppFunction,
            returnType: overload.returnType
          };
        }
        break;
        
      case 'optionValue':
        if (optionValue === condition.value) {
          return {
            cppFunction: overload.cppFunction,
            returnType: overload.returnType
          };
        }
        break;
        
      case 'dataType':
        if (dataType === condition.value) {
          return {
            cppFunction: overload.cppFunction,
            returnType: overload.returnType
          };
        }
        break;
    }
  }
  
  // Return default if no overload matches
  return {
    cppFunction: config.default.cppFunction,
    returnType: config.default.returnType
  };
}

// Get the option value from a call's arguments
export function extractOptionValue(
  args: any[],
  optionParamIndex: number,
  optionName: string
): string | undefined {
  if (optionParamIndex >= args.length) return undefined;
  
  const optionsArg = args[optionParamIndex];
  if (!optionsArg || typeof optionsArg !== 'object') return undefined;
  
  return optionsArg[optionName];
}

// Get the data type of an argument
export function getArgumentDataType(arg: any): string | undefined {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (Array.isArray(arg)) return 'array';
  return typeof arg;
}
