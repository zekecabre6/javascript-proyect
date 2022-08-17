document.addEventListener('DOMContentLoaded', () => {

    // Variables

    //let baseDeDatos = [];

    let carrito = [];
    const DOMitems = document.getElementById('items');
    const DOMcarrito = document.getElementById('carrito');
    const DOMtotal = document.getElementById('total');
    const DOMbotonVaciar = document.getElementById('boton-vaciar');
    const DOMinputBuscador = document.getElementById('buscar-pal');
    const DOMbotonCompra = document.getElementById('boton-compra');
    const DOMmostrarCarrito = document.getElementById('mostrar-carrito');

    const arayproductos = [{
            nombre: "Picles•☆☆☆ frasco grande",
            img: "img/pikles.jpeg",
            alt: "pickles",
            moneda: 400,
            stock: 10,
            id: 1,
        },
        {
            nombre: "Picles•☆☆☆ frasco chico",
            img: "img/pikles.jpeg",
            alt: "pickles",
            moneda: 250,
            stock: 15,
            id: 2,
        },
        {
            nombre: "BAILEYS CASERO Botella de 500ml",
            img: "img/baylei.jpeg",
            alt: "BAILEY",
            moneda: 1400,
            stock: 11,
            id: 3,
        },
        {
            nombre: "panes saborizados 12u.",
            img: "img/pancitos saborizados.jpeg",
            alt: "pan",
            moneda: 470,
            stock: 6,
            id: 4,
        },

        {
            nombre: "Berenjenas al escabeche frasco chico",
            img: "img/berenjenas.jpeg",
            alt: "frascos",
            moneda: 300,
            stock: 1,
            id: 5,
        },

        {
            nombre: "Berenjenas al escabeche frasco grande",
            img: "img/berenjenas.jpeg",
            alt: "frascos",
            moneda: 500,
            stock: 12,
            id: 6,
        },

        {
            nombre: "Dulce de manzana y pera",
            img: "img/frascodulce.jpeg",
            alt: "dulce",
            moneda: 250,
            stock: 23,
            id: 7,
        },

        {
            nombre: "Dulce de Naranja",
            img: "img/dulcedenaranja.jpeg",
            alt: "Naranja",
            moneda: 250,
            stock: 15,
            id: 8,
        },

        {
            nombre: "Dulce de zapallo",
            img: "img/dulcedezapallo.jpeg",
            alt: "Naranja",
            moneda: 250,
            stock: 3,
            id: 9,
        },

        {
            nombre: "Budines",
            img: "img/budines.jpeg",
            alt: "budin",
            moneda: 320,
            stock: 11,
            id: 10,
        },


    ];

    /**
     * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
     */
    function renderizarProductos() {
        DOMitems.innerHTML = '';
        arayproductos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4', );
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h3');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.innerText = info.nombre;
            // Precio
            const miNodoPrecio = document.createElement('h5');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.innerText = `$${info.moneda}`;
            //Stock
            const miNodoStock = document.createElement('h5');
            miNodoStock.classList.add('card-text');
            miNodoStock.innerText = `Stock: ${info.stock}`;
            //Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('image');
            miNodoImagen.setAttribute('src', info.img);
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.innerText = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.append(miNodoTitle);
            miNodoCardBody.append(miNodoPrecio);
            miNodoCardBody.append(miNodoStock);
            //miNodoCardBody.append(miNodoImagen)
            miNodoCardBody.append(miNodoBoton);
            miNodo.append(miNodoCardBody);
            DOMitems.append(miNodo);
        });
    }

    /**
     * Evento para añadir un producto al carrito de la compra
     */
    function anyadirProductoAlCarrito(e) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(e.target.getAttribute('marcador'))
        arayproductos[e.target.getAttribute('marcador') - 1].stock--;
        renderizarProductos();
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        $.jGrowl("¡Agregado al carrito!", {
            life: 1000
        });
    }
    /**
     * Dibuja todos los productos guardados en el carrito
     */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.innerText = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = arayproductos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.innerText = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].moneda}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.innerText = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.innerText = calcularTotal();
    }

    /**
     * Evento para borrar un elemento del carrito
     */
    function borrarItemCarrito(e) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = e.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        $.jGrowl("¡Elemento eliminado!", {
            life: 1000,
            theme: 'test'
        });

    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = arayproductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].moneda;
        }, 0).toFixed(2);
    }

    /**
     * Varia el carrito y vuelve a dibujarlo
     */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.removeItem('carrito');
        $.jGrowl("¡Carrito vaciado!", {
            life: 1000,
            theme: 'test'
        });

    }

    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (localStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(localStorage.getItem('carrito'));
        }
    }

    function filtrarProductos() {
        const Productos = Array.from(document.querySelectorAll('#items .card .card-body .card-title'));
        Productos.forEach(producto => {
            let productoStyle = producto.parentElement.parentElement.style;
            if (producto.innerText.toLowerCase().includes(DOMinputBuscador.value.toLowerCase()) || DOMinputBuscador.value == '') {
                productoStyle.display = "initial";
                setTimeout(() => {
                    productoStyle.transform = 'scale(100%)'
                }, 300)

            } else {
                productoStyle.transform = 'scale(0%)';
                setTimeout(() => {
                    productoStyle.display = 'none'
                }, 300)
            }
        })
    }

    function alertaCompra() {
        Swal.fire({
            icon: 'question',
            title: 'Deseas confirmar tu compra?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar compra`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Gracias por tu compra,nos estaremos comunicando por email.',
                    input: 'email',
                    inputLabel: 'Ingrese su Email',
                    inputPlaceholder: 'Ingrese su Email'
                })
            } else if (result.isDenied) {
                Swal.fire('Su compra fue cancelada.', '', 'info');

            }
        })
    }

    function mostrarCarrito() {
        let elemento = document.getElementById("carri");
        let elem = document.getElementById("mostrar-carrito");
        if (elemento.className == "col-sm-4 ocult") {
            elemento.className = "col-sm-4 show";
            elem.innerText = "Cerrar carrito";
        } else {
            elemento.className = "col-sm-4 ocult";
            elem.innerText = "Carrito";
        }
    }


    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMinputBuscador.addEventListener('keyup', filtrarProductos);
    DOMbotonCompra.addEventListener('click', alertaCompra);
    DOMmostrarCarrito.addEventListener('click', mostrarCarrito);








    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();


});