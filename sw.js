var GHPATH = '/iniberapa';
var APP_PREFIX = 'bib_';
var VERSION = 'version_01';
var CACHE_NAME = APP_PREFIX + VERSION;

var RAW_BASE = 'https://raw.githubusercontent.com/budijoe/';
var SVG_MASTER = RAW_BASE + 'skor-mahjong/main/';
var BG_IMAGE = RAW_BASE + 'iniberapa/main/mj-bg-03.png';

// 1. Aset lokal utama dari repo iniberapa (wajib berhasil di-cache saat install)
var CORE_URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/manifest.webmanifest`,
  `${GHPATH}/icon-192.png`,
  `${GHPATH}/icon-512.png`
];

// 2. Aset eksternal dari raw.githubusercontent.com (background & semua SVG)
var EXTERNAL_ASSETS = [
  BG_IMAGE,
  SVG_MASTER + 'budijoe-pixel.svg',
  SVG_MASTER + 'svg/01-white-dragon.svg',
  SVG_MASTER + 'svg/02-green-dragon.svg',
  SVG_MASTER + 'svg/03-red-dragon.svg',
  SVG_MASTER + 'svg/04-east-wind.svg',
  SVG_MASTER + 'svg/05-south-wind.svg',
  SVG_MASTER + 'svg/06-west-wind.svg',
  SVG_MASTER + 'svg/07-north-wind.svg',
  SVG_MASTER + 'svg/08-characters-1.svg',
  SVG_MASTER + 'svg/09-characters-2.svg',
  SVG_MASTER + 'svg/10-characters-3.svg',
  SVG_MASTER + 'svg/11-characters-4.svg',
  SVG_MASTER + 'svg/12-characters-5.svg',
  SVG_MASTER + 'svg/13-characters-6.svg',
  SVG_MASTER + 'svg/14-characters-7.svg',
  SVG_MASTER + 'svg/15-characters-8.svg',
  SVG_MASTER + 'svg/16-characters-9.svg',
  SVG_MASTER + 'svg/17-circles-1-variant-4.svg',
  SVG_MASTER + 'svg/18-circles-2.svg',
  SVG_MASTER + 'svg/19-circles-3.svg',
  SVG_MASTER + 'svg/20-circles-4.svg',
  SVG_MASTER + 'svg/21-circles-5.svg',
  SVG_MASTER + 'svg/22-circles-6.svg',
  SVG_MASTER + 'svg/23-circles-7.svg',
  SVG_MASTER + 'svg/24-circles-8.svg',
  SVG_MASTER + 'svg/25-circles-9.svg',
  SVG_MASTER + 'svg/26-bamboos-1.svg',
  SVG_MASTER + 'svg/27-bamboos-2.svg',
  SVG_MASTER + 'svg/28-bamboos-3.svg',
  SVG_MASTER + 'svg/29-bamboos-4.svg',
  SVG_MASTER + 'svg/30-bamboos-5.svg',
  SVG_MASTER + 'svg/31-bamboos-6.svg',
  SVG_MASTER + 'svg/32-bamboos-7.svg',
  SVG_MASTER + 'svg/33-bamboos-8.svg',
  SVG_MASTER + 'svg/34-bamboos-9.svg',
  SVG_MASTER + 'svg/35-spring.svg',
  SVG_MASTER + 'svg/36-summer.svg',
  SVG_MASTER + 'svg/37-autumn.svg',
  SVG_MASTER + 'svg/38-winter.svg',
  SVG_MASTER + 'svg/39-plum.svg',
  SVG_MASTER + 'svg/40-orchid.svg',
  SVG_MASTER + 'svg/41-chrysanthemum.svg',
  SVG_MASTER + 'svg/42-bamboo.svg',
  SVG_MASTER + 'svg/44-joker-clown.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      EXTERNAL_ASSETS.forEach(function (url) {
        cache.add(url).catch(function () {});
      });
      return cache.addAll(CORE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key.indexOf(APP_PREFIX) === 0 && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then(function (networkResponse) {
        if (e.request.url.startsWith(RAW_BASE)) {
          var responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});