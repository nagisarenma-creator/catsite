(function () {
  'use strict';
  var box = document.getElementById('quiz');
  if (!box) return;

  var Q = [
    { q: "Ідеальний вечір для вас?", a: [
      ["Тиша, плед і чай", "Перська"],
      ["Активні ігри та рух", "Бенгальська"],
      ["Гучна компанія друзів", "Сіамська"],
      ["Тепло й обійми", "Сфінкс"] ] },
    { q: "Який у вас характер?", a: [
      ["Спокійний і незворушний", "Британська"],
      ["Добродушний велетень", "Мейн-кун"],
      ["Грайливий дослідник", "Бенгальська"],
      ["Балакучий і товариський", "Сіамська"] ] },
    { q: "Улюблений відпочинок?", a: [
      ["Вдома в затишку", "Британська"],
      ["Подорожі природою", "Мейн-кун"],
      ["Догляд і спа", "Перська"],
      ["Сонячна ванна", "Сфінкс"] ] }
  ];
  var INFO = {
    "Мейн-кун": "Добродушний велетень, який любить родину й природу.",
    "Сіамська": "Балакуча й товариська красуня з блакитними очима.",
    "Бенгальська": "Енергійний мисливець із візерунком дикого леопарда.",
    "Перська": "Спокійна аристократка, яка цінує тишу й комфорт.",
    "Сфінкс": "Ніжний і теплий друг, який обожнює обійми.",
    "Британська": "Незворушний джентльмен із плюшевою шерстю."
  };
  var step = 0, score = {};

  function ask() {
    var item = Q[step];
    box.innerHTML = "";
    var info = document.createElement("p");
    info.className = "step-info";
    info.textContent = "Питання " + (step + 1) + " з " + Q.length;
    var h = document.createElement("h3");
    h.textContent = item.q;
    var opts = document.createElement("div");
    opts.className = "opts";
    item.a.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = o[0];
      b.addEventListener("click", function () {
        score[o[1]] = (score[o[1]] || 0) + 1;
        step++;
        if (step < Q.length) ask(); else done();
      });
      opts.appendChild(b);
    });
    box.appendChild(info);
    box.appendChild(h);
    box.appendChild(opts);
  }

  function done() {
    var best = null, max = 0;
    Object.keys(score).forEach(function (k) {
      if (score[k] > max) { max = score[k]; best = k; }
    });
    box.innerHTML = "";
    var r = document.createElement("div");
    r.className = "res";
    r.innerHTML = "<p>На виставці ви були б схожі на</p><div class=\"big\"></div><p></p>" +
      "<a class=\"btn\" href=\"breeds.html\">Побачити учасників</a> " +
      "<button class=\"btn blue\" type=\"button\" id=\"again\">Пройти ще раз</button>";
    r.querySelector(".big").textContent = best;
    r.querySelectorAll("p")[1].textContent = INFO[best];
    box.appendChild(r);
    if (window.confetti) {
      var rect = r.getBoundingClientRect();
      confetti(rect.left + rect.width / 2, rect.top + 40);
    }
    document.getElementById("again").addEventListener("click", function () {
      step = 0; score = {}; ask();
    });
  }
  ask();
})();