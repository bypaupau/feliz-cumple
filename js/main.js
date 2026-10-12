/* ═══════════════════════════════════════════════════════════
   Feliz cumpleaños, Daniel

   1. Configuración (video y foto)   ← lo único que hay que tocar
   2. El video, dentro de la última capa del pastel
   3. La foto de la tarjeta
   4. Transición de entrada a pantalla completa
   5. Las capas se descubren al hacer scroll
   ═══════════════════════════════════════════════════════════ */

/* ── 1. CONFIGURACIÓN ───────────────────────────────────────
   VIDEO
     tipo: 'local'   → el archivo que pongas en la carpeta /video
           'youtube' → usa idYoutube
           'vimeo'   → usa idVimeo
     portada: opcional, una imagen 16:9 tuya como primer fotograma.
   FOTO
     archivo: la foto de Daniel que va en la Polaroid.
              Mientras no exista, se ve el hueco marcado.
   ─────────────────────────────────────────────────────────── */
const CONFIG_VIDEO = {
  tipo: 'youtube',
  archivo: 'video/cumple-daniel.mp4',
  portada: '',             // ej: 'img/portada.jpg'
  idYoutube: 'tjynvY2GlBQ',
  idVimeo: ''              // ej: '76979871'
};

const CONFIG_FOTO = {
  // ojo con mayúsculas y minúsculas: en macOS da igual, pero GitHub
  // Pages sí distingue, y el archivo real se llama daniel.JPG
  archivo: 'img/daniel.JPG',
  alt: 'Daniel',

  // segunda foto, decorativa. Déjala vacía ('') si no la quieres.
  secundaria: 'img/daniel_2.jpg',
  altSecundaria: ''        // decorativa: sin texto alternativo a propósito
};

const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ═══════════════════════════════════════════════════════════
   2. VIDEO — va directo en la capa de abajo, sin portada ni
   botón. Muestra su propia vista previa.
   ═══════════════════════════════════════════════════════════ */
const pantalla = document.getElementById('pantalla');

function montarVideo() {
  if (!pantalla) return;

  if (CONFIG_VIDEO.tipo === 'youtube' && CONFIG_VIDEO.idYoutube) {
    return insertarIframe('https://www.youtube-nocookie.com/embed/' +
      CONFIG_VIDEO.idYoutube + '?rel=0&modestbranding=1&playsinline=1');
  }
  if (CONFIG_VIDEO.tipo === 'vimeo' && CONFIG_VIDEO.idVimeo) {
    return insertarIframe('https://player.vimeo.com/video/' +
      CONFIG_VIDEO.idVimeo + '?title=0&byline=0&portrait=0');
  }

  const video = document.createElement('video');
  video.src = CONFIG_VIDEO.archivo;
  video.controls = true;       // se reproduce con un clic explícito
  video.playsInline = true;
  video.preload = 'metadata';
  if (CONFIG_VIDEO.portada) video.poster = CONFIG_VIDEO.portada;
  video.setAttribute('controlsList', 'nodownload');

  // si el archivo no está, queda el hueco marcado en su lugar
  video.addEventListener('error', huecoVideo);
  // algunos navegadores no pintan el primer fotograma solos
  video.addEventListener('loadedmetadata', () => {
    if (video.currentTime === 0) { try { video.currentTime = 0.05; } catch (e) {} }
  });

  pantalla.appendChild(video);
}

function insertarIframe(src) {
  const marco = document.createElement('iframe');
  marco.src = src;
  marco.title = 'Video de cumpleaños de Daniel';
  marco.allow = 'fullscreen; picture-in-picture';
  marco.allowFullscreen = true;
  pantalla.appendChild(marco);
}

function huecoVideo() {
  if (pantalla.querySelector('.hueco-video')) return;
  const v = pantalla.querySelector('video');
  if (v) v.remove();
  const hueco = document.createElement('div');
  hueco.className = 'hueco-video';
  hueco.innerHTML =
    '<p><strong>Aquí va tu video</strong></p>' +
    '<p>Guarda tu exportación como <code>' + CONFIG_VIDEO.archivo + '</code><br>' +
    'y aparecerá en este mismo sitio, sin tocar nada más.</p>';
  pantalla.appendChild(hueco);
}

/* ═══════════════════════════════════════════════════════════
   3. FOTO de la tarjeta
   ═══════════════════════════════════════════════════════════ */
const cajaFoto = document.getElementById('foto');
const cajaFoto2 = document.getElementById('foto2');

function montarFoto() {
  colocar(cajaFoto, CONFIG_FOTO.archivo, CONFIG_FOTO.alt, true);
  colocar(cajaFoto2, CONFIG_FOTO.secundaria, CONFIG_FOTO.altSecundaria, false);
}

/* Pone una foto en su marco. Si el archivo no está:
   - la principal deja el hueco marcado con el nombre que falta
   - la secundaria, que es decorativa, se retira sin dejar rastro  */
function colocar(caja, archivo, alt, esPrincipal) {
  if (!caja) return;

  if (!archivo) { if (!esPrincipal) ocultarMarco(caja); return; }

  const img = document.createElement('img');
  img.src = archivo;
  img.alt = alt || '';
  if (!esPrincipal) { img.loading = 'lazy'; img.decoding = 'async'; }
  img.addEventListener('error', () => {
    img.remove();
    if (esPrincipal) huecoFoto(); else ocultarMarco(caja);
  });
  caja.appendChild(img);
}

function ocultarMarco(caja) {
  const marco = caja.closest('.polaroid');
  if (marco) marco.hidden = true;
}

function huecoFoto() {
  if (cajaFoto.querySelector('.polaroid__hueco')) return;
  const hueco = document.createElement('div');
  hueco.className = 'polaroid__hueco';
  hueco.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#8A7258" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z"/>' +
    '<circle cx="12" cy="13" r="3.6"/></svg>' +
    '<span>pon aquí la foto de Daniel<code>' + CONFIG_FOTO.archivo + '</code></span>';
  cajaFoto.appendChild(hueco);
}

/* ═══════════════════════════════════════════════════════════
   4. TRANSICIÓN DE ENTRADA (pantalla completa)
   Al terminar, encadena con la tarjeta y arranca el descubrir
   de las capas, para que sea una sola secuencia.
   ═══════════════════════════════════════════════════════════ */
const entrada = document.getElementById('entrada');
let hecha = false;

function abrirEscena() {
  document.body.classList.add('listo');
  descubrirCapas();
  hecha = true;
}

function correrEntrada() {
  if (hecha) return;

  if (menosMovimiento.matches || !entrada) {
    if (entrada) entrada.classList.add('fuera');
    abrirEscena();
    return;
  }

  hecha = true;
  document.body.classList.add('animar');

  // la tarjeta aparece mientras las últimas franjas aún bajan
  setTimeout(() => { document.body.classList.add('listo'); descubrirCapas(); }, 820);

  const ultima = entrada.querySelector('.franja--1');
  const cerrar = () => entrada.classList.add('fuera');
  if (ultima) ultima.addEventListener('animationend', cerrar, { once: true });
  setTimeout(cerrar, 1900);     // red de seguridad
}

window.addEventListener('pageshow', (e) => {
  if (e.persisted) { if (entrada) entrada.classList.add('fuera'); abrirEscena(); }
});

/* ═══════════════════════════════════════════════════════════
   5. LAS CAPAS SE DESCUBREN AL HACER SCROLL
   Se comprueba la posición real en pantalla (no un observador):
   así un salto de scroll o recargar a media página nunca deja
   una capa escondida.
   ═══════════════════════════════════════════════════════════ */
let pendientes = [];
let encolado = false;
let escuchando = false;

function descubrirCapas() {
  pendientes = Array.from(document.querySelectorAll('.vela, .capa, .plato'));
  if (!pendientes.length) return;

  if (menosMovimiento.matches) {
    pendientes.forEach(p => p.classList.add('vista'));
    return;
  }

  if (!escuchando) {
    escuchando = true;
    window.addEventListener('scroll', pedirRevision, { passive: true });
    window.addEventListener('resize', pedirRevision);
  }
  revisar();
}

function revisar() {
  encolado = false;
  const limite = window.innerHeight * 0.94;
  const quedan = [];
  pendientes.forEach(p => {
    if (p.getBoundingClientRect().top > limite) { quedan.push(p); return; }
    p.classList.add('vista');
  });
  pendientes = quedan;

  if (!pendientes.length && escuchando) {
    escuchando = false;
    window.removeEventListener('scroll', pedirRevision);
    window.removeEventListener('resize', pedirRevision);
  }
}
function pedirRevision() {
  if (encolado) return;
  encolado = true;
  requestAnimationFrame(revisar);
}

/* ═══════════════════════════════════════════════════════════
   ARRANQUE
   ═══════════════════════════════════════════════════════════ */
function arrancar() {
  montarFoto();
  montarVideo();
  requestAnimationFrame(() => requestAnimationFrame(correrEntrada));
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', arrancar);
} else {
  arrancar();
}
