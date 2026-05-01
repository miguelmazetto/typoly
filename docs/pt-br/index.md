<style>
  html, body {
    background-color: #121314;
    color: #BBBEBF;
  }
</style>
# TyPoly - TCC TypeProgram

## Por Que Este Projeto?

### O Problema com a Execução de JavaScript/TypeScript

TypeScript oferece excelente experiência de desenvolvimento com tipagem estática, autocompletar e captura de erros em tempo de compilação. Porém, em tempo de execução, JavaScript tem problemas significativos de consumo de recursos que afetam muitos casos de uso:

#### 1. Consumo de Memória

Objetos JavaScript são **flexíveis quanto ao tipo por design**. Cada valor deve ser capaz de conter qualquer tipo em tempo de execução porque os tipos são descartados após a compilação:

```javascript
// TypeScript (tempo de compilação)
let x: string | number = "hello";
x = 42;  // Funciona em tempo de execução

// Em execução, x precisa guardar tanto string quanto number
// Isso exige metadados para tipagem dinâmica (classes ocultas, etiquetas de tipo)
// O V8 usa classes ocultas: cada objeto rastreia sua forma
// Cada número pode consumir memória extra para possíveis mudanças de tipo
```

As implementações de JavaScript (V8, JavaScriptCore) implementam otimizações sofisticadas, mas ainda precisam lidar com a flexibilidade de tipos. Um simples contador `for (let i = 0; i < 1000000; i++)` cria um número que poderia, potencialmente, se tornar qualquer tipo.

#### 2. Tamanho do Binário/Pacote

TypeScript remove todas as anotações de tipo durante a compilação, resultando em JavaScript **menor** que o código-fonte original. No entanto, o JavaScript final ainda:
- Precisa incluir auxiliares de execução (runtime helpers)
- Depende de polyfills para funcionalidades modernas
- Carrega uma máquina virtual inteira (V8, SpiderMonkey, etc.)
- Não possui eliminação de código morto no nível da VM

Um projeto TypeScript de 10 MB (código-fonte) pode produzir algumas centenas de KB de JavaScript, mas esse JavaScript precisa executar dentro de um ambiente que ocupa dezenas de MB (como o Node.js ou um navegador). O Typoly resolve isso gerando C++20 que compila para um binário nativo de ~157 KB (no projeto de teste), sem necessidade de VM ou runtime adicional.

#### 3. Tempo de Inicialização a Frio

Quando uma aplicação JavaScript inicia:
1. **Faz o parsing** do código-fonte para AST
2. **Compila** para bytecode (Ignition)
3. **Otimiza** os caminhos mais usados (TurboFan)
4. **Executa** o código

Essa fase de "aquecimento" (Tier-Up) leva segundos para aplicações grandes. Não há compilação antecipada (AOT) – cada reinicialização repete esse processo.

#### 4. Hardware Embutido

Para programação de microcontroladores ou dispositivos leves:
- Implementações JavaScript exigem quantidade significativa de RAM (V8: cerca de 50 MB mínimo)
- Coletas de lixo são inaceitáveis para sistemas de tempo real
- Execução não determinística

#### 5. Paralelização Limitada (e Possível em C++)

JavaScript é single-threaded. Web Workers têm alto custo:
- A passagem de mensagem exige serialização
- SharedArrayBuffer possui requisitos de segurança
- **Paralelização verdadeira** exigiria múltiplos processos (ou threads nativas, mas isso não é possível em JavaScript padrão)

Typoly, ao gerar C++20, **torna possível** o uso de threads nativas para paralelização. No entanto, **no momento, o transpiler não implementa nenhuma transformação automática** de código assíncrono ou paralelo – cabe ao desenvolvedor escrever código C++ com threads ou o transpiler poderá vir a suportar isso no futuro.

---

### Como o Typoly Aborda Estes Problemas

| Problema | JavaScript | Typoly (C++) |
|----------|------------|---------------|
| **Memória** | Objetos dinâmicos exigem flexibilidade de tipo | Valores estaticamente tipados usam tamanho exato |
| **Tamanho do binário** | Auxiliares de execução incluídos | 157 KB no `test_package` (configuração `MinSizeRel`) |
| **Embutido** | Implementação > 50 MB | Possível (não testado) |
| **Paralelização** | Web Workers (com overhead) | Threads nativas permitidas (não implementado automaticamente) |

#### Comparação de Memória

```javascript
// JavaScript
const arr = [1, 2, 3];
// Classe oculta + cache em linha + etiquetas de tipo necessários
// Cada número: 8 bytes + metadados da implementação
```

```cpp
// C++ via Typoly
Vector<double> arr = {1, 2, 3};
// Apenas os valores: 8 bytes * 3 = 24 bytes
// Nenhum metadado de execução necessário
```

#### Caso de Uso em Hardware Embutido (Teórico)

Um Arduino Due (ARM de 84 MHz) pode executar C++, mas não pode executar V8. Typoly poderia, teoricamente, permitir:

```typescript
// Este código TypeScript poderia se tornar C++ para embarcados...
function blink(times: number): void {
    for (let i = 0; i < times; i++) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(1000);
        digitalWrite(LED_BUILTIN, LOW);
        delay(1000);
    }
}
blink(5);
```

Tornar-se-ia:

```cpp
// Este C++ poderia rodar em hardware embarcado
void blink(int times) {
    for (int i = 0; i < times; i++) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(1000);
        digitalWrite(LED_BUILTIN, LOW);
        delay(1000);
    }
}
```

**Nota**: Esse caso de uso ainda não foi testado nem implementado especificamente. As bibliotecas Arduino/firmware (`digitalWrite`, `delay`) precisariam de implementações personalizadas na biblioteca padrão. No entanto, o código C++ gerado é C++20 padrão, portanto, adicionar esse suporte é teoricamente possível.

**Tamanho do binário**: O projeto de testes (`test_package`, veja `.typoly_built/cpp/test.cpp`) compila para cerca de 157 KB na configuração `MinSizeRel` com MSVC – uma redução significativa em relação aos requisitos de memória de uma implementação JavaScript.

#### Backend de Servidor

Para servidores de alta vazão, threads nativas podem substituir Web Workers:

```cpp
// Criar 4 threads trabalhadoras para processamento paralelo
std::vector<std::thread> workers;
for (int i = 0; i < 4; i++) {
    workers.emplace_back(processTask, taskQueue);
}
for (auto& w : workers) w.join();
```

**Nota**: O código acima é C++ válido, mas o Typoly **não gera automaticamente** esse padrão a partir de código JavaScript/TypeScript. É apenas um exemplo do que é possível fazer com a saída C++.

---

### O Que o Typoly NÃO Garante

- **Velocidade**: O TurboFan do V8 realiza otimizações agressivas. C++ escrito manualmente pode ser mais lento sem otimização cuidadosa.
- **Correção**: O transpiler ainda está em evolução. Bugs no código gerado são possíveis.
- **Suporte completo**: Nem todas as funcionalidades do TypeScript estão implementadas.

---

### O Que o Typoly HABILITA

- **Binários menores** para a mesma funcionalidade
- **Uso de memória previsível** sem pausas de coleta de lixo
- **Implantação em sistemas embutidos** para dispositivos com recursos limitados (teoricamente)
- **Paralelização nativa** com threads C++ padrão (possível, mas não automaticamente)
- **Implantação AOT** – sem fase de aquecimento

---

## Índice

0. [Por Que Este Projeto?](#por-que-este-projeto)
1. [Background da Transpilação TypeScript](#1-background-da-transpilação-typescript)
2. [A Inovação Central](#2-a-inovação-central)
3. [O Problema da Factory Function e Solução](#3-o-problema-da-factory-function-e-solução)
4. [Geração de Código: generate_ts_printer.ts](#4-geração-de-código-generate_ts_printerts)
5. [Arquitetura da Camada Comum](#5-arquitetura-da-camada-comum)
6. [Arquitetura do Printer C++](#6-arquitetura-do-printer-c)
7. [Cadeia de Herança Mixin](#7-cadeia-de-herança-mixin)
8. [Implementação da Stdlib C++](#8-implementação-da-stdlib-c)
9. [Sistema de Módulos](#9-sistema-de-módulos)
10. [Tratamento de Tipos União](#10-tratamento-de-tipos-união)
11. [Narrowing de Tipo com typeof](#11-narrowing-de-tipo-com-typeof)
12. [Sistema de Substituição de Funções](#12-sistema-de-substituição-de-funções)
13. [CLI e Sistema de Build](#13-cli-e-sistema-de-build)
14. [Estrutura do Projeto](#14-estrutura-do-projeto)

---

## Índice

0. [Por Que Este Projeto?](#por-que-este-projeto)
1. [Background da Transpilação TypeScript](#1-background-da-transpilação-typescript)
2. [A Inovação Central](#2-a-inovação-central)
3. [O Problema da Factory Function e Solução](#3-o-problema-da-factory-function-e-solução)
4. [Geração de Código: generate_ts_printer.ts](#4-geração-de-código-generate_ts_printerts)
5. [Arquitetura da Camada Comum](#5-arquitetura-da-camada-comum)
6. [Arquitetura do Printer C++](#6-arquitetura-do-printer-c)
7. [Cadeia de Herança Mixin](#7-cadeia-de-herança-mixin)
8. [Implementação da Stdlib C++](#8-implementação-da-stdlib-c)
9. [Sistema de Módulos](#9-sistema-de-módulos)
10. [Tratamento de Tipos União](#10-tratamento-de-tipos-união)
11. [Narrowing de Tipo com typeof](#11-narrowing-de-tipo-com-typeof)
12. [Sistema de Substituição de Funções](#12-sistema-de-substituição-de-funções)
13. [CLI e Sistema de Build](#13-cli-e-sistema-de-build)
14. [Estrutura do Projeto](#14-estrutura-do-projeto)

---

## 1. Background da Transpilação TypeScript

### 1.1 O Pipeline Padrão

TypeScript transpila passando por estas etapas:

```
Source (.ts)
    ↓
Parser → AST (Abstract Syntax Tree)
    ↓
Transformers (AST → AST)
    ↓
Printer → Output (.js)
```

O compilador TypeScript (`tsc`) já possui sistemas altamente sofisticados para cada etapa:
- **Parser**: `ts.createSourceFile()` – faz parse da source para AST
- **Transformers**: funções que transformam nós AST
- **Printer**: `createPrinter()` – emite texto a partir do AST

### 1.2 Por Que Reaproveitar?

O printer do TypeScript lida com:
- Mais de 200 tipos de sintaxe (FunctionDeclaration, CallExpression, BinaryExpression, etc.)
- Recuo e formatação adequada
- Comentários e JSDoc
- Source maps
- Milhares de casos extremos

Escrever isso do zero seria um trabalho enorme. O insight principal: **a sintaxe do TypeScript e do C++ é similar o suficiente** para que a maior parte da lógica de impressão possa ser compartilhada.

---

## 2. A Inovação Central

### 2.1 A Abordagem

Em vez de escrever um novo printer do zero, nós:

1. **Geramos** uma classe printer base a partir do código-fonte do TypeScript
2. **Estendemos** via herança de classes
3. **Substituímos** métodos específicos para emitir C++

```
ts.createProgram() → AST → Custom Printer → C++ Output
```

### 2.2 Métodos Originais Permanecem

Os métodos herdados lidam com a maioria dos nós AST inalterados:

```typescript
// Em RawTypescriptPrinter (gerado do código-fonte TS)
emitFunctionDeclaration(node: FunctionDeclaration): void {
    // Emite: function foo() { }
    // Também funciona para C++: void foo() { }
}
```

Apenas métodos que precisam de especificidades C++ são substituídos nos mixins.

---

## 3. O Problema da Factory Function e Solução

### 3.1 Por Que Herança Regular Não Funcionou

O printer do TypeScript não usa classes – ele usa **factory functions**:

```typescript
// Do emitter.ts do TypeScript
function createPrinter(
    printerOptions: PrinterOptions, 
    handlers?: PrintHandlers
): Printer {
    return {
        printFile(sourceFile) { ... },
        emit(node) { ... },
        // ... centenas mais métodos
    };
}
```

Isso retorna um objeto simples, não uma instância de classe. Você não pode estender funções factory com herança de classes.

### 3.2 A Solução: Transformar Factory em Classe

O script `out_languages/common/generate_ts_printer.ts`:

1. **Baixa** o `emitter.ts` do TypeScript do GitHub (v5.9.3)
2. **Transforma** funções factory em métodos de classe
3. **Adiciona** novos parâmetros a funções-chave
4. **Salva** o resultado em `out_languages/common/ts_printer.ts`

A transformação:

```typescript
// ANTES: função factory
function createPrinter(options) {
    return { emitFunctionDeclaration(node) { ... } };
}

// DEPOIS: método de classe
class RawTypescriptPrinter {
    emitFunctionDeclaration(node: FunctionDeclaration): void {
        // mesma implementação
    }
}
```

### 3.3 Parâmetros-Chave Adicionados

O script faz patch em funções para aceitar parâmetros adicionais:

```typescript
// emitFiles - agora aceita função printer customizada
export function emitFiles(
    resolver, host, targetSourceFile,
    { scriptTransformers, declarationTransformers },
    emitOnly, onlyBuildInfo, forceDtsEmit, skipBuildInfo,
    createPrinterFunc = createPrinter,    // NOVO: factory de printer customizada
    typeChecker?: ts.TypeChecker          // NOVO: verificador de tipos
): EmitResult

// createPrinter - agora aceita contexto extra
export function createPrinter(
    extra: EmitterExtraContext,           // NOVO: contexto com typeChecker, etc.
    printerOptions: PrinterOptions = {},
    handlers: PrintHandlers = {}
): Printer
```

Estes parâmetros permitem que o pipeline de emit:
- Use um printer customizado em vez do padrão do TypeScript
- Consulte tipos via `typeChecker.getTypeAtLocation(node)`

---

## 4. Geração de Código: generate_ts_printer.ts

### 4.1 Localização e Propósito

**Arquivo**: `out_languages/common/generate_ts_printer.ts`

Este script:
1. Baixa o `emitter.ts` do TypeScript do GitHub
2. Aplica transformações
3. Salva em `ts_printer.ts` (e backup `.orig`)

Roda apenas quando se atualiza a versão do TypeScript.

### 4.2 Transformações Aplicadas

```typescript
const patches = {
    // Adiciona parâmetro EmitterExtraContext ao createPrinter
    createPrinter: [{
        args: 'extra: EmitterExtraContext, ' + originalArgs
    }],
    
    // Adiciona createPrinterFunc e typeChecker ao emitFiles
    emitFiles: [{
        args: originalArgs + ', createPrinterFunc = createPrinter, typeChecker?: ts.TypeChecker'
    }],
    
    // Modifica emitJsFileOrBundle para usar printer customizado
    emitJsFileOrBundle: [{
        body: body => body.replace('createPrinter(', 'createPrinterFunc({typeChecker, ...}, ')
    }],
    
    // Extensão de saída customizada (permite .cpp ao invés de .js)
    getOutputExtension: [{
        body: '\n    return typoly_getOutputExtension(fileName, options);'
    }]
};
```

### 4.3 O EmitterExtraContext

**Arquivo**: `out_languages/common/emitter_extra.ts`

```typescript
export type EmitterExtraContext = {
    typeChecker?: TypeChecker        // Consulta tipos nos nós AST
    compilerOptions?: CompilerOptions  // Configurações do compilador
    resolver?: EmitResolver      // Informações de resolução de módulos
    host?: EmitHost             // Sistema de arquivos, etc.
};
```

Esta é a ponte entre o pipeline de emit e nosso printer customizado.

---

## 5. Arquitetura da Camada Comum

### 5.1 Estrutura de Diretórios

```
out_languages/common/
├── ts_printer.ts          # RawTypescriptPrinter (gerado do TS)
├── ts_printer.ts.orig   # Cópia original do GitHub
├── generate_ts_printer.ts # Script gerador
├── emitter_extra.ts    # EmitterExtraContext & helpers
└── base_printer.ts   # TypolyBasePrinter
```

### 5.2 TypolyBasePrinter

**Arquivo**: `out_languages/common/base_printer.ts`

Classe base para todos os printers de linguagem, fornece utilitários compartilhados:

```typescript
export class TypolyBasePrinter extends RawTypescriptPrinter {
    typeChecker: ts.TypeChecker | undefined;
    packageName: string = "main";
    currentModuleName: string = "";
    namespaceImports: Map<string, string> = new Map();
    namedImports: Map<string, string> = new Map();

    // --- Helpers compartilhados ---
    
    // Parse argumentos genéricos: "T, U" → ["T", "U"]
    protected splitGenericArgs(args: string): [string, string];
    
    // Verifica se nó tem modificador export
    protected isExported(node: Node): boolean;
    
    // Obtém nome da classe que contém o nó
    protected getContainingClassName(node: Node): string;
    
    // Obtém nome da classe base da cláusula extends
    protected getBaseClassName(node: Node): string | undefined;
    
    // Escapa literais de string
    protected escapeString(str: string): string;
    
    // Extrai valor em tempo de compilação da expressão
    protected extractArgumentValue(arg: ts.Expression): any;
    
    // Obtém tipo de dado do argumento (string, number, boolean, etc.)
    protected getArgumentDataType(arg: ts.Expression): string | undefined;
}
```

---

## 6. Arquitetura do Printer C++

### 6.1 Estrutura de Diretórios

```
out_languages/cpp/
├── config/
│   ├── resolver.ts              # Resolução de substituição de funções
│   ├── types.ts               # Tipos TypeScript para config
│   └── function_overrides.json # Config de overload de funções
├── printer/
│   ├── index.ts             # CppPrinter (final)
│   ├── base.ts              # CppPrinterBase
│   └── mixins/
│       ├── declarations.ts  # Classes, funções, enums, variáveis
│       ├── expressions.ts  # Ops binários, chamadas, acesso a propriedade
│       ├── statements.ts # If, for, while, return, try
│       └── imports.ts    # Import/export, arquivo fonte
└── stdlib/               # Módulos C++20
    ├── builtin.mxx        # Tipos base
    ├── union.mxx         # União<T, U>
    ├── console.mxx       # Console
    ├── math.mxx         # Math
    ├── fs.mxx, os.mxx, path.mxx, etc.
```

### 6.2 CppPrinterBase

**Arquivo**: `out_languages/cpp/printer/base.ts`

Estende `TypolyBasePrinter` com utilitários específicos do C++:

```typescript
export class CppPrinterBase extends TypolyBasePrinter {
    // --- Conversão de nome de módulo ---
    
    // "src/utils/helper.ts" → "src__utils__helper"
    protected computeModuleName(filePath: string): string;
    
    // "./utils" → "src__utils"
    protected toCppModulePath(tsModuleName: string): string;

    // --- Mapeamento de tipos ---
    
    // TypeNode → C++: "string" → "String", "number" → "double"
    protected typeToString(typeNode: TypeNode): string;
    
    // Tipo inferido → C++: "string[]" → "Vector<String>"
    protected mapInferredType(tsType: string): string;
    
    // Trata referências de tipo (Array<T> → Vector<T>)
    protected handleTypeReference(ref: ts.TypeReferenceNode): string;

    // --- Utilitário ---
    
    // Escapa keywords C++: "class" → "class_"
    protected escapeCppKeyword(name: string): string;
    
    // Resolve substituição de função da config
    protected resolveFunctionOverride(
        fullFunctionName: string, 
        args: ts.NodeArray<ts.Expression>
    ): { cppFunction: string } | null;
}
```

### 6.3 Mapeamento de Tipos

| TypeScript | C++ | Nota |
|------------|-----|------|
| `string` | `String` | Wrapper customizado |
| `number` | `double` | |
| `boolean` | `bool` | |
| `void` | `void` | |
| `any` | `Value` | |
| `string[]` | `Vector<String>` | |
| `T \| U` | `Union<T, U>` | Tipo união |
| `Map<K,V>` | `Map<K,V>` | |
| `Set<T>` | `Set<T>` | |
| `RegExp` | `RegExp` | Classe customizada |
| `Date` | `Date` | Classe customizada |

---

## 7. Cadeia de Herança Mixin

### 7.1 Por Que Mixins?

Cada arquivo lida com uma categoria de nós AST. Isso mantém o código gerenciável e fornece fronteiras claras.

```
RawTypescriptPrinter (base do TS)
    ↓ extends
TypolyBasePrinter (helpers compartilhados)
    ↓ extends
CppPrinterBase (utilitários C++)
    ↓ extends
DeclarationsMixin (declarations.ts)
    ↓ extends
ExpressionsMixin (expressions.ts)
    ↓ extends
StatementsMixin (statements.ts)
    ↓ extends
ImportsMixin (imports.ts)
    ↓ extends
CppPrinter (index.ts - vazio, só herda)
```

### 7.2 Responsabilidades dos Mixins

| Mixin | Arquivo | Lida com |
|-------|---------|----------|
| DeclarationsMixin | `declarations.ts` | `class`, `function`, `enum`, `interface`, `type alias`, `var/let/const` |
| ExpressionsMixin | `expressions.ts` | `a + b`, `foo()`, `obj.prop`, literais |
| StatementsMixin | `statements.ts` | `if`, `for`, `while`, `return`, `try/catch`, typeof checks |
| ImportsMixin | `imports.ts` | `import`, `export`, emissão de arquivo fonte |

### 7.3 Como se Conectam

Quando se emite um arquivo fonte:

1. `ImportsMixin.emitSourceFile()` é chamado
2. Itera statements, chama `this.emit(stmt)`
3. Para funções → `DeclarationsMixin.emitFunctionDeclaration()`
4. Para chamadas → `ExpressionsMixin.emitCallExpression()`
5. Para operadores → `ExpressionsMixin.emitBinaryExpression()`

Cada mixin substitui apenas o que precisa; o resto passa para o pai.

---

## 8. Implementação da Stdlib C++

### 8.1 Arquivos de Módulo

A stdlib é implementada como módulos C++20 (arquivos `.mxx`). Eles envolvem APIs JavaScript em C++ idiomático.

### 8.2 Módulos Chave

**builtin.mxx** - Tipos base:
```cpp
export module typoly_std_builtin;

export namespace typoly_std_builtin {
    // String class - envolve std::string com API JS-like
    class String {
    public:
        size_t length() const;
        String slice(int start, int end) const;
        // ... mais métodos
    };
    
    // Vector<T> - envolve std::vector
    template <typename T>
    class Vector {
    public:
        void push_back(const T& value);
        T& at(size_t index);
        size_t size() const;
        // ... mais métodos
    };
    
    // Map<K, V> - envolve std::map
    // Set<T> - envolve std::set
    // etc.
}
```

**union.mxx** - Tipos união:
```cpp
export module typoly_std_union;

export namespace typoly_std_union {
    template <typename... Ts>
    class Union {
    private:
        std::variant<Ts...> var_;  // Usa std::variant internamente
    public:
        // Constrói a partir do valor
        template <typename T>
        Union(T&& value);
        
        // Verificação de tipo
        template <typename T>
        bool holds() const;
        
        // Obtém valor
        template <typename T>
        T& as();
    };
}
```

### 8.3 std::variant Por Trás das Cenas

A classe `Union` envolve `std::variant`:

```cpp
#include <variant>

template <typename... Ts>
class Union {
    std::variant<Ts...> var_;  // O armazenamento real
    
public:
    template <typename T>
    bool holds() const {
        return std::holds_alternative<T>(var_);  // Verifica tipo
    }
    
    template <typename T>
    T& as() {
        return std::get<T>(var_);  // Obtém valor
    }
};
```

É por isso que o narrowing com typeof funciona: `value.holds<String>()` chama `std::holds_alternative<String>()`.

---

## 9. Sistema de Módulos

### 9.1 Conversão de Imports

Imports do TypeScript são convertidos para módulos C++20:

```typescript
// TypeScript
import { testVariables } from './tests/test_variables';
import * as fs from 'fs';
import utils from './utils';
```

Torna-se:

```cpp
// C++
import tests__test_variables;
import typoly_std_fs;  // Módulos core do Node.js mapeiam para stdlib
import src__utils;

namespace tests__test_variables {
    void testVariables();
}
```

### 9.2 Conversão de Nome de Módulo

**Método**: `toCppModulePath()` em `CppPrinterBase`

```typescript
protected toCppModulePath(tsModuleName: string): string {
    let name = tsModuleName.replace(/^["']|["']$/g, "");  // Remove aspas
    name = name.replace(/^(\.\/)/, "");                       // Remove ./
    name = name.replace(/^(\.\.\/)/, "../");
    name = name.replace(/\//g, "__");                     // / → __
    name = name.replace(/\./g, "");                     // Remove .
    name = name.replace(/-/g, "_");                    // - → _
    name = name.replace(/\.tsx?$/, "");                 // Remove .ts/.tsx
    return name;
}
```

### 9.3 O Processo de emitSourceFile

**Arquivo**: `out_languages/cpp/printer/mixins/imports.ts`

O método `emitSourceFile()`:

1. **Emite global module fragment** (necessário para includes de header)
2. **Emite module declaration**: `export module test;`
3. **Emite imports**: `import tests__test_variables;`
4. **Categoriza statements**: declarations vs TLD (código de nível superior)
5. **Emite forward declarations** (para hoisting)
6. **Emite função __tld()** (executa código de nível superior)
7. **Emite as declarações reais**

### 9.4 Tratamento de TLD (Top-Level Declarations)

JavaScript permite execução de código em nível superior. C++ não permite. O transpiler:

```cpp
// JavaScript (em test.ts)
console.log("hello");
const x = 5;
testFunction();

// C++ - envolvido na função __tld()
export void __tld() {
    __TLD_INIT();
    console::log("hello");
    const double x = 5;
    testFunction();
}
```

A função `__tld()` é chamada a partir de `main()` em tempo de execução.

### 9.5 Macros TLD Explicadas

O sistema TLD usa macros definidas em `out_languages/cpp/stdlib/typoly_macros.h`. Cada macro tem um propósito específico:

**`typoly_macros.h`** - As definições das macros:
```cpp
#pragma once

// Define chamadas TLD de módulos importados
#define __IMPORT_TLD_BLOCK(...) \
    void __imported_modules_tld() { __VA_ARGS__; }

// Bloco de import vazio para módulos sem imports  
#define __IMPORT_TLD_BLOCK_EMPTY() \
    inline void __imported_modules_tld() {}

// Chama a função __tld() de um único módulo importado
#define __IMPORT_TLD(modulename) modulename::__tld()

// Macros helper TLD - emita estes separadamente
#define __TLD_INITIALIZED bool __tld_initialized = false
#define __TLD_INIT() if (__tld_initialized) return; __tld_initialized = true; __imported_modules_tld()
```

**Explicações expandidas:**

| Macro | Definição | Propósito |
|-------|-----------|-----------|
| `__TLD_INITIALIZED` | `bool __tld_initialized = false;` | Flag booleana para rastrear se TLD foi executado (previne re-execução) |
| `__TLD_INIT()` | `if (__tld_initialized) return; __tld_initialized = true; __imported_modules_tld();` | Guarda que retorna cedo se já inicializado, depois define flag e chama funções TLD dos módulos importados |
| `__IMPORT_TLD(modulename)` | `modulename::__tld();` | Chama a função `__tld()` de outro módulo para inicializar seu código de nível superior primeiro |
| `__IMPORT_TLD_BLOCK({ ... })` | Define `void __imported_modules_tld() { ... }` | Agrupa múltiplas chamadas `__IMPORT_TLD()` em uma única função |
| `__IMPORT_TLD_BLOCK_EMPTY()` | Define `void __imported_modules_tld() {}` | Para módulos sem dependências |

**Exemplo completo:**

```cpp
// Fonte
import { testVariables } from './tests/test_variables';
console.log("hello");
```

Gera:

```cpp
#include "typoly_macros.h"

namespace test {
    // Forward declarations
    void testVariables();
    
    // Bloco de import TLD - chama dependências primeiro
    __IMPORT_TLD_BLOCK({
        __IMPORT_TLD(tests__test_variables);
    });
    
    // Flag de inicialização TLD
    __TLD_INITIALIZED;
    
    // Função TLD - ponto de entrada para código de nível superior
    export void __tld() {
        __TLD_INIT();           // Se já inicializado, retorna cedo
                                // Caso contrário: define flag, chama TLDs importados
        
        console::log("hello");  // Código de nível superior real
    }
    
    void testVariables() { ... }
}
```

Quando `main()` chama `test::__tld()`:
1. `__TLD_INIT()` é chamado
2. Se não inicializado (`__tld_initialized == false`):
   - Define `__tld_initialized = true`
   - Chama `__imported_modules_tld()` → chama `tests__test_variables::__tld()` primeiro
   - Executa o código de nível superior: `console::log("hello")`
3. Se já inicializado, retorna cedo (idempotente)

### 9.6 Blocos de Import TLD

Para módulos que importam uns aos outros, as dependências devem inicializar primeiro:

```cpp
__IMPORT_TLD_BLOCK({
    __IMPORT_TLD(tests__test_variables);
    __IMPORT_TLD(tests__test_functions);
});
```

A função `__tld()` de cada módulo chama a `__tld()` das dependências primeiro.

---

## 10. Tratamento de Tipos União

### 10.1 O Desafio

Tipos união do TypeScript (`string | number`) não têm equivalente direto em C++. Variáveis JavaScript podem conter qualquer tipo; variáveis C++ são estaticamente tipadas.

### 10.2 A Solução: Classe Union<T, U>

A stdlib fornece `Union<T, U, ...>` usando `std::variant`:

```cpp
// out_languages/cpp/stdlib/union.mxx
template <typename... Ts>
class Union {
    std::variant<Ts...> var_;
public:
    template <typename T>
    bool holds() const {
        return std::holds_alternative<T>(var_);
    }
    
    template <typename T>
    T& as() {
        return std::get<T>(var_);
    }
};
```

### 10.3 Inferência de Tipo

Quando o verificador de tipos detecta um tipo união:

```typescript
let u: string | number = "hello";
```

Gera:

```cpp
Union<String, double> u = "hello";
```

### 10.4 Exemplo de Transformação

TypeScript:
```typescript
function processValue(value: string | number): string {
    if (typeof value === "string") {
        return "String value";
    } else {
        return "Number value";
    }
}
```

C++:
```cpp
String processValue(Union<String, double> value) {
    if (value.holds<String>()) {
        return "String value";
    } else {
        return "Number value";
    }
}
```

O parâmetro da função é automaticamente tipado como `Union<String, double>`. O `typeof` se torna `value.holds<String>()`.

---

## 11. Narrowing de Tipo com typeof

### 11.1 Como Funciona

**Arquivo**: `out_languages/cpp/printer/mixins/statements.ts`

O código detecta padrões de `typeof x === "string"`:

```typescript
// Mapeia resultados TypeScript typeof para C++
const TYPEOF_MAP: Record<string, string> = {
    "string": "String",
    "number": "double", 
    "boolean": "bool",
    "object": "Value",
    "function": "Function",
    "undefined": "Value",
};
```

### 11.2 Lógica de Detecção

```typescript
private isTypeofCheck(node: ts.Expression): { variable: string, type: string, isPositive: boolean } | null {
    // Verifica: typeof x === "string" (lado esquerdo)
    if (ts.isTypeOfExpression(node.left) && ts.isStringLiteral(node.right)) {
        const typeArg = node.left.expression;
        if (ts.isIdentifier(typeArg)) {
            const typeStr = node.right.text;
            const cppType = TYPEOF_MAP[typeStr];
            if (cppType) {
                return { variable: typeArg.text, type: cppType, isPositive: true };
            }
        }
    }
    // Também verifica: "string" === typeof x (lado direito)
    // ...mesma lógica
}
```

### 11.3 Geração de Código

Em `emitIfStatement()`:

```typescript
emitIfStatement(node: IfStatement): void {
    const typeofCheck = this.isTypeofCheck(node.expression);
    
    if (typeofCheck && this.typeChecker) {
        // Consulta o tipo da variável
        const type = this.typeChecker.getTypeOfSymbolAtLocation(symbol, node);
        const typeStr = this.typeChecker.typeToString(type);
        
        if (typeStr.includes("|") || typeStr.startsWith("Union")) {
            // Gera: value.holds<Type>()
            this.write(typeofCheck.variable);
            this.write(".holds<");
            this.write(typeofCheck.type);
            this.write(">()");
        } else {
            // Tipo já conhecido → simplifica para true
            this.write("true");
        }
    } else {
        // If statement normal
        this.emitExpression(node.expression);
    }
}
```

### 11.4 Saída Simplificada

Para declarações de variáveis simples, `typeof x === "string"` torna-se `if (true)`:

```typescript
let value: string = "hello";
if (typeof value === "string") { ... }
```

Gera:

```cpp
String value = "hello";
if (true) { ... }
```

Isso funciona porque o tipo da variável já é conhecido como `String` pela declaração.

---

## 12. Sistema de Substituição de Funções

### 12.1 Por Que Substituições?

Algumas funções JavaScript têm overloads diferentes baseados em argumentos:

```javascript
// fs.readFileSync(path)
// fs.readFileSync(path, { encoding: 'utf8' })
// fs.readFileSync(path, { encoding: 'binary' })
```

Estas precisam de implementações C++ diferentes.

### 12.2 Arquivo de Configuração

**Arquivo**: `out_languages/cpp/config/function_overrides.json`

```json
{
  "functions": {
    "fs.readFileSync": {
      "optionParameter": 1,
      "optionName": "encoding",
      "overloads": {
        "utf8": {
          "cppFunction": "readFileSync",
          "returnType": "String"
        },
        "base64": {
          "cppFunction": "readFileSyncBase64", 
          "returnType": "String"
        },
        "binary": {
          "cppFunction": "readFileSyncBuffer",
          "returnType": "Vector<double>"
        }
      },
      "default": {
        "cppFunction": "readFileSync",
        "returnType": "String"
      }
    }
  }
}
```

### 12.3 Lógica de Resolução

**Arquivo**: `out_languages/cpp/config/resolver.ts`

```typescript
export function resolveFunctionOverride(
    functionName: string,
    args: any[],
    optionValue?: string,
    dataType?: string
): ResolvedOverride {
    const config = getFunctionOverrideConfig(functionName);
    
    // Verifica cada condição de overload
    for (const [name, overload] of Object.entries(config.overloads)) {
        switch (overload.condition.type) {
            case 'parameterCount':
                if (args.length === overload.condition.value) {
                    return { cppFunction: overload.cppFunction, ... };
                }
                break;
            case 'optionValue':
                if (optionValue === condition.value) {
                    return { cppFunction: overload.cppFunction, ... };
                }
                break;
        }
    }
    
    return { cppFunction: config.default.cppFunction, ... };
}
```

### 12.4 Uso no Printer

Em `emitCallExpression()`:

```typescript
emitCallExpression(node: CallExpression): void {
    const propExpr = node.expression;
    const fullFunctionName = `${importedModule}.${methodName}`;
    const override = this.resolveFunctionOverride(fullFunctionName, node.arguments);
    
    if (override) {
        this.write(importedModule);
        this.write("::");
        this.write(override.cppFunction);
        this.emitArguments(node.arguments);
    }
}
```

---

## 13. CLI e Sistema de Build

### 13.1 Ponto de Entrada

**Arquivo**: `index.ts`

O CLI:
1. Interpreta argumentos: `--lang cpp|go`, `--out <dir>`, `--file <file>`, `--watch`
2. Cria programa TypeScript: `ts.createProgram()`
3. Substitui emit para usar printer customizado
4. Gera arquivos de build (CMakeLists.txt, go.mod)

### 13.2 Processo de Emit Customizado

A chave é substituir `program.emit()`:

```typescript
program.emit = (sourceFile, ...) => {
    // Em vez do printer JS padrão, usa nosso printer C++
    let result = tc.runWithCancellationToken(() => emitFiles(
        emitresolver,
        emithost,
        sourceFile,
        { declarationTransformers: [], scriptTransformers: [] },
        emitOnly,
        false,
        forceDtsEmit,
        skipBuildInfo,
        createPrinterFunc,    // Nossa factory de printer
        tc                  // Verificador de tipos
    ));
    return result;
};
```

### 13.3 Arquivos de Build Gerados

Para C++, gera:
- **CMakeLists.txt** - Configuração de build CMake
- **main.cpp** - Ponto de entrada chamando `__tld()`
- **typoly_macros.h** - Macros de TLD e import
- **stdlib/** - Módulos C++ copiados

### 13.4 Estrutura do CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.28)
project(test_package LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(stdlib typoly_stdlib)

set(MODULE_SOURCES
    "test.cpp"
    "tests/test_variables.cpp"
    ...
)

add_executable(${PROJECT_NAME} ${MODULE_SOURCES} main.cpp)
target_sources(${PROJECT_NAME} PRIVATE FILE_SET CXX_MODULES FILES ${MODULE_SOURCES})
target_link_libraries(${PROJECT_NAME} PRIVATE typoly_stdlib)
```

---

## 14. Estrutura do Projeto

### 14.1 Diretório Root

```
typoly/
├── index.ts                   # Ponto de entrada CLI
├── package.json             # Dependências
├── tsconfig.json           # Config TypeScript
├── DEVELOPERS.md          # Este arquivo
├── Union.md              # Notas de design de União
└── test_package/         # Suíte de testes
    ├── test.ts         # Teste principal
    ├── tests/        # Testes individuais
    ├── subfolder/    # Testes de subdiretório
    └── .typoly_built/  # Saída gerada
        └── cpp/
            ├── test.cpp
            ├── tests/
            ├── stdlib/
            ├── CMakeLists.txt
            └── main.cpp
```

### 14.2 Referência de Arquivos Chave

| Caminho | Propósito |
|---------|-----------|
| `index.ts` | CLI, criação de programa, emit customizado |
| `out_languages/common/ts_printer.ts` | RawTypescriptPrinter gerado |
| `out_languages/common/base_printer.ts` | TypolyBasePrinter |
| `out_languages/common/emitter_extra.ts` | EmitterExtraContext |
| `out_languages/cpp/printer/base.ts` | CppPrinterBase |
| `out_languages/cpp/printer/mixins/*.ts` | Cadeia de mixins |
| `out_languages/cpp/config/resolver.ts` | Resolução de substituição de funções |
| `out_languages/cpp/config/function_overrides.json` | Config de substituições |
| `out_languages/cpp/stdlib/*.mxx` | Módulos stdlib C++ |

### 14.3 Arquivos de Teste

| Arquivo de Teste | Testa |
|------------------|-------|
| `tests/test_variables.ts` | Variáveis, constantes |
| `tests/test_functions.ts` | Funções, arrow functions |
| `tests/test_classes.ts` | Classes, herança |
| `tests/test_arrays.ts` | Arrays, métodos |
| `tests/test_strings.ts` | Métodos de string |
| `tests/test_operators.ts` | Operadores binários |
| `tests/test_control_flow.ts` | if, for, while, switch |
| `tests/test_union_*.ts` | Tratamento de tipos união |
| `tests/test_imports_exports.ts` | Módulos de import |
| `tests/test_math.ts`, `test_date.ts`, `test_regexp.ts`, etc. | APIs de stdlib |

---

## Resumo

Typoly funciona:

1. **Gerando** uma classe printer base a partir do código-fonte do TypeScript (transformação factory → classe)
2. **Estendendo** via herança de classes com mixins
3. **Mapeando** tipos: TS `string` → C++ `String`, `number` → `double`, `T|U` → `Union<T,U>`
4. **Tratando** narrowing com typeof: `typeof x === "string"` → `x.holds<String>()`
5. **Envolvendo** código de nível superior na função `__tld()`
6. **Gerando** arquivos de build (CMakeLists.txt)

O resultado é código C++20 idiomático que preserva a estrutura e a semântica do TypeScript original.