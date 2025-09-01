const fs = require('fs')
const path = require('path')
const ts = require('typescript')

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const full = path.join(dir, d.name)
    if (d.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(d.name)) return
      walk(full, cb)
    } else {
      cb(full)
    }
  })
}

function shouldProcess(file) {
  return file.endsWith('.ts') || file.endsWith('.tsx')
}

function outName(file) {
  return file.replace(/\.tsx?$/, file.endsWith('.tsx') ? '.jsx' : '.js')
}

function transpileFile(file) {
  const source = fs.readFileSync(file, 'utf8')
  const isTsx = /\.tsx$/.test(file)
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: isTsx ? ts.JsxEmit.Preserve : ts.JsxEmit.None,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      importHelpers: false,
      removeComments: false
    },
    fileName: path.basename(file)
  })

  const outPath = outName(file)
  fs.writeFileSync(outPath, result.outputText, 'utf8')
  console.log('Wrote:', outPath)
}

function main() {
  const roots = ['src']
  let count = 0
  roots.forEach((r) => {
    const root = path.join(process.cwd(), r)
    if (!fs.existsSync(root)) return
    walk(root, (file) => {
      if (shouldProcess(file)) {
        transpileFile(file)
        count++
      }
    })
  })
  console.log('Transpiled files:', count)
  console.log('Next steps: review emitted .js/.jsx files, remove TS-only constructs, run build.')
}

main()
