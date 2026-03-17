

## Plan: Hardcodear variables de Lovable Cloud en el workflow de GitHub

Actualizar `.github/workflows/deploy.yml` para reemplazar las referencias a `${{ secrets.* }}` con los valores públicos del proyecto, eliminando la necesidad de configurar GitHub Secrets.

### Cambio único en `.github/workflows/deploy.yml`

Reemplazar las líneas del paso `npm run build`:

```yaml
- run: npm run build
  env:
    GITHUB_PAGES: "true"
    VITE_SUPABASE_URL: "https://ouzwtkqfmxztnpcgevfi.supabase.co"
    VITE_SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91end0a3FmbXh6dG5wY2dldmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTM1MjksImV4cCI6MjA4ODY2OTUyOX0.iskfXv0B6Le0R_iQZ08ilyB6ICEth-xmDok58J22vLE"
    VITE_SUPABASE_PROJECT_ID: "ouzwtkqfmxztnpcgevfi"
```

Esto es seguro porque son claves públicas (anon key) diseñadas para uso frontend. No necesitas configurar nada en GitHub.

