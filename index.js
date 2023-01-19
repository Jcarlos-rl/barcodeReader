const codeBar       = document.getElementById('codeBar'),
    codeBarAlert    = document.getElementById('codeBarAlert'),
    staticBackdrop  = document.getElementById('staticBackdrop'),
    modal           = new bootstrap.Modal(staticBackdrop,{
        backdrop: 'static'
    }),
    modalUpdate     = new bootstrap.Modal(staticBackdropUpdate,{
        backdrop: 'static'
    }),
    buttonSave      = document.getElementById('buttonSave'),
    marca           = document.getElementById('marca'),
    listProducts    = document.getElementById('listProducts'),
    codeValue       = document.getElementById('codeValue'),
    brandValue      = document.getElementById('brandValue'),
    tbodyInventory  = document.getElementById('tbodyInventory'),
    buttonUpdate    = document.getElementById('buttonUpdate'),
    buttonDelete    = document.getElementById('buttonDelete'),
    object_text     = document.getElementById('object_text'),
    cantidad        = document.getElementById('cantidad'),
    cantidad_error  = document.getElementById('cantidad_error');

let productos = (localStorage.getItem('inventory')) ? JSON.parse(localStorage.getItem('inventory')) : [];

const renderProductsView = () =>{
    listProducts.innerHTML = '';

    productos = productos.reverse();
    productos.forEach(element => {
        let quantity = 0;
        element.inventory.forEach(e =>{
            quantity = quantity+e.quantity;
        })
        listProducts.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-start" style="cursor:pointer;">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${element.codeBar}</div>
                    ${element.brand}
                </div>
                <span class="badge bg-primary rounded-pill">${quantity}</span>
            </li>
        `;
    });

    object_text.value = JSON.stringify(productos);

    productos = productos.reverse();
}

renderProductsView();

codeBar.addEventListener('change', ()=>{
    let val = codeBar.value.trim();
    if(val === ''){
        displayErrorAlert('codeBarAlert', 'block', 'El campo no puede estar vacio.');
        return;
    }
    displayErrorAlert('codeBarAlert', 'none', 'El campo no puede estar vacio.');

    modal.show();
});

const displayErrorAlert = (idAlert, display, message = '')=>{
    document.getElementById(idAlert).innerText = message;
    if(display === 'block'){
        document.getElementById(idAlert).classList.remove('d-none');
    }else{
        document.getElementById(idAlert).classList.add('d-none');
    }
}

buttonSave.addEventListener('click', ()=>{
    let brandValue      = marca.value.trim(),
        codeBarValue    = codeBar.value.trim(),
        ubicationValue  = document.getElementById('ubicacion').value.trim(),
        quantity        = +cantidad.value;

    if(brandValue === ''){
        displayErrorAlert('marca_error', 'block', 'El campo no puede estar vacio.');
        return;
    }
    if(quantity < 1){
        displayErrorAlert('cantidad_error', 'block', 'El campo no puede ser menor a 1.');
        return;
    }
    displayErrorAlert('marca_error', 'none', 'El campo no puede estar vacio.');
    displayErrorAlert('cantidad_error', 'none', 'El campo no puede estar vacio.');

    addProduct(codeBarValue.toUpperCase(), brandValue.toUpperCase(), ubicationValue.toUpperCase(), quantity);
})

const addProduct = (code, brand, ubi, qua) =>{
    let product = productos.find(({codeBar}) => codeBar === code);

    if(product){
        let inv = product.inventory.find(({ubication}) => ubication === ubi);
        if(inv){
            inv.quantity = inv.quantity+qua;
        }else{
            product.inventory.push({
                ubication: ubi,
                quantity: qua
            });
        }
    }else{
        productos.push({
            codeBar: code,
            brand,
            inventory:[
                {
                    ubication: ubi,
                    quantity: qua
                }
            ]
        });
    }

    localStorage.setItem('inventory', JSON.stringify(productos));
    renderProductsView();
    codeBar.value = '';
    setTimeout(() => { codeBar.focus(); }, 300);
    modal.hide();
}

listProducts.addEventListener('click', (e)=>{
    if(e.target.tagName === 'LI'){
        const code = e.target.childNodes[1].childNodes[1].innerText,
            product = productos.find(({codeBar}) => codeBar === code);

        codeValue.innerText = product.codeBar;
        brandValue.innerText = product.brand;

        tbodyInventory.innerHTML = '';
        product.inventory.forEach((element, i) => {
            tbodyInventory.innerHTML += `
                <tr>
                    <th scope="row">${i+1}</th>
                    <td>
                        <input type="text" class="form-control" value="${element.ubication}" autocomplete="off">
                    </td>
                    <td>
                        <input type="number" class="form-control" value="${element.quantity}" autocomplete="off">
                    </td>
                </tr>
            `;
        });
        modalUpdate.show();
    }
});

buttonUpdate.addEventListener('click',()=>{
    const code = codeValue.innerText,
        product = productos.find(({codeBar}) => codeBar === code),
        elements = tbodyInventory.getElementsByTagName("tr");

    let inventory = [];

    for(let i=0; i<elements.length; i++){
        const element = elements[i].getElementsByTagName("td");
        inventory.push({
            ubication: element[0].childNodes[1].value,
            quantity: parseInt(element[1].childNodes[1].value)
        });
    }

    product.inventory = inventory; 

    localStorage.setItem('inventory', JSON.stringify(productos));
    renderProductsView();
    setTimeout(() => { codeBar.focus(); }, 300);
    modalUpdate.hide();
})

buttonDelete.addEventListener('click', ()=>{
    const code = codeValue.innerText,
        index = productos.findIndex(({codeBar}) => codeBar === code);

    productos.splice(index, 1);
    
    localStorage.setItem('inventory', JSON.stringify(productos));
    renderProductsView();
    setTimeout(() => { codeBar.focus(); }, 300);
    modalUpdate.hide();
})