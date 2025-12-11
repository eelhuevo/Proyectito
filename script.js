// DATOS DE PRODUCTOS
const productos = [
    {
        id: 1,
        nombre: 'Pastel Rosa Elegante',
        descripcion: 'Delicioso pastel con decoración personalizada',
        precio: 45,
        categoria: 'pasteles',
        imagen: 'https://images.unsplash.com/photo-1621794598988-d7f895197dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    },
    {
        id: 2,
        nombre: 'Cupcakes Artesanales',
        descripcion: 'Set de 6 cupcakes con frosting cremoso',
        precio: 24,
        categoria: 'cupcakes',
        imagen: 'https://images.unsplash.com/photo-1690584177253-58e128f05ceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    },
    {
        id: 3,
        nombre: 'Macarons Franceses',
        descripcion: 'Caja de 12 macarons de sabores variados',
        precio: 32,
        categoria: 'macarons',
        imagen: 'https://images.unsplash.com/photo-1597823777845-fb7518b68bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    },
    {
        id: 4,
        nombre: 'Pastel de Bodas',
        descripcion: 'Pastel de 3 niveles para ocasiones especiales',
        precio: 250,
        categoria: 'especiales',
        imagen: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    },
    {
        id: 5,
        nombre: 'Pastel de Chocolate',
        descripcion: 'Intenso sabor a chocolate con ganache',
        precio: 38,
        categoria: 'pasteles',
        imagen: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    },
    {
        id: 6,
        nombre: 'Pasteles Variados',
        descripcion: 'Selección de pasteles y postres del día',
        precio: 28,
        categoria: 'pasteles',
        imagen: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    }
];

// VARIABLES GLOBALES
let carrito = [];
let productoSeleccionado = null;
let filtroCategoria = 'todos';
let filtroPrecio = 'todos';

// FUNCIONES DE INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
    actualizarCarritoBadge();
});

// FUNCIONES DE NAVEGACIÓN
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    const menuIcon = menuBtn.querySelector('.menu-icon');
    
    mobileMenu.classList.toggle('active');
    menuIcon.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
}

function cerrarMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    const menuIcon = menuBtn.querySelector('.menu-icon');
    
    mobileMenu.classList.remove('active');
    menuIcon.textContent = '☰';
}

function scrollToProductos() {
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// Cerrar menú móvil al redimensionar la ventana
window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
        cerrarMenu();
    }
});

// FUNCIONES DE PRODUCTOS
function renderizarProductos() {
    const grid = document.getElementById('productosGrid');
    
    // Filtrar productos
    const productosFiltrados = productos.filter(producto => {
        // Filtro por categoría
        const pasaCategoria = filtroCategoria === 'todos' || producto.categoria === filtroCategoria;
        
        // Filtro por precio
        let pasaPrecio = true;
        if (filtroPrecio !== 'todos') {
            const precio = producto.precio;
            if (filtroPrecio === '0-30') pasaPrecio = precio < 30;
            else if (filtroPrecio === '30-50') pasaPrecio = precio >= 30 && precio < 50;
            else if (filtroPrecio === '50-100') pasaPrecio = precio >= 50 && precio < 100;
            else if (filtroPrecio === '100+') pasaPrecio = precio >= 100;
        }
        
        return pasaCategoria && pasaPrecio;
    });
    
    // Limpiar grid
    grid.innerHTML = '';
    
    // Si no hay productos
    if (productosFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="producto-no-encontrado">
                <p>No se encontraron productos con estos filtros</p>
                <button class="btn btn-primary" onclick="limpiarFiltros()">Limpiar filtros</button>
            </div>
        `;
        return;
    }
    
    // Renderizar productos
    productosFiltrados.forEach((producto, index) => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="producto-imagen-container">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-precio-badge">$${producto.precio}</div>
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id}, event)">
                    🛍️ Agregar al carrito
                </button>
            </div>
        `;
        
        // Click en la card abre el modal (excepto en el botón)
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-agregar')) {
                abrirModalProducto(producto.id);
            }
        });
        
        grid.appendChild(card);
    });
}

function aplicarFiltros() {
    // Obtener valores de los filtros
    const categoriaRadios = document.getElementsByName('categoria');
    for (const radio of categoriaRadios) {
        if (radio.checked) {
            filtroCategoria = radio.value;
            break;
        }
    }
    
    const precioRadios = document.getElementsByName('precio');
    for (const radio of precioRadios) {
        if (radio.checked) {
            filtroPrecio = radio.value;
            break;
        }
    }
    
    // Re-renderizar productos
    renderizarProductos();
}

function limpiarFiltros() {
    // Resetear a "todos"
    filtroCategoria = 'todos';
    filtroPrecio = 'todos';
    
    // Marcar los radio buttons
    document.querySelector('input[name="categoria"][value="todos"]').checked = true;
    document.querySelector('input[name="precio"][value="todos"]').checked = true;
    
    // Re-renderizar
    renderizarProductos();
}

// FUNCIONES DE CARRITO
function agregarAlCarrito(productoId, event) {
    if (event) {
        event.stopPropagation(); // Evitar que se abra el modal
    }
    
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    // Verificar si ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad++;
        mostrarNotificacion(`${producto.nombre} - Cantidad actualizada`, 'success');
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
        mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    }
    
    actualizarCarritoBadge();
    renderizarCarrito();
}

function eliminarDelCarrito(productoId) {
    const producto = carrito.find(item => item.id === productoId);
    if (producto) {
        mostrarNotificacion(`${producto.nombre} eliminado del carrito`, 'error');
    }
    
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarritoBadge();
    renderizarCarrito();
}

function actualizarCantidad(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    if (!item) return;
    
    item.cantidad += cambio;
    
    // Si la cantidad llega a 0, eliminar
    if (item.cantidad <= 0) {
        eliminarDelCarrito(productoId);
    } else {
        actualizarCarritoBadge();
        renderizarCarrito();
    }
}

function actualizarCarritoBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    badge.textContent = totalItems;
    
    if (totalItems > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderizarCarrito() {
    const carritoItems = document.getElementById('carritoItems');
    const carritoTotal = document.getElementById('carritoTotal');
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        carritoItems.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
            </div>
        `;
        carritoTotal.textContent = '$0';
        return;
    }
    
    // Renderizar items
    carritoItems.innerHTML = '';
    let total = 0;
    
    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        itemDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
            <div class="carrito-item-info">
                <h4>${item.nombre}</h4>
                <div class="carrito-item-precio">$${item.precio}</div>
                <div class="carrito-item-controls">
                    <button class="cantidad-btn" onclick="actualizarCantidad(${item.id}, -1)">-</button>
                    <span class="cantidad-display">${item.cantidad}</span>
                    <button class="cantidad-btn" onclick="actualizarCantidad(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
        `;
        
        carritoItems.appendChild(itemDiv);
    });
    
    carritoTotal.textContent = `$${total}`;
}

function abrirCarrito() {
    renderizarCarrito();
    document.getElementById('modalCarrito').classList.add('active');
}

function cerrarCarrito() {
    document.getElementById('modalCarrito').classList.remove('active');
}

function procederCheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'info');
        return;
    }
    
    cerrarCarrito();
    abrirContacto();
    mostrarNotificacion('Procede a completar tus datos de contacto', 'success');
}

// FUNCIONES DE MODALES
function abrirModalProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    productoSeleccionado = producto;
    
    // Actualizar contenido del modal
    document.getElementById('modalProductoImagen').src = producto.imagen;
    document.getElementById('modalProductoImagen').alt = producto.nombre;
    document.getElementById('modalProductoNombre').textContent = producto.nombre;
    document.getElementById('modalProductoPrecio').textContent = `$${producto.precio}`;
    document.getElementById('modalProductoDescripcion').textContent = producto.descripcion;
    
    // Mostrar modal
    document.getElementById('modalProducto').classList.add('active');
}

function cerrarModalProducto() {
    document.getElementById('modalProducto').classList.remove('active');
    productoSeleccionado = null;
}

function agregarDesdeModal() {
    if (productoSeleccionado) {
        agregarAlCarrito(productoSeleccionado.id);
        cerrarModalProducto();
    }
}

function abrirContacto() {
    document.getElementById('modalContacto').classList.add('active');
}

function cerrarContacto() {
    document.getElementById('modalContacto').classList.remove('active');
}

// FUNCIONES DE FORMULARIO
function enviarFormulario(event) {
    event.preventDefault(); // Evitar el envío real del formulario
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validación básica (los campos required ya validan, pero por si acaso)
    if (!nombre || !email || !telefono || !mensaje) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Simular envío
    console.log('Formulario enviado:', { nombre, email, telefono, mensaje });
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
    
    // Limpiar formulario
    document.getElementById('contactoForm').reset();
    
    // Cerrar modal
    cerrarContacto();
    
    // Si venía del checkout, limpiar carrito
    if (carrito.length > 0) {
        mostrarNotificacion('¡Gracias por tu pedido!', 'success');
        carrito = [];
        actualizarCarritoBadge();
        renderizarCarrito();
    }
}

// FUNCIONES DE NOTIFICACIONES
function mostrarNotificacion(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('notificaciones');
    
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    // Iconos según el tipo
    let icono = 'ℹ️';
    if (tipo === 'success') icono = '✅';
    else if (tipo === 'error') icono = '❌';
    else if (tipo === 'info') icono = 'ℹ️';
    
    notificacion.innerHTML = `
        <div class="notificacion-icono">${icono}</div>
        <div class="notificacion-texto">${mensaje}</div>
    `;
    
    // Agregar al contenedor
    contenedor.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// CERRAR MODALES AL PRESIONAR ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModalProducto();
        cerrarCarrito();
        cerrarContacto();
    }
});

// SMOOTH SCROLL PARA NAVEGACIÓN
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
