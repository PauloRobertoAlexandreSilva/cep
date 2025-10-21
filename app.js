window.addEventListener('DOMContentLoaded', () => {
    if('serviceWorker' in navigator) {

        navigator.serviceWorker.register('sw.js').then(reg  => {
        }).catch(err => {
            console.error(`SW: não registrado ${err}`)
        });
    }

    const shareData = {
        title: "CEP",
        text: "Consulta de Endereço por CEP",
        url: "https://paulorobertoalexandresilva.github.io/cep/",
    };
    document.getElementById("share").addEventListener("click", async () => {
        try {
            await navigator.share(shareData);
        } catch (err) {
        }
    });
});