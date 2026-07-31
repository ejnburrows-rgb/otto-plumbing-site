# Progreso y revisión — Sitio web de OTTO Plumbing Inc.

> **BORRADOR de seguimiento.** Describe el estado real del sitio, no una
> promesa de entrega. Las fechas y aprobaciones marcadas
> `[PENDIENTE DE CONFIRMACIÓN]` las decide el propietario.

**Fecha de esta revisión:** 2026-07-30

---

## 1. Qué está listo en el código

**Importante — leer antes de la tabla:** "listo" aquí significa que el
trabajo existe, revisado y probado, en una rama todavía no fusionada a
`main` (la rama de entrega consolidada, PR #24). **`main` — y por lo tanto el
sitio público, incluso el día en que sirva el código correcto — no tiene
nada de esto todavía.** Los apartados 2 y 3 detallan la diferencia exacta.

| Área | Estado |
|---|---|
| Estructura del sitio | Servicios, por qué OTTO, portafolio, maestría y contacto — en `main` |
| Inglés y español | Cobertura completa — en la rama pendiente, no en `main` |
| Modo claro y oscuro | Funcionando en ambos idiomas — en `main` |
| Teléfono y escritorio | Comprobado a 390 px y en escritorio |
| Datos del negocio | Teléfono, licencia, horario y zona de servicio, todos confirmados |
| Imágenes generadas con IA | Aprobadas por el propietario; se mantienen |

## 2. Afirmaciones que deben retirarse — todavía visibles en `main`

Tres afirmaciones no verificables **siguen en `main` ahora mismo**, cada una
dos veces (seis apariciones en total). La retirada existe, probada, en la
rama pendiente (PR #24) — **no se ha fusionado**, así que hoy el sitio
público, si sirviera el código correcto, seguiría mostrándolas:

- «5,000+» trabajos completados
- «5.0 ★» de calificación promedio
- «24 h» para agendar la mayoría de los trabajos

Cuando el propietario fusione esa rama, no se sustituirán por otras cifras.
Una comprobación automática en esa rama impide que vuelvan a aparecer una vez
fusionada.

## 3. Cobertura en español — pendiente, no completada

**Hoy, en `main`, el sitio en español sigue mostrando texto en inglés.**
Comprobado directamente contra el código: la sección de Portafolio y
Maestría no tiene ninguna clave de traducción. Lo que falta, específicamente:
los enlaces de Portafolio y Maestría en ambos menús, las secciones completas
de Portafolio y Maestría, el texto bajo el nombre de la marca, la descripción
para buscadores y los nombres hablados de los botones con solo un icono.

Ese último punto importa para accesibilidad: un lector de pantalla en español
sigue anunciando esos controles en inglés, hoy.

La cobertura completa existe, escrita y probada, en la rama pendiente de
fusión (PR #24) — no en `main`. Este documento no debe leerse como
confirmación de que el sitio ya es bilingüe; no lo es todavía.

- **Aprobación de la rama pendiente y de los textos en español:**
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

**En `main` ahora mismo,** al fallar el envío solo aparece una alerta genérica
("Hubo un error al enviar el mensaje") — no hay aviso en la página ni se
dirige a la persona al teléfono. La corrección con un aviso honesto en
pantalla y el teléfono visible **existe en la rama pendiente (PR #24)**, no
en `main`.

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

1. **Fusionar la rama pendiente (PR #24)** a `main` — sin este paso, nada de
   lo descrito en los apartados 2, 3 y 5 llega siquiera a `main`, y mucho
   menos al público.
2. Corregir el proyecto de Vercel para que la dirección pública sirva `main`.
3. Revisar las comprobaciones automáticas en la cuenta de GitHub.
4. Aprobar los textos en español de la rama pendiente.
5. Decidir sobre el formulario de contacto.

- **Orden de prioridad acordado:** `[PENDIENTE DE CONFIRMACIÓN]`
