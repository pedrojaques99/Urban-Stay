// Tema antes da primeira pintura (inline no <head> de cada pagina, pelo
// vite.config.ts). Escolha manual salva vence; sem ela: sistema escuro, ou
// noite pelo relogio (18h–6h). Sem isto a pagina piscaria clara.
;(function () {
  var t
  try { t = localStorage.getItem('us-theme') } catch (e) {}
  if (t !== 'dark' && t !== 'light') {
    var h = new Date().getHours()
    t = matchMedia('(prefers-color-scheme: dark)').matches || h < 6 || h >= 18 ? 'dark' : 'light'
  }
  document.documentElement.dataset.theme = t
})()
