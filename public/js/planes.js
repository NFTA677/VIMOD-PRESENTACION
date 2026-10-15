const contenedorPlanes = document.getElementById('planes');
const modal = document.getElementById('modal');
const formSolicitud = document.getElementById('formSolicitud');
const estadoSolicitud = document.getElementById('estadoSolicitud');

function tarjetaPlan(p) {
  const art = document.createElement('article');
  art.className = 'plan revelar' + (p.destacado ? ' plan--destacado' : '');

  const precio = p.precio != null
    ? `<div class="plan__precio">$${p.precio}<small> / ${p.periodo}</small></div>`
    : `<div class="plan__precio plan__precio--texto">A medida</div>`;

  art.innerHTML = `
    ${p.destacado ? '<span class="plan__badge">Más elegido</span>' : ''}
    <h2 class="plan__nombre"></h2>
    ${precio}
    <p class="plan__desc"></p>
    <ul class="lista-check"></ul>
    <button class="btn" type="button">${p.precio != null ? 'Elegir plan' : 'Contactar'} <span class="flecha">→</span></button>`;

  art.querySelector('.plan__nombre').textContent = p.nombre;
  art.querySelector('.plan__desc').textContent = p.descripcion;
  const ul = art.querySelector('.lista-check');
  p.caracteristicas.forEach((c) => {
    const li = document.createElement('li');
    li.textContent = c;
    ul.appendChild(li);
  });
  art.querySelector('button').addEventListener('click', () => abrirModal(p));
  return art;
}

async function cargarPlanes() {
  try {
    const res = await fetch('/api/planes');
    const planes = await res.json();
    planes.forEach((p) => {
      const tarjeta = tarjetaPlan(p);
      contenedorPlanes.appendChild(tarjeta);
      observador.observe(tarjeta); // definido en main.js
    });
  } catch {
    contenedorPlanes.innerHTML = '<p class="texto">No se pudieron cargar los planes.</p>';
  }
}

function abrirModal(plan) {
  formSolicitud.plan.value = plan.id;
  document.querySelector('#modalTitulo strong').textContent = plan.nombre;
  estadoSolicitud.textContent = '';
  modal.classList.add('abierto');
  formSolicitud.nombre.focus();
}
function cerrarModal() { modal.classList.remove('abierto'); }

document.getElementById('modalCerrar').addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

formSolicitud.addEventListener('submit', async (e) => {
  e.preventDefault();
  const plan = formSolicitud.plan.value;
  const ok = await enviarFormulario(formSolicitud, '/api/solicitudes', estadoSolicitud);
  if (ok) formSolicitud.plan.value = plan;
});

cargarPlanes();
