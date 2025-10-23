window.addEventListener("load", function() {
    const inputCEP = document.getElementById("inputCEP");
    const divRua = document.getElementById('divRua');
    const divBairro = document.getElementById('divBairro');
    const divMunicipio = document.getElementById('divMunicipio');
    const divUF = document.getElementById('divUF');
    const divDDD = document.getElementById('divDDD');
    const divIBGE = document.getElementById('divIBGE');
    const divAlerta = document.getElementById("divAlerta");
    const btnConsultarCEP = document.getElementById("btnConsultarCEP");

    const inputRua = document.getElementById("inputRua");
    const btnConsultarEndereco = document.getElementById("btnConsultarEndereco");
    const divResultado = document.getElementById("divResultado");

    divCEP.focus();

     function limpaFormulario() {
        divRua.innerHTML="";
        divBairro.innerHTML="";
        divMunicipio.innerHTML="";
        divUF.innerHTML="";
        divDDD.innerHTML="";
        divIBGE.innerHTML="";
        divAlerta.style.display = "none";
    }

    btnConsultarCEP.addEventListener("click", function() {
        limpaFormulario();

        //Nova variável "cep" somente com dígitos.
        let cep = inputCEP.value.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {
                let url = "https://viacep.com.br/ws/" + cep + "/json/";

                const xhr = new XMLHttpRequest();
                xhr.addEventListener("loadstart", function(){
                    divIBGE.innerHTML="AGUARDE...";
                });
                xhr.addEventListener('error', function () {
                    divIBGE.innerHTML = 'Erro de rede ou na requisição.';
                });
                xhr.addEventListener("load", function(result) {
                    let obj = JSON.parse(result.target.response);

                    if( obj.erro) {
                        //cep não encontrado.
                        divAlerta.innerHTML="<strong>Erro!</strong> CEP não encontrado.";
                        divAlerta.style.display = "block";
                        return;
                    }

                    inputCEP.value = obj.cep;
                    divRua.innerHTML = obj.logradouro + " " + obj.complemento;
                    divBairro.innerHTML = "Bairro: " + obj.bairro;
                    divMunicipio.innerHTML = "Município: " + obj.localidade;
                    divUF.innerHTML = "Estado: " + obj.uf;
                    divDDD.innerHTML = 'DDD: ' + obj.ddd;
                    divIBGE.innerHTML = 'IBGE: ' + obj.ibge;
                });
                xhr.open("GET", url);
                xhr.send();
            } else {
                //cep é inválido.
                divAlerta.innerHTML="<strong>Erro!</strong> CEP inválido.";
                divAlerta.style.display = "block";
            }
        }
    });

    function CarregaEstados() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(result) {
            let obj = JSON.parse(result.target.response);
            document.getElementById("estados").innerHTML ="<option value='0'>SELECIONE O ESTADO</option>";
            for(x=0; x < obj.length; x++){
                document.getElementById("estados").innerHTML +="<option value='" + obj[x].sigla + "'>" + obj[x].nome + " (" + obj[x].sigla + ")</option>";
            }
        });
        xhr.open("GET", "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        xhr.send();
    }
    document.getElementById("estados").addEventListener("change", function(e) {
        CarregaMunicipios(e.target.value)
    });

    function CarregaMunicipios(estado) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(result) {
            let obj = JSON.parse(result.target.response);
            document.getElementById("municipios").innerHTML ="<option value='0'>SELECIONE O MUNICÍPIO</option>";
            for(x=0; x < obj.length; x++){
                document.getElementById("municipios").innerHTML +="<option value='" + obj[x].nome + "'>" + obj[x].nome + "</option>";
            }
        });
        xhr.open("GET", "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + estado + "/municipios");
        xhr.send();
    }

    btnConsultarEndereco.addEventListener("click", function() {
        let estado = document.getElementById("estados").value;
        let municipio = document.getElementById("municipios").value;
        let rua = inputRua.value;

        if(estado != 0 && municipio != 0 && rua != "") {
            let url =  "https://viacep.com.br/ws/" + estado + "/" + municipio + "/" + rua + "/json/";
            
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("loadstart", function(){
                divResultado.innerHTML="AGUARDE...";
            });
            xhr.addEventListener('error', function () {
                divResultado.innerHTML = 'Erro de rede ou na requisição.';
            });
            xhr.addEventListener("load", function(result) {
                let obj = JSON.parse(result.target.response);
                if(obj.length == 0) {
                    divResultado.innerHTML = "Endereço não encontrado";
                    return;
                }

                divResultado.innerHTML ="";
                for(x=0; x < obj.length; x++){
                    divResultado.innerHTML += obj[x].cep + "<br>";
                    if(obj[x].logradouro != "") divResultado.innerHTML += obj[x].logradouro + " " + obj[x].complemento + "<br>";
                    if(obj[x].bairro != "") divResultado.innerHTML += "Bairro: " + obj[x].bairro + "<br>";
                    divResultado.innerHTML += "Município: " + obj[x].localidade + "<br>";
                    divResultado.innerHTML += "Estado: " + obj[x].uf + "<br>";
                    divResultado.innerHTML += "DDD: " + obj[x].ddd + "<br>";
                    divResultado.innerHTML += "IBGE: " + obj[x].ibge + "<br>";
                    divResultado.innerHTML +="<hr>"
                }
            });
            xhr.open("GET",url);
            xhr.send();
        }
    });

    CarregaEstados();
});