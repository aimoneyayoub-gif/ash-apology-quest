(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- next-screen buttons ---- */
  document.querySelectorAll('[data-next]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.getAttribute('data-next'));
      if(target) target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    });
  });

  /* ---- progress rail (decorative, tracks scroll position through the quest) ---- */
  var fill = document.getElementById('progressFill');
  var scroller = document.documentElement;
  function updateProgress(){
    var max = scroller.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  /* ---- loot card flip ---- */
  document.querySelectorAll('[data-flip]').forEach(function(card){
    card.addEventListener('click', function(){
      card.classList.toggle('flipped');
    });
  });

  /* ---- scrap heart assembles when final screen enters view ---- */
  var finalScreen = document.getElementById('s6');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, {threshold:0.4});
    io.observe(finalScreen);
  } else {
    finalScreen.classList.add('in-view');
  }

  /* ---- chocolate investigation ---- */
  var chocResult = document.getElementById('chocResult');
  var CHOC_RESPONSES = [
    'Excellent choice.',
    'Noted. I definitely knew that already.',
    'Investigation updated. This changes everything.',
    'Logged for future snack-acquisition purposes.'
  ];
  document.querySelectorAll('.choc-card').forEach(function(card){
    card.addEventListener('click', function(){
      document.querySelectorAll('.choc-card').forEach(function(c){ c.classList.remove('chosen'); });
      card.classList.add('chosen');
      var pick = card.getAttribute('data-choc');
      var response = CHOC_RESPONSES[Math.floor(Math.random()*CHOC_RESPONSES.length)];
      chocResult.textContent = response + ' (' + pick + ', for the record.)';
    });
  });

  /* ---- quest choice ---- */
  var acceptBtn = document.getElementById('acceptBtn');
  var waitBtn = document.getElementById('waitBtn');
  var notReadyMsg = document.getElementById('notReadyMsg');

  acceptBtn.addEventListener('click', function(){
    notReadyMsg.hidden = true;
    launchCandyRain();
  });

  waitBtn.addEventListener('click', function(){
    notReadyMsg.hidden = false;
    notReadyMsg.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'nearest'});
  });

  /* ---- candy rain celebration ---- */
  var candyLayer = document.getElementById('candyRain');
  var CANDY_ASSETS = ['assets/kitkat.png','assets/twix.png','assets/kinder.png'];
  var CANDY_EMOJI = ['🍫','🍬','🍪'];

  function launchCandyRain(){
    if(reduceMotion){
      // simple, calm, non-animated acknowledgment instead of a big motion effect
      var note = document.createElement('div');
      note.textContent = 'Congratulations. You have acquired emergency snacks. 🍫🍟🐈';
      note.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#4A2E52;color:#FBF0E6;padding:14px 22px;border-radius:999px;font-family:Quicksand,sans-serif;font-weight:700;z-index:200;';
      document.body.appendChild(note);
      setTimeout(function(){ note.remove(); }, 4000);
      return;
    }

    var count = 46;
    for(var i=0; i<count; i++){
      (function(i){
        setTimeout(function(){
          var useImg = Math.random() > 0.35;
          var el;
          if(useImg){
            el = document.createElement('img');
            el.className = 'candy-piece';
            el.src = CANDY_ASSETS[Math.floor(Math.random()*CANDY_ASSETS.length)];
            el.onerror = function(){ el.remove(); };
          } else {
            el = document.createElement('span');
            el.className = 'candy-emoji';
            el.textContent = CANDY_EMOJI[Math.floor(Math.random()*CANDY_EMOJI.length)];
          }
          var size = 28 + Math.random()*26;
          var duration = 2.6 + Math.random()*2.2;
          var rot = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random()*360);
          el.style.left = (Math.random()*100) + 'vw';
          el.style.width = useImg ? size + 'px' : '';
          el.style.height = useImg ? size + 'px' : '';
          el.style.fontSize = useImg ? '' : size + 'px';
          el.style.setProperty('--rot', rot + 'deg');
          el.style.animationDuration = duration + 's';
          candyLayer.appendChild(el);
          setTimeout(function(){ el.remove(); }, duration*1000 + 200);
        }, i * 70);
      })(i);
    }
  }

  /* ---- optional feedback ---- */
  var feedbackThanks = document.getElementById('feedbackThanks');
  document.querySelectorAll('.feedback-options button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.feedback-options button').forEach(function(b){ b.style.opacity = '0.5'; });
      btn.style.opacity = '1';
      btn.style.background = '#C7B4E8';

      var choice = btn.getAttribute('data-choice');
      var messages = {
        'Cute': 'u da real cute 🩷💙',
        'I accept the snacks': 'the snacks are yours, no conditions attached',
        'You tried': 'yes. that was kind of the whole point',
        'I still need time': 'that\'s completely fair, and nothing here expected otherwise'
      };
      feedbackThanks.textContent = messages[choice] || 'thanks for letting me know';
      feedbackThanks.hidden = false;

      // Optional, privacy-friendly local record of the choice only — nothing personal,
      // nothing sent anywhere. Safe to delete this block if you'd rather it do nothing.
      try{
        var record = { choice: choice, timestamp: new Date().toISOString() };
        localStorage.setItem('ash_quest_feedback', JSON.stringify(record));
      }catch(e){ /* storage unavailable, ignore silently */ }
    });
  });

})();
