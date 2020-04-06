#!/usr/bin/env tsc

const _ = require('lodash')
const util = require('util')
const exec = require('child_process').exec
const ts = require('typescript')
const execp = util.promisify(exec)

const imports = {}
const tsTypes = {}
const types = {}

execp(`find ./src/data -not -name index.ts -exec cat {} \\;`, {shell: '/bin/bash'}).then(x => {
  // console.log(x.stdout)
  // f = fs.readFileSync('./src/data/index.ts', 'utf8')
  f = x.stdout
  node = ts.createSourceFile('all.ts', f, ts.ScriptTarget.Latest)
})

k = x => ts.SyntaxKind[x.kind]
n = x => {
  try {
    console.log('1', x)
    console.log('2', x.name)
    // console.log('3 ', x.name)
    return x.name.escapedText
  } catch (err) {
    return 'n/a'
  }
}

node.forEachChild(x => xns.push(x))

const importNodes = xns.filter(x => k(x) === 'ImportDeclaration')

// Note - name collisions will break this pattern, just don't reuse names from schema.org
importNodes.forEach(x => {
  let m = x.moduleSpecifier.text
  if (typeof imports[m] === 'undefined') {
    imports[m] = []
  }
  imports[m] = imports[m].concat(x.importClause.namedBindings.elements.map(e => e.name.escapedText))
})

Object.keys(imports).forEach(k => {
  imports[k] = _.uniq(imports[k])
})

// Categorize the type nodes
node.forEachChild(x => {
  const kind = k(x)
  const name = n(x)
  console.log(kind)

  switch (kind) {
    case 'InterfaceDeclaration':
      tsTypes[name] = x
      break
    case 'TypeAliasDeclaration':
      tsTypes[name] = x
      break
    case 'EndOfFileToken':
      break
    case 'ImportDeclaration':
      break
  }
})

// Invert the type nodes to use @type instead of the Typescript name
Object.keys(tsTypes).forEach(k => {
  let x = tsTypes[k]

  // Does it have a '@type'?  If so, that's the canonical name
  let
})

const resolveOriginalTypeName

Object.keys(types).forEach(k => {
  let x = types[k]
  contextJsons[k] = createContext(x, {isInterface: k(x)})
  // Types are defined either as an explicit @type member...

  // or as a union type expressed with a node containing a @type member
  resolveOriginalTypeName(x)
})

const createContext = (node, opts) => {
  const context = {}

  if (opts.isInterfaclac) {
  } else {
  }

  types.push(context)
}

/*[
  ('pos',
  'end',
  'flags',
  'modifierFlagsCache',
  'transformFlags',
  'parent',
  'kind',
  'text',
  'bindDiagnostics',
  'bindSuggestionDiagnostics',
  'languageVersion',
  'fileName',
  'languageVariant',
  'isDeclarationFile',
  'scriptKind',
  'pragmas',
  'checkJsDirective',
  'referencedFiles',
  'typeReferenceDirectives',
  'libReferenceDirectives',
  'amdDependencies',
  'hasNoDefaultLib',
  'statements',
  'endOfFileToken',
  'externalModuleIndicator',
  'nodeCount',
  'identifierCount',
  'identifiers',
  'parseDiagnostics')
] */
