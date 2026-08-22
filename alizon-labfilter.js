/* alizon-labfilter.js — live search and module filter for the public
   practicals catalogue, and search for the textbook catalogue beneath it.

   Purely presentational: it shows and hides cards that are already on the
   page. It reads no data, writes no data, and touches no storage of any
   kind. */
(function () {
  'use strict';
  if (window.__alizonLabFilter) return; window.__alizonLabFilter = 1;

  function norm(s) { return (s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

  /* ---------------------------------------------------- practicals catalogue */
  function bootLabs() {
    var grid = document.querySelector('#labGrid') ||
               (function () {
                 var c = document.querySelector('a.card[href^="ALIZON-OS-"]');
                 return c ? c.parentElement : null;
               })();
    if (!grid) return;

    var cards = [].slice.call(grid.querySelectorAll('a.card'));
    if (cards.length < 4) return;

    /* index each card once */
    cards.forEach(function (c) {
      var badge = (c.querySelector('.badge') || {}).textContent || '';
      var h = (c.querySelector('h3') || {}).textContent || '';
      var p = (c.querySelector('p') || {}).textContent || '';
      c.__hay = norm(badge + ' ' + h + ' ' + p);
      c.__group = norm(badge.split('·')[0]);
    });

    /* module groups, in the order they appear */
    var groups = [], seen = {};
    cards.forEach(function (c) {
      if (!c.__group || seen[c.__group]) return;
      seen[c.__group] = 1;
      groups.push({ key: c.__group, label: (c.querySelector('.badge').textContent.split('·')[0] || '').trim() });
    });

    var bar = document.createElement('div');
    bar.className = 'lfbar';
    bar.innerHTML =
      '<div class="lfsearch">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
        '<input type="search" id="lfQ" placeholder="Search practicals — try &ldquo;dispensing&rdquo;, &ldquo;antimicrobial&rdquo;, &ldquo;audit&rdquo;" ' +
          'autocomplete="off" aria-label="Search practicals">' +
        '<button type="button" id="lfClear" aria-label="Clear search" hidden>&times;</button>' +
      '</div>' +
      '<div class="lfchips" id="lfChips">' +
        '<button type="button" class="on" data-g="">All <i>' + cards.length + '</i></button>' +
        groups.map(function (g) {
          var n = cards.filter(function (c) { return c.__group === g.key; }).length;
          return '<button type="button" data-g="' + g.key + '">' + g.label + ' <i>' + n + '</i></button>';
        }).join('') +
      '</div>' +
      '<p class="lfcount" id="lfCount" role="status" aria-live="polite"></p>';
    grid.parentNode.insertBefore(bar, grid);

    var q = document.getElementById('lfQ');
    var clear = document.getElementById('lfClear');
    var count = document.getElementById('lfCount');
    var chips = document.getElementById('lfChips');
    var group = '';

    function run() {
      var needle = norm(q.value);
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!group || c.__group === group) && (!needle || c.__hay.indexOf(needle) >= 0);
        c.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      clear.hidden = !q.value;
      count.textContent = shown === cards.length
        ? cards.length + ' practicals'
        : shown + ' of ' + cards.length + ' practicals' + (needle ? ' matching “' + q.value.trim() + '”' : '');
      var empty = document.getElementById('lfEmpty');
      if (!shown) {
        if (!empty) {
          empty = document.createElement('p');
          empty.id = 'lfEmpty'; empty.className = 'lfempty';
          empty.textContent = 'No practical matches that. Try a shorter word, or choose All.';
          grid.parentNode.insertBefore(empty, grid.nextSibling);
        }
        empty.style.display = '';
      } else if (empty) { empty.style.display = 'none'; }
    }

    q.addEventListener('input', run);
    clear.addEventListener('click', function () { q.value = ''; q.focus(); run(); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; run(); } });
    [].forEach.call(chips.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        group = b.getAttribute('data-g');
        [].forEach.call(chips.querySelectorAll('button'), function (x) { x.classList.toggle('on', x === b); });
        run();
      });
    });
    run();
  }

  /* ---------------------------------------------------- textbook catalogue */
  function bootBooks() {
    var grid = document.getElementById('bkGrid');
    var filt = document.getElementById('bkFilter');
    if (!grid || !filt) return;

    var wrap = document.createElement('div');
    wrap.className = 'lfsearch bksearch';
    wrap.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
      '<input type="search" id="bkQ" placeholder="Search textbooks and their contents — try &ldquo;pharmacovigilance&rdquo;" ' +
        'autocomplete="off" aria-label="Search textbooks">' +
      '<button type="button" id="bkClear" aria-label="Clear search" hidden>&times;</button>';
    filt.parentNode.insertBefore(wrap, filt);

    var q = document.getElementById('bkQ');
    var clear = document.getElementById('bkClear');

    function run() {
      var needle = norm(q.value);
      clear.hidden = !q.value;
      var cards = grid.querySelectorAll('.bk');
      var shown = 0;
      [].forEach.call(cards, function (c) {
        /* the contents panel is in the DOM already, so unit and topic names
           are searchable even while collapsed */
        var hay = norm(c.textContent);
        var ok = !needle || hay.indexOf(needle) >= 0;
        c.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      var note = document.getElementById('bkNote');
      if (!note) {
        note = document.createElement('p');
        note.id = 'bkNote'; note.className = 'lfcount';
        grid.parentNode.insertBefore(note, grid);
      }
      note.textContent = needle
        ? shown + ' of ' + cards.length + ' textbooks mention “' + q.value.trim() + '”'
        : '';
    }
    q.addEventListener('input', run);
    clear.addEventListener('click', function () { q.value = ''; q.focus(); run(); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; run(); } });

    /* the book cards are rendered asynchronously — re-run when they land */
    var tries = 0;
    var iv = setInterval(function () {
      if (grid.querySelectorAll('.bk').length || ++tries > 40) { clearInterval(iv); run(); }
    }, 250);
  }

  function boot() { try { bootLabs(); } catch (e) {} try { bootBooks(); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
