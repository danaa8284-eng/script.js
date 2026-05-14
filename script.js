function getCookie(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

var params = new URLSearchParams(window.location.search);
if (params.toString()) {
  try {
    localStorage.setItem('tracking_data', JSON.stringify({
      fbclid:       params.get('fbclid')       || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content:  params.get('utm_content')  || '',
      fbp:          getCookie('_fbp')          || '',
      ts: Date.now()
    }));
  } catch(e) {}
}

var endTime = new Date().getTime() + (5*3600 + 47*60 + 23) * 1000;
function updateCountdown() {
  var diff = Math.max(0, endTime - new Date().getTime());
  document.getElementById('cdH').textContent = String(Math.floor(diff / 3600000)).padStart(2,'0');
  document.getElementById('cdM').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  document.getElementById('cdS').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

var stok = 27;
function reduceStok() {
  if (stok > 8) {
    stok--;
    document.getElementById('stokNum').textContent = stok;
    document.getElementById('stokFill').style.width = Math.min(100, (100 - stok) * 1.3) + '%';
    setTimeout(reduceStok, Math.floor(Math.random() * 120000) + 60000);
  }
}
setTimeout(reduceStok, 90000);

var BASE = 'https://raw.githubusercontent.com/danaa8284-eng/foto/refs/heads/main/';
var buyers = [
  {name:"Haryanto – Jepara",       init:"HR", time:"2 menit yang lalu",  photo:BASE+"bapak%206.jpg"},
  {name:"Budi Wahyono – Surabaya",  init:"BW", time:"5 menit yang lalu",  photo:BASE+"bapak%207.jpg"},
  {name:"Ahmad Hidayat – Bandung",  init:"AH", time:"7 menit yang lalu",  photo:BASE+"bapak%208.jpg"},
  {name:"Rizky Pratama – Jakarta",  init:"RP", time:"11 menit yang lalu", photo:BASE+"bapak%209.jpg"},
  {name:"Darmawan S. – Yogyakarta", init:"DS", time:"14 menit yang lalu", photo:BASE+"bapak%2010.jpg"},
  {name:"Fajar Nugroho – Semarang", init:"FN", time:"18 menit yang lalu", photo:BASE+"bapak%2011.jpg"},
  {name:"Wahyu Santoso – Malang",   init:"WS", time:"21 menit yang lalu", photo:BASE+"bapak%2012.jpg"},
  {name:"Eko Prasetyo – Solo",      init:"EP", time:"25 menit yang lalu", photo:BASE+"bapak%2013.jpg"},
  {name:"Guntur Wicaksono – Depok", init:"GW", time:"28 menit yang lalu", photo:BASE+"bapak%2014.jpg"},
  {name:"Hendri Kusuma – Bogor",    init:"HK", time:"33 menit yang lalu", photo:BASE+"bapak%2015.jpg"}
];

var buyIdx = 0;
function showNotif() {
  var popup  = document.getElementById('notifPopup');
  var imgEl  = document.getElementById('notifAvatarImg');
  var fbEl   = document.getElementById('notifAvatarFallback');
  var initEl = document.getElementById('notifInit');
  var b      = buyers[buyIdx % buyers.length];
  if (b.photo) {
    imgEl.src = b.photo;
    imgEl.style.display = 'block';
    fbEl.style.display  = 'none';
  } else {
    imgEl.style.display = 'none';
    fbEl.style.display  = 'flex';
    initEl.textContent  = b.init;
  }
  document.getElementById('notifName').textContent = b.name;
  document.getElementById('notifTime').textContent = b.time;
  popup.classList.add('show');
  buyIdx++;
  setTimeout(function() { popup.classList.remove('show'); }, 4500);
  setTimeout(showNotif, Math.floor(Math.random() * 6500) + 6500);
}
setTimeout(showNotif, 1000);

function scrollToWA() {
  document.getElementById('waTarget').scrollIntoView({behavior:'smooth', block:'center'});
}

async function handleWA(e) {
  e.preventDefault();
  var data = {};
  try { data = JSON.parse(localStorage.getItem('tracking_data')) || {}; } catch(err) {}
  var promoCode = "PROMO" + Date.now().toString().slice(-6);
  try { localStorage.setItem('last_promo', promoCode); } catch(err) {}
  if (typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', {}, {eventID: promoCode});
  }
  var webhookUrl = "https://n8n-wyv7h4exvgre.jkt1.sumopod.my.id/webhook/data-buyer-cs-dinda";
  var payload = JSON.stringify({
    fbclid:       data.fbclid       || null,
    utm_campaign: data.utm_campaign || null,
    utm_content:  data.utm_content  || null,
    fbp:          data.fbp || getCookie('_fbp') || null,
    promo:        promoCode,
    timestamp:    Date.now(),
    page:         window.location.href
  });
  var beaconSent = false;
  try {
    var blob = new Blob([payload], { type: 'application/json' });
    beaconSent = navigator.sendBeacon(webhookUrl, blob);
  } catch(err) {}
  if (!beaconSent) {
    try {
      await Promise.race([
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: payload
        }),
        new Promise(function(_, reject) { setTimeout(function() { reject('timeout'); }, 3000); })
      ]);
    } catch(err) {}
  }
  window.location.href = "whatsapp://send?phone=6285701606645&text="
    + encodeURIComponent("Halo kak, saya mau Tas Pinggang Kulit nya\n\nKode promo saya: " + promoCode);
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnWa1').addEventListener('click', handleWA);
  document.getElementById('btnWa2').addEventListener('click', handleWA);
  document.getElementById('btnWa3').addEventListener('click', handleWA);
});
