window.addEventListener('DOMContentLoaded', () => {
    if('serviceWorker' in navigator) {

        navigator.serviceWorker.register('sw.js').then(reg  => {
        }).catch(err => {
            console.error(`SW: não registrado ${err}`)
        });
    }

    if (!('share' in navigator) || !('canShare' in navigator)) {
        console.log('Web Share API not supported in this environment.');
        document.getElementById("share").style.display = "none";
        return;
    } else {
        document.getElementById("share").addEventListener("click", async () => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const filesArray = [
                    new File(
                        [blob],
                        'img/iconn_180.png',
                        { type: blob.type, lastModified: new Date().getTime() }
                    )
                ];

                const shareData = {
                    files: filesArray,
                    title: "CEP",
                    text: "Consulta de Endereço por CEP\n\n\n",
                    url: "https://paulorobertoalexandresilva.github.io/cep/",
                };

                if (!(navigator.canShare(shareData))) {
                    throw new Error("Cannot share this data type or combination.");
                }

                await navigator.share(shareData);
            } catch (err) {
            }
        });

    }
});