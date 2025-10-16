// Auto-register all .vue components under /src/components using Vite's import.meta.globEager
// This lets you use shared components in templates without importing them manually.
export default function registerGlobalComponents(app) {
  // glob all vue files under src/components (relative to this file)
  // use import.meta.glob with eager:true for compatibility across Vite versions
  const modules = import.meta.glob('./components/**/*.vue', { eager: true })

  for (const path in modules) {
    const mod = modules[path]
    const comp = mod.default
    if (!comp) continue

    // prefer the component's own `name` option, fallback to filename
    const name = comp.name || (() => {
      const parts = path.split('/')
      const file = parts[parts.length - 1]
      return file.replace(/\.vue$/, '')
    })()

    // register globally
    app.component(name, comp)
  }
}
