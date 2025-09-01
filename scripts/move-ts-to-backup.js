const fs = require('fs')
const path = require('path')

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const full = path.join(dir, d.name)
    if (d.isDirectory()) {
      if (['node_modules', '.next', '.git', 'backup_ts'].includes(d.name)) return
      walk(full, cb)
    } else {
      cb(full)
    }
  })
}

function shouldMove(file) {
  return (file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('.d.ts')
}

function main() {
  const root = path.join(process.cwd(), 'src')
  if (!fs.existsSync(root)) {
    console.log('No src directory found')
    return
  }
  const backupRoot = path.join(process.cwd(), 'backup_ts')
  if (!fs.existsSync(backupRoot)) fs.mkdirSync(backupRoot)

  const moved = []
  walk(root, (file) => {
    if (shouldMove(file)) {
      const rel = path.relative(process.cwd(), file)
      const dest = path.join(backupRoot, rel)
      const destDir = path.dirname(dest)
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
      fs.renameSync(file, dest)
      moved.push({ from: file, to: dest })
    }
  })

  console.log('Moved files:', moved.length)
  moved.slice(0, 50).forEach(m => console.log('  ', m.from, '=>', m.to))
  if (moved.length > 50) console.log('  ...', moved.length - 50, 'more')
  console.log('Backup folder:', backupRoot)
}

main()
