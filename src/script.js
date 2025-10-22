window.addEventListener("load", function() {
    const inputCEP = document.getElementById("inputCEP");
    const inputRua = document.getElementById('inputRua');
    const inputBairro = document.getElementById('inputBairro');
    const inputCidade = document.getElementById('inputCidade');
    const inputUF = document.getElementById('inputUF');
    const inputDDD = document.getElementById('inputDDD');
    const inputIBGE = document.getElementById('inputIBGE');
    const divAlerta = document.getElementById("divAlerta");
    const btnConsultar = document.getElementById("btnConsultar");

     function limpaFormulario() {
        inputRua.innerHTML="";
        inputBairro.innerHTML="";
        inputCidade.innerHTML="";
        inputUF.innerHTML="";
        inputDDD.innerHTML="";
        inputIBGE.innerHTML="";
        divAlerta.style.display = "none";
    }

    btnConsultar.addEventListener("click", function() {
        limpaFormulario();

        //Nova variável "cep" somente com dígitos.
        let cep = inputCEP.value.replace(/\D/g, '');

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
                    inputRua.innerHTML="...";
                    inputBairro.innerHTML="...";
                    inputCidade.innerHTML="...";
                    inputUF.innerHTML="...";
                    inputDDD.innerHTML="...";
                    inputIBGE.innerHTML="...";
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
                    inputRua.innerHTML = obj.logradouro + " " + obj.complemento;
                    inputBairro.innerHTML = obj.bairro;
                    inputCidade.innerHTML = obj.localidade;
                    inputUF.innerHTML = obj.estado + "(" + obj.uf + ")";
                    inputDDD.innerHTML = obj.ddd;
                    inputIBGE.innerHTML = obj.ibge;
                });
                xhr.open("GET", url);
                xhr.send();
            } else {
                //cep é inválido.
                divAlerta.innerHTML="<strong>Erro!</strong> CEP inválido.";
                divAlerta.style.display = "block";
            }
        }
    })
});