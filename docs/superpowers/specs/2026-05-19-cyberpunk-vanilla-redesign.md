# Especificación de Diseño: Neumorfismo Cyberpunk + Glassmorphism (Vanilla Edition)

**Fecha:** 2026-05-19  
**Estado:** Pendiente de Revisión Final  
**Objetivo:** Transformar el portfolio actual de un estilo Neo-Brutalista estático a una estética dinámica, táctil y futurista utilizando exclusivamente tecnologías Web Vanilla (HTML/CSS/JS).

---

## 1. Identidad Visual

### 1.1 Paleta de Colores
- **Base (Superficie):** `#0d0d0d` (Negro Mate Profundo)
- **Sombra Profunda (Neumorfismo):** `#050505`
- **Brillo Sutil (Neumorfismo):** `#1a1a1a`
- **Acento Primario (Neón):** `#00ffff` (Cyan)
- **Acento Secundario (Neón):** `#ff00ff` (Magenta)
- **Texto:** `#f5f5f5` (Blanco roto para evitar fatiga visual)

### 1.2 Tipografía
- **Títulos:** Sans-Serif moderna con `letter-spacing: 0.1em` y `text-transform: uppercase`.
- **Cuerpo:** Sans-Serif limpia (inter-stack o similar del sistema).
- **Acentos:** Fuente monoespaciada para detalles técnicos/código.

---

## 2. Arquitectura de Componentes (Vanilla CSS)

### 2.1 Botones (Opción 2 - Relieve con Borde de Luz)
- **Base:** Gradiente sutil entre `#111` y `#080808`.
- **Borde:** 1px sólido `rgba(255, 255, 255, 0.15)`.
- **Efecto Dinámico:** Animación de barrido (`sweep`) que recorre el botón cada 3-5 segundos.
- **Interacción:** Al hacer hover, el borde transiciona a neón Cyan con un ligero `box-shadow`.

### 2.2 Tarjetas Neumórficas
- **Elevación:** Uso de sombras duales (`box-shadow`) para simular que emergen del fondo.
- **Bordes:** Borde casi imperceptible `rgba(255,255,255,0.02)` para definición extra.

### 2.3 Capas de Cristal (Glassmorphism)
- **Ubicación:** Navbar, Modales, Sidebars.
- **Efecto:** `backdrop-filter: blur(15px)` con un fondo `rgba(13, 13, 13, 0.7)`.
- **Borde:** "Borde de luz" superior para separar del fondo.

---

## 3. Dinamismo e Interactividad
- **Scroll Reveal:** Mantendremos y refinaremos las animaciones de aparición al hacer scroll.
- **Efecto de "Pulsación":** Los botones neumórficos transicionarán a una sombra interna (`inset box-shadow`) al ser clickeados para simular presión física.
- **Micro-interacciones:** Pequeños halos de neón que siguen el cursor en áreas específicas (opcional/refinamiento).

---

## 4. Restricciones Técnicas
- **Vanilla CSS:** Prohibido el uso de frameworks de utilidad (Tailwind) o librerías de componentes (Bootstrap/Material).
- **Vanilla JS:** Manipulación directa del DOM para efectos de arrastre o interactividad compleja.
- **Rendimiento:** Priorizar `transform` y `opacity` para animaciones suaves.

---

## 5. Próximos Pasos
1. Refactorización de `src/styles/theme.css` con las nuevas variables.
2. Actualización de `src/styles/global.css` para los estilos base neumórficos.
3. Ajuste de componentes de UI (`UiButton`, `UiCard`, `AppNavbar`).
4. Verificación de accesibilidad (contraste de neones vs fondo).
