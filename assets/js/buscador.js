function updateDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < categoryItems.length; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentIndex) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function scrollToLeft() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        // Si estamos en el primer elemento, mover al último
        currentIndex = categoryItems.length - 1;
    }
    scrollToCurrent();
}

function scrollToRight() {
    if (currentIndex < categoryItems.length - 1) {
        currentIndex++;
    } else {
        // Si estamos en el último elemento, mover al primero
        currentIndex = 0;
    }
    scrollToCurrent();
}

var prevCategoryWidth = 0;
var categoryWidth;

function scrollToCurrent() {
    categoryWidth = categoryItems[currentIndex].offsetWidth;
    if (prevCategoryWidth === 0) {
        categoryWidth = categoryItems[currentIndex].offsetWidth;
        prevCategoryWidth = categoryWidth;
    } else {
        categoryWidth = prevCategoryWidth;
    }
    console.log('category: ' + categoryWidth + '- prev: ' + prevCategoryWidth);
    resultCategories.scrollTo({
        left: categoryWidth * currentIndex,
        behavior: 'smooth'
    });
    updateDots();
}

function goToSlide(index) {
    currentIndex = index;
    scrollToCurrent();
}




document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 991) {	
        resultCategories.addEventListener('scroll', () => {
            const scrollLeft = resultCategories.scrollLeft;
            console.log('SC: '+scrollLeft);
            let newCurrentIndex = 0;
    
            for (let i = 0; i < categoryItems.length; i++) {
                const itemWidth = categoryItems[i].offsetWidth;
                const itemLeft = itemWidth * i;
    
                if (scrollLeft >= itemLeft && scrollLeft < itemLeft + itemWidth) {
                    newCurrentIndex = i;
                    break;
                }
            }
    
            if (newCurrentIndex !== currentIndex) {
                currentIndex = newCurrentIndex;
                updateDots();
            }
        });
    
        updateDots();
    };
});





function obtenerDatosComercios() {
    jQuery('#destacados').css('display','none');
    let cat = selectCategories.value;
    let off = selectOffers.value;
    let prov = selectProvinces.value;

    let query = document.getElementById("buscar").value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dir-prd-eastus-api-apim-01.azure-api.net/api/v1.0/stores', true);
    xhr.setRequestHeader('ApiKey', 'ArQwE10MLm1M0eTn2eLa#19UoaA0a9g1X04IrRAOERtMr0A00XvZ19inimiRIto4isA7a4');
    xhr.setRequestHeader('Ocp-Apim-Subscription-Key', 'c28669f7fbe64db3b2bc6720b2b21949');
    xhr.setRequestHeader('Credentials', 's5KhgNCxVywbuISSeQnOLEUGGPzb1eYBSU7h8A3ESs3rzbBT7T3v58jLgFw3nkWhJBIj9DQGfmdTslLQxJmL8w==');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var datos = JSON.parse(xhr.responseText);
                console.log(datos);
                dataComercios = datos;

                let results = [];
                for (let i = 0; i < dataComercios.length; i++) {
                    let match = true;

                    if (cat != 0) {
                        match = match && dataComercios[i].category && dataComercios[i].category.toLowerCase().includes(cat.toLowerCase());
                    }
                    if (off != 0) {
                        match = match && dataComercios[i].offer && dataComercios[i].offer.toLowerCase().includes(off.toLowerCase());
                    }
                    if (prov != 0) {
                        match = match && dataComercios[i].province && dataComercios[i].province.toLowerCase().includes(prov.toLowerCase());
                    }
                    if (query != '') {
                        match = match && dataComercios[i].commerce && dataComercios[i].commerce.toLowerCase().includes(query.toLowerCase());
                    }

                    if (match) {
                        results.push(dataComercios[i]);
                    }
                }

                document.getElementById("results").innerHTML = "";

                if(results.length >0){
                    jQuery('#results').addClass('has-results');
                    jQuery('#results').removeClass('empty-results');
                    for(let i = 0; i < results.length; i++){
                        let li = document.createElement("div");
                        li.classList.add("results-item");
                        var nombresincortar = results[i].commerce;
                        var nombrecortado = nombresincortar.split(" ");
                        var primernombre = nombrecortado[0].toLowerCase();
                        li.innerHTML = `
                            <div class="results-item-img">
                                <div class="position-relative d-block d-flex " href="" role="button" onclick='goToURL(\"${results[i].url}\",\"\")'>
                                    <img class="img-fluid w-100" src="${results[i].logo}">
                                </div>
                            </div>
                            <div class="results-item-name">
                                <span class="text-black fw-600 category-name">${results[i].commerce}</span>
                            </div>`;
                        document.getElementById("results").appendChild(li);
                    }
                } else {
                    jQuery('#results').addClass('empty-results');
                    let li = document.createElement("div");
                    li.innerHTML = "No se encontraron resultados";
                    document.getElementById("results").appendChild(li);
                }
            } else {
                console.error('Error al obtener datos:', xhr.status);
            }
        }
    };
    
    xhr.send();
}


function obtenerDatosCategorias() {
    const resultscategories = document.getElementById("resultscategories");
    resultscategories.innerHTML = "";
    const selectcategories = document.getElementById("selectcategories");

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://dir-prd-eastus-api-apim-01.azure-api.net/api/v1.0/stores/filter', true);
    xhr.setRequestHeader('ApiKey', 'ArQwE10MLm1M0eTn2eLa#19UoaA0a9g1X04IrRAOERtMr0A00XvZ19inimiRIto4isA7a4');
    xhr.setRequestHeader('Ocp-Apim-Subscription-Key', 'c28669f7fbe64db3b2bc6720b2b21949');
    xhr.setRequestHeader('Credentials', 's5KhgNCxVywbuISSeQnOLEUGGPzb1eYBSU7h8A3ESs3rzbBT7T3v58jLgFw3nkWhJBIj9DQGfmdTslLQxJmL8w==');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var datos = JSON.parse(xhr.responseText);
                console.log(datos);
                dataCategories = datos.categories;
                dataOffers = datos.offers;
                dataProvinces = datos.provinces;
    
                function agregarOpcionSeleccionar(selectElement, nameitem) {
                    let option = document.createElement("option");
                    option.value = '0';
                    option.text = 'Seleccionar '+nameitem;
                    selectElement.appendChild(option);
                }
    
                agregarOpcionSeleccionar(selectCategories,'Categoría');
                if (dataCategories.length > 0) {
                    dataCategories.forEach(result => {
                        let div = document.createElement("div");
                        div.classList.add("category");
                        var imgItem = result.replace(/\s+/g, '-');
                        imgItem = imgItem.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        imgItem = imgItem.toLowerCase();

                        var categoryItems = "category-item-"+imgItem+""; 
                        // console.log(categoryItems);
                        //div.classList.add(categoryItems);

                        // console.log('ITEM: ' + imgItem);
                        div.innerHTML = `
                            <!-- <div class="position-relative d-flex ${categoryItems}" href="" onclick='obtenerDatosFiltrados(\"${result}\", "", "")'> -->
                            <div class="position-relative d-flex ${categoryItems}" href="" onclick='aplicarCategoriaFiltrada(\"${result}\")'>
                                <!-- <span class="position-absolute text-white fw-600 category-name">${result}</span> -->
                                <div class="position-absolute top-0 start-0 w-100 h-100 rounded" style="background-color: rgba(0, 0, 0, 0.1);"></div>
                                <img class="img-fluid w-100" src="assets/images/buscador/${imgItem}.png">
                            </div>`;
                        resultscategories.appendChild(div);
    
                        let option = document.createElement("option");
                        option.value = result;
                        option.text = result;
                        selectCategories.appendChild(option);
                    });
                }
    
                agregarOpcionSeleccionar(selectOffers, 'Oferta');
                if (dataOffers.length > 0) {
                    dataOffers.forEach(result => {
                        let option = document.createElement("option");
                        option.value = result;
                        option.text = result;
                        selectOffers.appendChild(option);
                    });
                }
    
                // agregarOpcionSeleccionar(selectProvinces,'Provincia');
                // if (dataProvinces.length > 0) {
                // 	dataProvinces.forEach(result => {
                // 		let option = document.createElement("option");
                // 		option.value = result;
                // 		option.text = result;
                // 		selectProvinces.appendChild(option);
                // 	});
                // }
            } else {
                console.error('Error al obtener datos:', xhr.status);
            }
        }
    };
    
    var payload = JSON.stringify({
        "Category": "",
        "Offer": "",
        "Province": ""
    });
    
    xhr.send(payload);
}

function aplicarCategoriaFiltrada(categoria) {
    jQuery('#selectCategories').val(categoria);
    obtenerDatosComercios();
}
        
function buscarPorFiltro(){
    
    let query = document.getElementById("buscar").value;
    // console.log(query);
    document.getElementById("results").innerHTML = "";

    cat = document.getElementById("selectCategories").value;
    if(cat == 0){
        cat = '';
    }
    off = document.getElementById("selectOffers").value;
    if(off == 0){
        off = '';
    }
    prov = document.getElementById("selectProvinces").value;
    if(prov == 0){
        prov = '';
    }

    if (query.trim() === "") {
        alert("Ingrese un valor para buscar");
        return;
    }

    obtenerDatosFiltrados(cat,off,prov);

};


function goToURL(baseUrl, params) {
    const urlParams = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}?${urlParams}`;
    window.open(fullUrl, '_blank');
}


