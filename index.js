const codeBar       = document.getElementById('codeBar'),
    codeBarAlert    = document.getElementById('codeBarAlert'),
    staticBackdrop  = document.getElementById('staticBackdrop'),
    modal           = new bootstrap.Modal(staticBackdrop,{
        backdrop: 'static'
    }),
    buttonSave      = document.getElementById('buttonSave');

codeBar.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        let val = codeBar.value.trim();
        if(val === ''){
            displayErrorAlert('codeBarAlert', 'block', 'El campo no puede estar vacio.');
            return;
        }
        displayErrorAlert('codeBarAlert', 'none', 'El campo no puede estar vacio.');
    
        modal.show();
    }
});

const displayErrorAlert = (idAlert, display, message = '')=>{
    document.getElementById(idAlert).innerText = message;
    if(display === 'block'){
        document.getElementById(idAlert).classList.remove('d-none');
    }else{
        document.getElementById(idAlert).classList.add('d-none');
    }
}