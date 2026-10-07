/* تطبيق تحقق ومخالفات — غيّر APP_VERSION فقط عند إصدار نسخة جديدة */
const APP_VERSION = '34';
const CACHE_NAME = `tahaqquq-checks-v${APP_VERSION}`;
const APP_SHELL = ['./','./index.html','./manifest.json','./icon.png','./icon-192.png','./sw2.js','./fonts/IBMPlexSansArabic-400.woff2','./fonts/IBMPlexSansArabic-600.woff2','./fonts/IBMPlexSansArabic-700.woff2'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request=event.request, url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  const documentRequest=request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');
  if(documentRequest){
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));}return response;}).catch(()=>caches.match('./index.html').then(response=>response||caches.match('./'))));
  } else {
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));}return response;})));
  }
});
