# Entrega y transferencia — Sitio web de OTTO Plumbing Inc.

> **BORRADOR. No es un acta de entrega firmada ni una certificación de
> conformidad.** Este documento describe qué se entrega y qué queda pendiente.
> Nada aquí constituye aceptación hasta que el propietario firme el apartado
> final, y esa firma solo procede cuando la lista de verificación esté completa.

**Fecha del borrador:** 2026-07-30

---

## 1. Qué se entrega

- **Sitio web** estático, bilingüe, instalable como aplicación web.
- **Repositorio de código** `ejnburrows-rgb/otto-plumbing-site`, con todo el
  historial.
- **Documentación**: prueba del desajuste de despliegue
  (`docs/DEPLOYMENT-MISMATCH.md`), plan de español (`docs/SPANISH-PLAN.md`) y
  estos documentos de cliente.
- **Comprobaciones automáticas**: verificación de textos, traducciones y
  formato (`scripts/check-site.mjs`) y verificación de versión desplegada
  (`scripts/check-deployed-version.mjs`). **Estos dos archivos existen en la
  rama de entrega pendiente (PR #24), todavía no fusionada a `main`** — no se
  puede ejecutar ninguno de los dos contra el repositorio tal como está hoy.

## 2. Condición de entrega: nada de esto está en `main` todavía

**No se puede certificar esta entrega todavía, por dos motivos independientes,
no uno.**

**Primero:** las tres afirmaciones retiradas y la cobertura completa en
español **no están en `main`**. Existen, escritas y probadas, en la rama de
entrega pendiente (PR #24), que el propietario todavía no ha fusionado.
Hasta que eso ocurra, `main` sigue teniendo las tres afirmaciones y el
español incompleto, exactamente como estaban antes de este trabajo.

**Segundo,** e independiente del primero: incluso el día en que esa rama se
fusione, el sitio que ve el público en
`https://otto-plumbing-site.vercel.app` **no corresponde al código del
repositorio** — está probado con nueve marcadores, ocho no coinciden, y el
detalle completo está en `docs/DEPLOYMENT-MISMATCH.md`. Fusionar la rama
pendiente no resuelve esto por sí solo.

La firma del apartado 7 no debe ocurrir hasta que ambos se resuelvan y se
vuelvan a comprobar.

## 3. Accesos y credenciales a transferir

Ninguna clave se guarda en el repositorio.

| Cuenta | Titularidad tras la entrega |
|---|---|
| GitHub (repositorio) | `[PENDIENTE DE CONFIRMACIÓN]` |
| Vercel (proyecto y dominio) | `[PENDIENTE DE CONFIRMACIÓN]` |
| Dominio propio, si se contrata | `[PENDIENTE DE CONFIRMACIÓN]` |
| Formspree u otro servicio de formulario, si se conecta | `[PENDIENTE DE CONFIRMACIÓN]` |

- **Fecha y método de traspaso:** `[PENDIENTE DE CONFIRMACIÓN]`

## 4. Responsabilidades después de la entrega

| Tarea | Responsable |
|---|---|
| Pagar el alojamiento y el dominio, si aplica | `[PENDIENTE DE CONFIRMACIÓN]` |
| Mantener actualizados los datos del negocio (horario, teléfono) | `[PENDIENTE DE CONFIRMACIÓN]` |
| Revisar y aprobar cualquier cifra nueva antes de publicarla | Propietario |
| Corregir fallos dentro del periodo de garantía | `[PENDIENTE DE CONFIRMACIÓN]` |
| Cambios nuevos fuera del alcance | `[PENDIENTE DE CONFIRMACIÓN]` |

## 5. Limitaciones conocidas en el momento de la entrega

1. **La rama con las correcciones (afirmaciones retiradas, español completo,
   aviso honesto del formulario) no está fusionada a `main`** (apartado 2).
   Bloqueante para la firma.
2. **Aparte de lo anterior, la página pública tampoco sirve el código del
   repositorio**, sea cual sea la rama (apartado 2). Bloqueante independiente
   para la firma.
3. **El formulario de contacto no entrega mensajes** en ningún caso; no hay
   ningún servicio de envío conectado. En `main` hoy, al fallar solo muestra
   una alerta genérica; el aviso honesto con el teléfono visible está en la
   rama pendiente.
4. **Las comprobaciones automáticas de GitHub no se ejecutan** por un problema
   de la cuenta, no del código. Las comprobaciones se corrieron de forma local
   y sus resultados están en cada entrega de trabajo.
5. **Existe una pequeña superposición horizontal** en la barra superior en
   pantallas de teléfono (unos 5 píxeles). Ya existía antes de este trabajo;
   pendiente de una corrección aparte y sencilla.
6. **Las imágenes son generadas con inteligencia artificial**, ya aprobadas por
   el propietario.

## 6. Lista de verificación previa a la firma

La firma del apartado 7 solo procede cuando todo lo siguiente esté marcado.

- [ ] La rama pendiente (PR #24) fue revisada y fusionada a `main`
- [ ] La página pública sirve el código actual del repositorio (`/version.json` coincide)
- [ ] Las tres afirmaciones retiradas ya no aparecen en la página pública
- [ ] El sitio en español no muestra ningún texto en inglés, comprobado por el propietario
- [ ] El propietario decidió qué hacer con el formulario de contacto
- [ ] Las cuentas del apartado 3 están a nombre de quien corresponde
- [ ] El propietario leyó y aceptó las limitaciones del apartado 5

## 7. Conformidad

Este documento **no está firmado** y no certifica ninguna entrega.

```
Recibido por OTTO Plumbing Inc.   Nombre: ______________________

                                  Cargo:  ______________________

                                  Firma:  ______________________

                                  Fecha:  ______________________
```
