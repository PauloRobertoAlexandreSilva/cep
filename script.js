window.addEventListener("DOMContentLoaded", function() {
    const inputRua = document.getElementById('inputRua');
    const inputBairro = document.getElementById('inputBairro');
    const inputCidade = document.getElementById('inputCidade');
    const inputUF = document.getElementById('inputUF');
    const inputDDD = document.getElementById('inputDDD');
    const inputIBGE = document.getElementById('inputIBGE');
    const divAlerta = document.getElementById("divAlerta");

     function limpa_formulário_cep() {
        inputRua.value="";
        inputBairro.value="";
        inputCidade.value="";
        inputUF.value="";
        inputDDD.value="";
        inputIBGE.value="";
        divAlerta.style.display = "none";
    }

    inputCEP.addEventListener("keydown", function(e) {
        limpa_formulário_cep();

        if (e.key === "Enter") {

            //Nova variável "cep" somente com dígitos.
            let cep = this.value.replace(/\D/g, '');

            //Verifica se campo cep possui valor informado.
            if (cep != "") {

                //Expressão regular para validar o CEP.
                var validacep = /^[0-9]{8}$/;

                //Valida o formato do CEP.
                if(validacep.test(cep)) {
                    const ws = "https://viacep.com.br/ws/";
                    let url = ws + cep + "/json/";

                    const xhr = new XMLHttpRequest();
                    xhr.addEventListener("loadstart", function(){
                        //Preenche os campos com "..." enquanto consulta webservice.
                        inputRua.value="...";
                        inputBairro.value="...";
                        inputCidade.value="...";
                        inputUF.value="...";
                        inputDDD.value="...";
                        inputIBGE.value="...";
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
                        inputRua.value = obj.logradouro + " " + obj.complemento;
                        inputBairro.value = obj.bairro;
                        inputCidade.value = obj.localidade;
                        inputUF.value = obj.estado + "(" + obj.uf + ")";
                        inputDDD.value = obj.ddd;
                        inputIBGE.value = obj.ibge;
                    });
                    xhr.open("GET", url);
                    xhr.send();
                } else {
                    //cep é inválido.
                    divAlerta.innerHTML="<strong>Erro!</strong> CEP inválido.";
                    divAlerta.style.display = "block";
                }
            }
        }
    })
});