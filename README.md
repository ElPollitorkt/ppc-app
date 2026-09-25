# PPC — Planilla de Protocolización y Control Penal

**Creado por Bruno Cosilobo y Celeste Vicchi.**

Aplicación web estática para armar, revisar y exportar actas judiciales mediante cuerpos, resolutivos modulares y soporte para múltiples imputados.

> **Proyecto propietario de Bruno Cosilobo y Celeste Vicchi — uso e implementación únicamente con autorización escrita de ambos titulares.**

## Características

- Cuerpos principales y resolutivos combinables.
- Selección de una resolución común o asignación por imputado.
- Variantes y campos específicos para cada imputado.
- Vista previa del Acta con cierre obligatorio al final.
- Copia enriquecida, exportación a Word e impresión/PDF limpio.
- Casos guardados en el navegador mediante `localStorage`.
- Consola de audiencia con cronómetro y control de pendientes.
- Accesibilidad: contraste alto, tamaño de texto y foco visible.

## ¿Qué problema resuelve?

El flujo tradicional basado en un documento Word obliga a trabajar con un archivo extenso y difícil de controlar: las partes y los resolutivos suelen estar mezclados, hay que buscarlos manualmente, cortarlos y pegarlos en otro documento para armar el Acta, y cada modificación puede desordenar el contenido o trabar el archivo.

PPC transforma ese trabajo manual en un flujo guiado y modular:

1. Se cargan una sola vez los datos de la audiencia y de las personas imputadas.
2. Se eligen los cuerpos y resolutivos que corresponden al caso.
3. Se selecciona una resolución común o una resolución diferente para cada imputado.
4. La aplicación compone automáticamente la Planilla y el Acta en el orden previsto.
5. El cierre se reserva y se coloca siempre al final de cada cuerpo.
6. Se revisa la vista previa y se exporta únicamente el Acta limpia.

## Funciones y beneficios

| Función de PPC | Beneficio frente al Word tradicional |
| --- | --- |
| Cuerpos y resolutivos modulares | Evita buscar fragmentos dentro de un documento largo y reduce el riesgo de usar una parte equivocada. |
| Selección por imputado | Permite que cada persona tenga su propia resolución, variante, pena o dato específico sin duplicar documentos. |
| Modo “la misma para todos” | Resuelve rápidamente los casos en los que todos comparten la misma decisión. |
| Orden automático de resolutivos | Evita cortar, pegar y reordenar manualmente el Acta. |
| Cierre automático al final | Impide que el cierre quede en el medio o antes de otros resolutivos. |
| Campos dinámicos | Completa nombres, fechas, carátula y datos de audiencia sin repetirlos varias veces. |
| Vista Planilla + Acta | Permite controlar la carga mientras se ve el resultado documental en tiempo real. |
| Acta enriquecida | Conserva negritas, cursivas, subrayados, listas y saltos de línea al copiar o exportar. |
| Exportación limpia | Genera Word o PDF mostrando únicamente el texto del Acta, sin botones ni paneles de la aplicación. |
| Guardado local de casos | Permite retomar un trabajo sin reconstruirlo desde cero. |
| Consola de audiencia | Organiza las etapas de preparación, completado, resolución y cierre, con control de pendientes. |
| Validaciones visuales | Ayuda a detectar campos faltantes, resolutivos sin seleccionar y datos incompletos antes de exportar. |
| Interfaz accesible | Ofrece contraste alto, escala de texto, foco visible y paneles más fáciles de leer. |

## Correspondencia con el modelo PPC de Word

El archivo de referencia `pp11c.docx` confirma el problema que PPC busca resolver. Allí conviven, dentro de un mismo documento, la planilla de audiencia, los datos del expediente, hasta cinco imputados, las partes, la audiencia, la resolución judicial y distintos modelos de decisión.

PPC organiza esas secciones como módulos independientes:

- **Planilla de audiencia:** expediente, fecha, sala, juzgado, operador, OGAP, unidad penitenciaria, horarios y constancias.
- **Personas imputadas:** carga individual de nombre y datos filiatorios, con posibilidad de asignar una resolución diferente a cada persona.
- **Partes y participantes:** Fiscalía, UFI, defensa, víctima, querella, actor civil y otros intervinientes.
- **Hecho y calificación:** hecho atribuido, delito, artículo, leyes especiales y delitos vinculados.
- **Resoluciones:** condena, pena única, suspensión del juicio a prueba, sobreseimiento, absolución, prisión preventiva, prisión domiciliaria, nulidad, prórroga de IPP y auto genérico.
- **Debate y prueba:** resumen para debate o audiencia de finalización, prueba testimonial, prueba instrumental, antecedentes, expedientes AEV y cuarto intermedio.
- **Cómputo y comunicaciones:** fechas de aprehensión y cumplimiento, caducidad, comunicaciones digitales, testimonios, pase a precedente y notificación.
- **Cierre controlado:** registro, protocolización, comunicación digital y notificación quedan al final del cuerpo correspondiente.

La ventaja es que el modelo deja de ser un Word de casi mil líneas que exige activar campos, buscar referencias, duplicar textos y mover bloques. En PPC, los datos se cargan una vez y se reutilizan mediante campos dinámicos; los módulos se seleccionan, se ordenan y se reflejan automáticamente en la Planilla y el Acta.

### Modelos que PPC puede organizar

| Modelo del Word de referencia | Tratamiento en PPC |
| --- | --- |
| Planilla de Audiencia P.P.C. | Cuerpo principal de audiencia con datos generales y participantes |
| Resumen para debate o audiencia de finalización | Cuerpo de resumen con hecho, prueba y observaciones |
| Auto de suspensión de juicio a prueba | Resolutivo SJP con plazo, reglas y cierre |
| Auto de auto genérico | Resolutivo configurable con fundamentos y decisión |
| Auto por escrito / prórroga IPP | Resolutivo escrito con plazo, fundamentos y notificación |
| Condena, prisión preventiva, domiciliaria, nulidad y otras decisiones | Resolutivos seleccionables por persona y con campos específicos |

Esta correspondencia permite migrar progresivamente el modelo actual: primero se estructuran los datos y resolutivos más utilizados, luego se incorporan variantes institucionales sin volver a editar manualmente un documento gigante.

## Comparación rápida

| Tarea | Word tradicional | PPC |
| --- | --- | --- |
| Encontrar un resolutivo | Buscarlo manualmente entre muchas páginas | Seleccionarlo desde un catálogo organizado |
| Armar el Acta | Copiar y pegar entre documentos | Composición automática en una vista dedicada |
| Trabajar con varios imputados | Duplicar y editar bloques a mano | Elegir la resolución de cada persona por separado |
| Cambiar el orden | Mover párrafos y revisar numeración | Orden controlado por la aplicación |
| Mantener el cierre al final | Revisarlo manualmente cada vez | Regla automática por cuerpo |
| Corregir un dato repetido | Buscarlo y reemplazarlo en varios lugares | Modificar el campo central y regenerar el documento |
| Revisar antes de exportar | Navegar por un documento pesado | Ver Planilla y Acta en paralelo |
| Exportar | Guardar o imprimir el documento completo | Exportar solo el Acta limpia y enriquecida |

## Resultado práctico

PPC reduce la manipulación manual del documento, disminuye los errores de orden y de copia, evita mantener varias versiones del mismo Word y permite concentrarse en revisar el contenido de la audiencia en lugar de editar el formato. La herramienta no reemplaza la revisión profesional o institucional: automatiza la organización documental y deja la decisión jurídica bajo responsabilidad de quien utiliza el sistema.

## Vista del proyecto

Estas imágenes son adelantos visuales del producto. Tienen datos ficticios y no muestran la lógica interna ni expedientes reales:

![Vista general de PPC](./docs/visuals/ppc-overview.svg)

![Acta y resolutivos](./docs/visuals/ppc-acta.svg)

## Uso local

Este repositorio es privado. **No existe permiso general para ejecutar, instalar, implementar, copiar, modificar, redistribuir o integrar este proyecto.** Cualquier uso requiere autorización previa, expresa y escrita de Bruno Cosilobo y Celeste Vicchi.

## Autoría

El diseño visual, la arquitectura de interfaz, la implementación del software, el código y las funcionalidades originales de este repositorio son autoría conjunta de **Bruno Cosilobo y Celeste Vicchi**.

## Alcance jurídico

La autoría del software y del diseño no implica autoría sobre normas, fórmulas, modelos, textos jurídicos, citas legales o contenidos institucionales de terceros que puedan estar incorporados como referencia. La herramienta es de asistencia documental y no reemplaza la revisión profesional, judicial o institucional del Acta.

## Licencia

Este proyecto se encuentra bajo la [Licencia Propietaria PPC](./LICENSE). Todos los derechos no concedidos expresamente quedan reservados.
