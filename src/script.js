function WS(url, retorno)
{
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            retorno(JSON.parse(this.responseText));
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
};


function alerta(texto)
{
    document.getElementById("resultText").innerHTML = texto;
    setTimeout( function() { document.getElementById("resultText").innerHTML = ""; }, 3000)
}

function ConsultaCEP(data)
{
    var resultado = document.getElementById("resultText");

    resultado.innerHTML = 'Logradouro: ' + data.logradouro + ' ' + data.complemento + '<br>';
    resultado.innerHTML += 'Bairro: ' + data.bairro + '<br>';
    resultado.innerHTML += 'Município: ' + data.localidade + '<br>';
    resultado.innerHTML += 'Estado: ' + data.estado + ' (' + data.uf + ')<br>';
    resultado.innerHTML += 'Região: ' + data.regiao + '<br>';
}


window.addEventListener('load', function() {

    document.getElementById("btnConsultar").addEventListener("click", function() {
        var cep = document.getElementById("cep");
        var url = 'https://viacep.com.br/ws/' + cep.value + '/json/';

        WS(url, ConsultaCEP);
    });
});