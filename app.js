// Small script for drawer toggle and ripple effect.
// Works for both index.html and about.html variants (buttons use different IDs).
(function(){
  function setupDrawer(menuId, drawerId, closeId, scrimId){
    var menu = document.getElementById(menuId);
    var drawer = document.getElementById(drawerId);
    var closeBtn = document.getElementById(closeId);
    var scrim = document.getElementById(scrimId);

    if(!menu || !drawer) return;

    function isDesktop(){
      return window.matchMedia && window.matchMedia('(min-width:900px)').matches;
    }

    function open(){
      // On desktop the drawer is persistent; don't change overlay/overflow
      drawer.setAttribute('aria-hidden','false');
      if(!isDesktop()){
        if(scrim){ scrim.hidden = false; }
        document.body.style.overflow = 'hidden';
      } else {
        // ensure scrim hidden on desktop
        if(scrim){ scrim.hidden = true; }
        document.body.style.overflow = '';
      }
    }
    function close(){
      // If desktop, keep it visible (persistent) — set aria-hidden to false to keep semantics consistent
      if(isDesktop()){
        drawer.setAttribute('aria-hidden','false');
        if(scrim){ scrim.hidden = true; }
        document.body.style.overflow = '';
        return;
      }
      drawer.setAttribute('aria-hidden','true');
      if(scrim){ scrim.hidden = true; }
      document.body.style.overflow = '';
    }

    menu.addEventListener('click', open);
    if(closeBtn) closeBtn.addEventListener('click', close);
    if(scrim) scrim.addEventListener('click', close);

    // keep drawer accessible to screen readers: if viewport changes, update scrim/overflow
    window.addEventListener('resize', function(){
      if(isDesktop()){
        drawer.setAttribute('aria-hidden','false');
        if(scrim) scrim.hidden = true;
        document.body.style.overflow = '';
      } else {
        // on small screens, ensure drawer starts closed (if DOM says so)
        if(drawer.getAttribute('aria-hidden') !== 'false'){
          if(scrim) scrim.hidden = true;
        }
      }
    });
  }

  // Setup for files that use id names exactly as in HTML above
  setupDrawer('menuButton', 'drawer', 'closeDrawer', 'scrim');
  setupDrawer('menuButtonAbout', 'drawerAbout', 'closeDrawerAbout', 'scrimAbout');

  // Ripple effect for buttons and icon buttons
  document.addEventListener('pointerdown', function(e){
    var el = e.target;
    while(el && el !== document.body){
      if(el.classList && (el.classList.contains('md-button') || el.classList.contains('md-iconbutton'))){
        var rect = el.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        var size = Math.max(rect.width, rect.height) * 1.2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        el.appendChild(ripple);
        setTimeout(function(){ ripple.remove(); }, 650);
        break;
      }
      el = el.parentElement;
    }
  }, {passive:true});

})();
