const content = document.querySelector('#content');
content.inert = true;
const loader = new UrbanStayPreloader({
  mount:document.querySelector('#preloader'),
  // Demo: ?v=lua | persiana | horizonte
  variant:new URLSearchParams(location.search).get('v') || 'lua'
});
window.demoLoader = loader;
loader.play();
// Demo content is already ready. Production calls finish when its content is ready.
loader.finish().then(() => { content.inert = false; });
