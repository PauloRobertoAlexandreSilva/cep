window.addEventListener('load', event => {
    if('serviceWorker' in navigator) {

        navigator.serviceWorker.register('sw.js').then(reg  => {
        }).catch(err => {
            console.error(`SW: não registrado ${err}`)
        });
    }
});