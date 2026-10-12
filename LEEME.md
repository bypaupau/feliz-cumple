# Feliz cumpleaños, Daniel

Página web de cumpleaños. HTML, CSS y JS puros: no hay que instalar nada,
se abre con doble clic en `index.html`.

## Qué necesita

Nada: las fotos están en `img/` y el video se carga desde YouTube.
Si alguna vez falta un archivo, en su sitio aparece un hueco marcado con
el nombre que debería tener, sin romper la página.

## Cómo está montada

Al cargar, una **cortina de franjas de crema y bizcocho** baja a pantalla
completa y descubre la escena (≈1.5 s). Encadena con la tarjeta, que aparece
mientras las últimas franjas todavía están bajando.

Debajo, de arriba abajo:

| | |
|---|---|
| **Tarjeta** | Polaroid a la izquierda, mensaje a la derecha |
| **Pastel** | cinco capas; las primeras asoman ya en la pantalla inicial |
| **Última capa** | contiene el video directamente, sin botón de por medio |
| **Plato** | centrado bajo el pastel |

Al bajar, las capas se van descubriendo con el mismo gesto que la cortina:
descienden hasta su sitio.

La cortina de entrada es una transición de pantalla; **el pastel de la página
es uno solo**, no hay capas duplicadas.

## El video

Se carga desde YouTube. La configuración está en las primeras líneas
de `js/main.js`:

```js
const CONFIG_VIDEO = {
  tipo: 'youtube',             // 'local' | 'youtube' | 'vimeo'
  idYoutube: 'tjynvY2GlBQ',    // lo que va después de ?v=
  portada: ''
};
```

Para usar un archivo local en su lugar, pon `tipo: 'local'` y guarda el MP4
como `video/cumple-daniel.mp4`.

El reproductor enseña su propia vista previa y se reproduce con un clic en los
controles. `portada` es opcional: si pones ahí una imagen 16:9 tuya, se usa
como primer fotograma.

El marco respeta la proporción real del archivo (`object-fit: contain`), así
que no se deforma aunque tu video no sea exactamente 16:9.

## La foto

```js
const CONFIG_FOTO = {
  archivo: 'img/daniel.JPG',   // ojo: GitHub Pages distingue mayúsculas
  alt: 'Daniel',
  secundaria: 'img/daniel_2.jpg'
};
```

El recorte es 4:3 y se ajusta con `object-fit: cover`, así que cualquier foto
entra sin deformarse. La segunda es decorativa: si la dejas vacía (`''`), su
marco desaparece solo.

## Cambiar textos

Todo está en `index.html`:

| Qué | Dónde |
|---|---|
| «¡Feliz cumpleaños,» | `.mensaje__saludo` |
| «Daniel!» | `.mensaje__nombre` |
| «esta sorpresa es para ti ♡» | `.mensaje__nota` |
| «hecho con mucho, mucho amor» | `.pie-pastel` |
| «— feliz cumple, Daniel —» | `.pie` |

## Ajustes del pastel

Colores: cada capa lleva los suyos en el propio HTML. `--c` es el bizcocho y
`--g` la crema.

```html
<div class="capa capa--c" style="--c:#D3E7F2; --g:#EDF6FB"></div>
```

Anchos y asomo: arriba del todo en `css/estilos.css`, en `:root`.

```css
--asoma: 154px;   /* cuánto pastel se ve en la pantalla inicial */
--w-a: 84%;       /* ancho de la capa de arriba */
--w-b: 89%;
--w-c: 93%;
--w-d: 97%;       /* la base siempre es 100% */
```

Las alturas y el desfase de la onda (`--onda-x`, para que la crema de cada
capa no quede alineada con la de al lado) están en `.capa--a` … `.capa--base`.

## Ajustar la transición de entrada

`css/estilos.css`, sección **2**:

- `bajar-franja 880ms` → velocidad de cada franja.
- Los `animation-delay` de `.franja--6` a `.franja--1` → el escalonado.
  Arrancan a 160 ms para que la primera pantalla se lea limpia; la última
  termina a 1,5 s.

En `js/main.js`, el `setTimeout(..., 820)` es el momento en que entra la
tarjeta y empiezan a descubrirse las capas. Súbelo o bájalo para encadenar
antes o después.

Se ejecuta una sola vez al cargar. Con "reducir movimiento" activado en el
sistema, se salta y todo aparece directamente.

## Archivos

```
index.html              estructura y textos
css/estilos.css         todo el diseño
js/main.js              configuración, transición y scroll
img/onda.svg            el canto ondulado de la crema (máscara)
img/grano-corcho.svg    textura del corcho
img/grano-papel.svg     fibra del papel
img/daniel.JPG          foto principal
img/daniel_2.jpg        foto secundaria
img/favicon.svg         icono de la página (+ .png y favicon.ico)
```

## Publicarla

Sirve cualquier hosting estático. Para GitHub Pages: Settings → Pages →
Source: `main` / carpeta raíz. Todas las rutas son relativas, así que funciona
igual publicada en un subdirectorio.
