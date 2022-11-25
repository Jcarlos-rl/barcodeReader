document.addEventListener("DOMContentLoaded", ()=>{
    const btn_save = document.getElementById('btn_save'),
        staticBackdrop = document.getElementById('staticBackdrop'),
        modal = new bootstrap.Modal(staticBackdrop,{
            backdrop: 'static'
        }),
        codigo = document.getElementById('codigo'),
        marca = document.getElementById('marca'),
        cantidad = document.getElementById('cantidad'),
        ubicacion = document.getElementById('ubicacion'),
        codigo_error = document.getElementById('codigo_error'),
        marca_error = document.getElementById('marca_error'),
        cantidad_error = document.getElementById('cantidad_error'),
        ol_products = document.getElementById('ol_products'),
        btn_delete = document.getElementById('btn_delete'),
        object_text = document.getElementById('object_text'),
        btn_copy = document.getElementById('btn_copy'),
        copy_success = document.getElementById('copy_success')
        ;
        
    let products = [], id = '';
    const renderProducts = ()=>{
        ol_products.innerHTML = '';
        products.forEach((element,i) => {
            ol_products.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-start" data-id="${i}">
                      <div class="ms-2 me-auto">
                        <div class="fw-bold">${element.code}</div>
                        ${element.brand}
                      </div>
                      <span class="badge bg-primary rounded-pill">${element.quantity}</span>
                </li>
            `;
        });

        object_text.value = JSON.stringify(products);
    }

    if(localStorage.getItem('products')){
        products = JSON.parse(localStorage.getItem('products'));
        renderProducts();
    }

    Quagga.init({
        inputStream:{
            constraints:{
                width: 500,
                height: 300
            },
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('contenedor')
        },
        decoder:{
            readers: ['ean_reader']
        }
    }, function(err){
        if(err){
            console.log(err);
            return;
        }
        console.log("Iniciado correctamente");
        Quagga.start();
    });

    Quagga.onDetected((data)=>{
        staticBackdrop.setAttribute('data-id','insert');
        btn_delete.classList.add('d-none');
        modal.show();
        codigo.value = data.codeResult.code;
    });

    btn_save.addEventListener('click', ()=>{

        if(validateInputs()){

            if(staticBackdrop.getAttribute('data-id') === 'insert'){
                products.push({
                    'code': codigo.value,
                    'brand': marca.value,
                    'quantity': cantidad.value,
                    'ubication': ubicacion.value
                })
            }else{
                products[id] = {
                    'code': codigo.value,
                    'brand': marca.value,
                    'quantity': cantidad.value,
                    'ubication': ubicacion.value
                };
            }
    
            cantidad.value = 1;

            renderProducts();
            localStorage.setItem('products', JSON.stringify(products));
            modal.hide();
        }
    })

    const validateInputs = ()=>{

        let band = true;
        
        if(codigo.value === ''){
            band = false;
            codigo_error.innerText = 'El código es obligatorio';
            codigo_error.classList.remove('d-none');
        }else{
            codigo_error.classList.add('d-none');
        }

        if(marca.value === ''){
            band = false;
            marca_error.innerText = 'El código es obligatorio';
            marca_error.classList.remove('d-none');
        }else{
            marca_error.classList.add('d-none');
        }

        if(cantidad.value === ''){
            band = false;
            cantidad_error.innerText = 'El código es obligatorio';
            cantidad_error.classList.remove('d-none');
        }else{
            cantidad_error.classList.add('d-none');
        }

        return band;
    }

    ol_products.addEventListener('click',(e)=>{
        const li = e.target;
        if(li.tagName === 'LI'){

            id = li.getAttribute('data-id');
            const product = products[id];

            
            staticBackdrop.setAttribute('data-id', 'update');
            codigo.value = product.code;
            marca.value = product.brand;
            cantidad.value = product.quantity;
            ubicacion.value = product.ubication;

            btn_delete.classList.remove('d-none');
            modal.show();
        }
    })

    btn_delete.addEventListener('click', ()=>{
        products.splice(id, 1);

        renderProducts();
        localStorage.setItem('products', JSON.stringify(products));
        modal.hide();
    });

    btn_copy.addEventListener('click', ()=>{
        object_text.select();
        object_text.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(object_text.value);

        copy_success.classList.remove('d-none');
        setTimeout(() => {
            copy_success.classList.add('d-none');
        }, 1500);
    })
});
