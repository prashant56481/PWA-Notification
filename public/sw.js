//install service worker

//self is sw itself

const staticCacheName='site-static-v5';
const dynamicCacheName='site-dynamic-v8';
const assets=[
    '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
];

//limit cache size function

const limitCacheSize=(name,size)=>{
    caches.open(name).then(cache=>{
        cache.keys().then(keys=>{
            if(keys.length>size){
                cache.delete(keys[0]).then(limitCacheSize(name,size));
            }
        })
    })
};


self.addEventListener('install',evt=>{
    //console.log('sw has been installed');
    //storing and utilize cache

    evt.waitUntil(
        //wait until below promise is finished
        caches.open(staticCacheName)
        .then((cache)=>{
            console.log('caching shell address');
            cache.addAll(assets)
        })
    )   
});

//active event c
self.addEventListener('activate',evt=>{
    //console.log('sw has been activated');

    //if new cache is activated then we have to 
    //delete old caches
    evt.waitUntil(
        caches.keys().then(keys => {
          //console.log(keys);
          return Promise.all(keys
            .filter(key => key !== staticCacheName&&key!==dynamicCacheName)
            .map(key => caches.delete(key))
          );
        })
    );
})

//fetch event occur when we interact with server
self.addEventListener('fetch',evt=>{

    if(evt.request.url.indexOf('firestore.googleapi.com')===-1){
        //console.log('fetch event',evt);
        //we look if req is already present in chache
        evt.respondWith(
            caches.match(evt.request)
            .then(cacheRes=>{
                return cacheRes || fetch(evt.request).then(fetchRes=>{
                    return caches.open(dynamicCacheName).then(cache=>{
                        //before putting check size
                        
                        cache.put(evt.request.url,fetchRes.clone())
                        limitCacheSize(dynamicCacheName,10);
                        return fetchRes;
                    })
                });
            }).catch(()=>{
                //if error occured like when we 
                //fetch page while offline
                if(evt.request.url.indexOf('.html')>-1){
                    return caches.match('/pages/fallback.html')
                }
            })   
        )
    }
});

