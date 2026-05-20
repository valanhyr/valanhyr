# Plan: Exploración Visual de Diseño Frontal

## Objetivo
Salir del modo de planificación para poder iniciar el servidor local de **Visual Companion** y generar prototipos interactivos en el navegador con 3 estéticas de diseño radicalmente diferentes.

## Pasos de Implementación
1. **Salir del Plan Mode:** Transición a modo ejecución para habilitar la ejecución de scripts (`run_shell_command`).
2. **Iniciar Servidor:** Lanzar el servidor visual mediante `scripts/start-server.sh --project-dir C:\DSI\valanhyr --foreground`.
3. **Generar Mockups Visuales:** Escribir archivos HTML con 3 opciones estéticas:
   - *Retro-Futurista (Cyberpunk/Terminal)*
   - *Elegancia Editorial (Minimalista y refinado)*
   - *Caos Geométrico (Estilo Bento)*
4. **Validación Visual:** El usuario podrá interactuar y visualizar las opciones en vivo en su navegador.
5. **Planificación de Código:** Una vez elegida la estética visual, se creará un plan definitivo para refactorizar `theme.css`, `global.css` y los componentes de UI.

## Verificación
- El servidor arranca correctamente en el puerto asignado.
- Los mockups se renderizan correctamente con la plantilla interactiva.
- El usuario puede seleccionar su opción preferida en el navegador.