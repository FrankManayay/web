// =====================
// VARIABLES GLOBALES
// =====================
let products = JSON.parse(localStorage.getItem('products')) || [];
let editId = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =====================
// DOM READY
// =====================
document.addEventListener('DOMContentLoaded', () => {

  // ADMIN
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProduct);
    renderAdmin();
  }

  // TIENDA
  if (document.getElementById('products')) {
    renderProducts();
  }

  // CARRITO
  if (document.getElementById('cart')) {
    renderCart();
  }
});

// =====================
// ADMIN
// =====================
function saveProduct(){
  const name = document.getElementById('name').value.trim();
  const price = Number(document.getElementById('price').value);
  const stock = Number(document.getElementById('stock').value);
  const img = document.getElementById('img').value || 'https://via.placeholder.com/300';
  const cat = document.getElementById('cat').value;
  const desc = document.getElementById('desc')?.value.trim() || '';

  if(!name || price <= 0 || stock < 0){
    alert('Completa bien los datos');
    return;
  }

  if(editId){
    const p = products.find(p=>p.id===editId);
    if(!p) return;
    Object.assign(p,{name,price,stock,img,cat,desc});
    editId = null;
    updateButtonText('➕ Agregar producto');
  } else {
    products.push({
      id: Date.now(),
      name,
      price,
      stock,
      img,
      cat,
      desc
    });
  }

  localStorage.setItem('products', JSON.stringify(products));
  clearForm();
  renderAdmin();
}

function renderAdmin(){
  const c = document.getElementById('adminProducts');
  if(!c) return;

  c.innerHTML = '';

  if(products.length === 0){
    c.innerHTML = '<p>No hay productos registrados</p>';
    return;
  }

  products.forEach(p=>{
    c.innerHTML += `
      <div class="product-row">
        <div>
          <strong>${p.name}</strong><br>
          S/ ${p.price} | Stock: ${p.stock}
        </div>
        <div>
          <button class="edit" onclick="editProduct(${p.id})">✏️</button>
          <button class="delete" onclick="deleteProduct(${p.id})">❌</button>
        </div>
      </div>
    `;
  });
}

function editProduct(id){
  const p = products.find(p=>p.id===id);
  if(!p) return;

  name.value = p.name;
  price.value = p.price;
  stock.value = p.stock;
  img.value = p.img;
  cat.value = p.cat;
  if(document.getElementById('desc')) desc.value = p.desc || '';

  editId = id;
  updateButtonText('💾 Guardar cambios');
}

function deleteProduct(id){
  if(!confirm('¿Eliminar producto?')) return;
  products = products.filter(p=>p.id!==id);
  localStorage.setItem('products',JSON.stringify(products));
  renderAdmin();
}

function clearForm(){
  ['name','price','stock','img','desc'].forEach(id=>{
    if(document.getElementById(id)) document.getElementById(id).value = '';
  });
}

function updateButtonText(text){
  const btn = document.getElementById('saveBtn');
  if(btn) btn.innerText = text;
}

// =====================
// TIENDA
// =====================
function renderProducts(){
  const container = document.getElementById('products');
  const filter = document.getElementById('filter')?.value || 'all';

  container.innerHTML = '';

  let list = filter === 'all'
    ? products
    : products.filter(p=>p.cat===filter);

  if(list.length === 0){
    container.innerHTML = '<p style="text-align:center">No hay productos disponibles</p>';
    return;
  }

  list.forEach(p=>{
    container.innerHTML += `
      <div class="card" onclick="showInfo(${p.id})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>S/ ${p.price}</p>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">
          Agregar al carrito
        </button>
      </div>
    `;
  });
}

// =====================
// INFO AL TOCAR PRODUCTO
// =====================
function showInfo(id){
  const p = products.find(p=>p.id===id);
  if(!p) return;

  alert(
    `📦 ${p.name}\n\n` +
    `💰 Precio: S/ ${p.price}\n` +
    `📦 Stock: ${p.stock}\n\n` +
    `📝 ${p.desc || 'Sin descripción'}`
  );
}

// =====================
// CARRITO
// =====================
function addToCart(id){
  const p = products.find(p=>p.id===id);
  if(!p) return;

  cart.push({...p});
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Producto agregado 🛒');
}

function renderCart(){
  const c = document.getElementById('cart');
  if(!c) return;

  cart = JSON.parse(localStorage.getItem('cart')) || [];

  if(cart.length === 0){
    c.innerHTML = '<p>🛒 Tu carrito está vacío</p>';
    return;
  }

  let total = 0;
  c.innerHTML = '';

  cart.forEach((p,i)=>{
    total += Number(p.price);
    c.innerHTML += `
      <div class="product-row">
        ${p.name} - S/ ${p.price}
        <button class="delete" onclick="removeFromCart(${i})">❌</button>
      </div>
    `;
  });

  c.innerHTML += `<h3>Total: S/ ${total}</h3>`;
}

function removeFromCart(i){
  cart.splice(i,1);
  localStorage.setItem('cart',JSON.stringify(cart));
  renderCart();
}

function whatsapp(){
  const dir = document.getElementById('dir')?.value || '';
  let msg = 'Pedido:%0A';
  let total = 0;

  cart.forEach(p=>{
    total += Number(p.price);
    msg += `- ${p.name} S/${p.price}%0A`;
  });

  msg += `%0ATotal: S/${total}%0ADirección: ${dir}`;
  window.open(`https://wa.me/51925096515?text=${msg}`);
}



let attempts = 3; // máximo 3 intentos

function login() {
    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();
    const errorMsg = document.getElementById("error-msg");
    const attemptsMsg = document.getElementById("attempts-msg");

    // Credenciales de ejemplo
    const adminUser = "frank";
    const adminPass = "pomahuaca";

    if(user === "" || pass === "") {
        errorMsg.textContent = "Por favor completa todos los campos.";
        return;
    }

    if(user === adminUser && pass === adminPass) {
        // Credenciales correctas → redirige al admin
        window.location.href = "admin.html";
    } else {
        attempts--;
        errorMsg.textContent = "Usuario o contraseña incorrectos.";
        attemptsMsg.textContent = `Te quedan ${attempts} intento(s).`;

        if(attempts <= 0){
            errorMsg.textContent = "Has excedido el número de intentos.";
            attemptsMsg.textContent = "";
            document.querySelector("button").disabled = true;
            document.querySelector("button").style.background = "#9ca3af"; // botón gris
        }
    }
}