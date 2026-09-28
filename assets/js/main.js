(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hero search tabs
  var tabs = document.querySelectorAll('.search-tabs button');
  var input = document.getElementById('q');
  var typeField = document.getElementById('type');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      if (input) input.placeholder = btn.getAttribute('data-placeholder');
      if (typeField) typeField.value = btn.getAttribute('data-type');
    });
  });

  // Search results page
  var results = document.getElementById('results');
  if (results && window.FMT_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim().toLowerCase();
    var ind = (params.get('industry') || '').toLowerCase();
    var country = (params.get('country') || '').toLowerCase();
    var field = document.getElementById('q2');
    if (field) field.value = params.get('q') || '';
    var terms = q.split(/\s+/).filter(Boolean);
    var hits = window.FMT_INDEX.map(function (p) {
      var hay = (p.t + ' ' + p.d + ' ' + p.k).toLowerCase();
      var score = 0;
      terms.forEach(function (t) { if (hay.indexOf(t) > -1) score += (p.t.toLowerCase().indexOf(t) > -1 ? 3 : 1); });
      if (ind && hay.indexOf(ind) > -1) score += 2;
      if (country && hay.indexOf(country) > -1) score += 2;
      if (!terms.length && !ind && !country) score = 1;
      return { p: p, s: score };
    }).filter(function (h) { return h.s > 0; }).sort(function (a, b) { return b.s - a.s; });
    var summary = document.getElementById('summary');
    if (summary) summary.textContent = hits.length + (hits.length === 1 ? ' result' : ' results') + (q ? ' for "' + params.get('q') + '"' : '');
    if (!hits.length) {
      results.innerHTML = '<p>No pages match that search yet. Try an industry such as "pharma" or a country such as "Germany", or <a href="/contact.html">tell us what you are looking for</a>.</p>';
    } else {
      results.innerHTML = hits.map(function (h) {
        return '<a href="' + h.p.u + '"><strong>' + h.p.t + '</strong><span>' + h.p.d + '</span></a>';
      }).join('');
    }
  }

  // Document upload filename display
  var file = document.getElementById('docs-upload');
  var fileOut = document.getElementById('docs-list');
  if (file && fileOut) {
    file.addEventListener('change', function () {
      var names = Array.prototype.map.call(file.files, function (f) { return f.name; });
      fileOut.textContent = names.length ? 'Selected: ' + names.join(', ') : '';
    });
  }
})();
