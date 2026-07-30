# Progreso y revisión — Sitio web de OTTO Plumbing Inc.

> **BORRADOR de seguimiento.** Describe el estado real del sitio, no una
> promesa de entrega. Las fechas y aprobaciones marcadas
> `[PENDIENTE DE CONFIRMACIÓN]` las decide el propietario.

**Fecha de esta revisión:** 2026-07-30

---

## 1. Qué está listo en el código

| Área | Estado |
|---|---|
| Estructura del sitio | Servicios, por qué OTTO, portafolio, maestría y contacto |
| Inglés y español | Cobertura completa; sin texto en inglés en modo español |
| Modo claro y oscuro | Funcionando en ambos idiomas |
| Teléfono y escritorio | Comprobado a 390 px y en escritorio |
| Datos del negocio | Teléfono, licencia, horario y zona de servicio, todos confirmados |
| Imágenes generadas con IA | Aprobadas por el propietario; se mantienen |

## 2. Afirmaciones retiradas

Tres afirmaciones no verificables fueron eliminadas del código, cada una
aparecía dos veces. **No se sustituyeron por otras cifras.**

- «5,000+» trabajos completados
- «5.0 ★» de calificación promedio
- «24 h» para agendar la mayoría de los trabajos

Una comprobación automática impide que vuelvan a aparecer.

## 3. Cobertura en español

Quedaban partes visibles en inglés incluso con el sitio en español: los enlaces
de Portafolio y Maestría en ambos menús, las secciones completas de Portafolio
y Maestría, el texto bajo el nombre de la marca, la descripción para buscadores
y los nombres hablados de los botones con solo un icono. **Todo eso ya está en
español.**

Ese último punto importa para accesibilidad: un lector de pantalla en español
anunciaba los controles en inglés.

- **Revisión del tono y las palabras por parte del propietario:**
  `[PENDIENTE DE CONFIRMACIÓN]`

## 4. Dos asuntos que requieren al propietario

**a) La dirección pública no muestra el código actual.**

Está comprobado con nueve marcadores; ocho no coinciden. Los más claros:
`/version.json` responde 404 aunque está en el repositorio, y las redes
sociales antiguas aparecen cuatro veces en la página pública y ninguna en el
código. **Mientras esto no se corrija, ningún cambio aprobado será visible para
el público**, incluida la retirada de las tres afirmaciones.

La causa más probable es que la dirección pública pertenezca a un proyecto de
Vercel distinto. Corregirlo requiere el panel de Vercel. Evidencia y pasos
exactos: `docs/DEPLOYMENT-MISMATCH.md`.

**b) Las comprobaciones automáticas no se están ejecutando.**

Todas las ejecuciones, en todas las ramas, terminan en 4 a 12 segundos sin
registros, lo cual es demasiado rápido para que algo se haya ejecutado. Es un
problema de la cuenta de GitHub, no del código. Los pasos a revisar están en el
mismo documento.

Mientras tanto, las comprobaciones se ejecutan de forma local y sus resultados
se adjuntan a cada entrega.

## 5. Formulario de contacto

El formulario **no entrega mensajes**; no hay servicio de envío configurado.
Antes decía «su mensaje ha sido enviado», lo cual era falso. Ahora muestra un
aviso honesto y dirige al teléfono.

- **Conectar un servicio de entrega o retirar el formulario:**
  `[PENDIENTE DE CONFIRMACIÓN]`

## 6. Asunto menor, señalado y no corregido

En pantallas de teléfono la barra superior sobresale unos 5 píxeles, lo que
permite un pequeño desplazamiento lateral. **Ya existía antes de este trabajo**
y no se corrigió aquí para no mezclarlo con los cambios de contenido e idioma.
Es un arreglo pequeño y aparte.

- **Autorización para corregirlo:** `[PENDIENTE DE CONFIRMACIÓN]`

## 7. Ritmo de revisión

- **Frecuencia de revisión:** `[PENDIENTE DE CONFIRMACIÓN]`
- **Medio de comunicación preferido:** `[PENDIENTE DE CONFIRMACIÓN]`
- **Persona que aprueba cambios:** `[PENDIENTE DE CONFIRMACIÓN]`
- **Fecha de la próxima revisión:** `[PENDIENTE DE CONFIRMACIÓN]`

## 8. Próximos pasos propuestos

1. Corregir el proyecto de Vercel para que la dirección pública sirva `main`.
2. Revisar las comprobaciones automáticas en la cuenta de GitHub.
3. Aprobar los textos en español.
4. Decidir sobre el formulario de contacto.

- **Orden de prioridad acordado:** `[PENDIENTE DE CONFIRMACIÓN]`
