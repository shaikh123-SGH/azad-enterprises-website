/* Azad Enterprises - main.js */
(function(){
  // Mobile menu toggle
  var ham = document.querySelector('.hamburger');
  var menu = document.querySelector('.menu');
  if(ham && menu){
    ham.addEventListener('click', function(){ menu.classList.toggle('open'); });
  }

  // Active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });

  // Year in footer
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // Product filter (products.html)
  var chips = document.querySelectorAll('.chip');
  var products = document.querySelectorAll('.product');
  var searchInput = document.getElementById('search');
  var activeCat = 'all';

  function applyFilter(){
    var q = (searchInput && searchInput.value || '').toLowerCase().trim();
    products.forEach(function(p){
      var cat = p.dataset.category || '';
      var name = (p.dataset.name || p.textContent).toLowerCase();
      var matchCat = activeCat === 'all' || cat === activeCat;
      var matchQ = !q || name.indexOf(q) !== -1;
      p.style.display = (matchCat && matchQ) ? '' : 'none';
    });
  }
  chips.forEach(function(c){
    c.addEventListener('click', function(){
      chips.forEach(function(x){ x.classList.remove('active'); });
      c.classList.add('active');
      activeCat = c.dataset.filter || 'all';
      applyFilter();
    });
  });
  if(searchInput) searchInput.addEventListener('input', applyFilter);

  // Form helper
  function postForm(form, endpoint, alertEl){
    var data = {};
    new FormData(form).forEach(function(v,k){ data[k] = v; });
    var btn = form.querySelector('button[type="submit"]');
    var orig = btn ? btn.textContent : '';
    if(btn){ btn.disabled = true; btn.textContent = 'Sending...'; }
    alertEl.className = 'alert';
    alertEl.textContent = '';

    fetch(endpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    }).then(function(r){ return r.json().then(function(j){ return {ok:r.ok, body:j}; }); })
      .then(function(res){
        if(res.ok && res.body.success){
          alertEl.className = 'alert success';
          alertEl.textContent = res.body.message || 'Thank you! We will contact you shortly.';
          form.reset();
        } else {
          alertEl.className = 'alert error';
          alertEl.textContent = (res.body && res.body.message) || 'Something went wrong. Please try again.';
        }
      })
      .catch(function(){
        alertEl.className = 'alert error';
        alertEl.textContent = 'Network error. Please check your connection and try again.';
      })
      .finally(function(){
        if(btn){ btn.disabled = false; btn.textContent = orig; }
      });
  }

  var contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      postForm(contactForm, '/api/contact', document.getElementById('contact-alert'));
    });
  }
  var quoteForm = document.getElementById('quote-form');
  if(quoteForm){
    quoteForm.addEventListener('submit', function(e){
      e.preventDefault();
      postForm(quoteForm, '/api/quote', document.getElementById('quote-alert'));
    });
  }
})();
