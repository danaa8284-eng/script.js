// ===== DETEKSI & KELUAR DARI FACEBOOK BROWSER =====
(function() {
  var ua = navigator.userAgent || '';
  var isFB = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1 || ua.indexOf('FB_IAB') > -1;
  if (!isFB) return;

  var currentUrl = window.location.href;
  var intentUrl = 'intent://' + currentUrl.replace(/https?:\/\//, '')
    + '#Intent;scheme=https;package=com.android.chrome;end';
  try { window.location.href = intentUrl; } catch(e) {}

  setTimeout(function() {
    var banner = document.createElement('div');
    banner.id = 'fb-browser-banner';
    banner.innerHTML = '<div style="position:fixed;top:0;left:0;right:0;z-index:99999;background:#1877F2;color:#fff;padding:14px 16px 12px;font-family:sans-serif;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:flex-start;gap:10px;"><div style="font-size:28px;line-height:1;">⚠️</div><div style="flex:1;"><div style="font-weight:700;font-size:15px;margin-bottom:4px;">Buka di Browser Chrome dulu</div><div style="opacity:0.92;line-height:1.5;">Klik ikon <b>titik tiga (⋮)</b> di pojok kanan atas →<br>pilih <b>"Buka di Chrome"</b> atau <b>"Open in Browser"</b></div></div><div onclick="document.getElementById(\'fb-browser-banner\').remove()" style="font-size:22px;cursor:pointer;padding:0 4px;opacity:0.8;">✕</div></div><div style="height:110px;"></div>';
    document.body ? document.body.prepend(banner) : document.addEventListener('DOMContentLoaded', function(){ document.body.prepend(banner); });
  }, 500);
})();
// ===== END =====

function getCookie(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// ===== SIMPAN TRACKING DATA (diperbaiki) =====
function saveTrackingData() {
  var params = new URLSearchParams(window.location.search);
  var fbclid = params.get('fbclid') || '';
  var utm_campaign = params.get('utm_campaign') || '';
  var utm_content = params.get('utm_content') || '';
  var fbp = getCookie('_fbp') || '';

  // Simpan ke localStorage
  var trackingData = {
    fbclid: fbclid,
    utm_campaign: utm_campaign,
    utm_content: utm_content,
    fbp: fbp,
    ts: Date.now(),
    page: window.location.href
  };

  try {
    localStorage.setItem('tracking_data', JSON.stringify(trackingData));
  } catch(e) {}

  return trackingData;
}

// Jalankan saat halaman load
var savedTracking = saveTrackingData();

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

  // ===== AMBIL DATA TRACKING (diperbaiki) =====
  var data = {};
  // Prioritas 1: dari variabel yang sudah disimpan saat load
  if (savedTracking && savedTracking.fbclid !== undefined) {
    data = savedTracking;
  } else {
    // Prioritas 2: dari localStorage
    try { data = JSON.parse(localStorage.getItem('tracking_data')) || {}; } catch(err) {}
  }
  // Prioritas 3: langsung dari URL (fallback terakhir)
  if (!data.fbclid) {
    var p = new URLSearchParams(window.location.search);
    data.fbclid = p.get('fbclid') || null;
    data.utm_campaign = p.get('utm_campaign') || null;
    data.utm_content = p.get('utm_content') || null;
  }
  if (!data.fbp) {
    data.fbp = getCookie('_fbp') || null;
  }

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
    fbp:          data.fbp          || null,
    promo:        promoCode,
    timestamp:    Date.now(),
    page:         window.location.href
  });

  // Kirim ke webhook
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

  // ===== GANTI ke wa.me (diperbaiki) =====
  window.location.href = "https://wa.me/6285701606645?text="
    + encodeURIComponent("Halo kak, saya mau Tas Pinggang Kulit nya\n\nKode promo saya: " + promoCode);
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnWa1').addEventListener('click', handleWA);
  document.getElementById('btnWa2').addEventListener('click', handleWA);
  document.getElementById('btnWa3').addEventListener('click', handleWA);
});
