const C='chat-v7';
const SHELL=['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png','icon-maskable-192.png','icon-maskable-512.png','vendor/supabase.js'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  // add files one by one so a single missing file does not cancel the whole precache
  e.waitUntil(caches.open(C).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});

// network first, fall back to the cache when offline
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(
    fetch(r).then(res=>{
      // only cache good same-origin responses (never errors or partial 206 responses)
      if(res.ok&&res.type==='basic'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error())))
  );
});

self.addEventListener('push',e=>{
  let d={};try{d=e.data.json()}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title||'Alcove',{body:d.body||'New message',icon:'icon-192.png',tag:d.tag||'chat',renotify:true,data:{conv:d.conv||null}}));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const conv=(e.notification.data||{}).conv;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus' in c){if(conv)c.postMessage({conv});return c.focus()}}
    return clients.openWindow(conv?'./?c='+conv:'./');
  }));
});
