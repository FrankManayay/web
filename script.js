// =====================
// FIREBASE CONFIG
// =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA32F4wgtS15cmZADqAOMapYwtYhZKEGLk",
  authDomain: "tienda-web-3e959.firebaseapp.com",
  projectId: "tienda-web-3e959",
  storageBucket: "tienda-web-3e959.firebasestorage.app",
  messagingSenderId: "973911624370",
  appId: "1:973911624370:web:174c4b1ab8f6f3cbce97ab",
  measurementId: "G-TWY2T5XRFL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =====================
// VARIABLES GLOBALES
// =====================
let editId = null;
let cart = [];

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
async function saveProduct() {
  const name = document.getElementById('name').value.trim();
  const price = Number(document.getElementById('price').value);
  const stock = Number(document.getElementById('stock').value);
  const img = document.getElementById('img').value || 'https://via.placeholder.com/300';
  const cat = document.getElementById('cat').value;
  const desc = document.getElementById('desc')?.value.trim() || '';

  if (!name || price <= 0 || stock < 0) {
    alert('Completa bien los datos');
    return;
  }

  if (editId) {
    const docRef = doc(db, 'products', editId);
    await addDoc(collection(db, 'products'), { name, price, stock, img, cat, desc, timestamp: new Date() });
    editId = null;
    updateButtonText('➕ Agregar producto');
  } else {
    await addDoc(collection(db, 'products'), { name, price, stock, img, cat, desc, timestamp: new Date() });
  }

  clearForm();
}

// Renderizar productos en Admin
function renderAdmin() {
  const c = document.getElementById('adminProducts');
  if (!c) return;

  const q = query(collection(db, 'products'), orderBy('timestamp', 'desc'));
  onSnapshot(q, snapshot => {
    c.innerHTML = '';
    if (snapshot.empty) {
      c.innerHTML = '<p>No hay productos registrados</p>';
      return;
    }
    snapshot.forEach(docSnap => {
      const p = { id: docSnap.id, ...docSnap.data() };
      c.innerHTML += `
        <div class="product-row">
          <div>
            <strong>${p.name}</strong><br>
            S/ ${p.price} | Stock: ${p.stock}
          </div>
          <div>
            <button class="edit" onclick="editProduct('${p.id}')">✏️</button>
            <button class="delete" onclick="deleteProduct('${p.id}')">❌</button>
          </div>
        </div>
      `;
    });
  });
}

function editProduct(id) {
  editId = id;
  alert("Editar producto aún requiere implementar la carga de datos en el formulario desde Firebase.");
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  await deleteDoc(doc(db, 'products', id));
}

function clearForm() {
  ['name', 'price', 'stock', 'img', 'desc'].forEach(id => {
    if (document.getElementById(id)) document.getElementById(id).value = '';
  });
}

function updateButtonText(text) {
  const btn = document.getElementById('saveBtn');
  if (btn) btn.innerText = text;
}

// =====================
// TIENDA
// =====================
function renderProducts() {
  const container = document.getElementById('products');
  const filter = document.getElementById('filter')?.value || 'all';

  container.innerHTML = '';

  const q = query(collection(db, 'products'), orderBy('timestamp', 'desc'));
  onSnapshot(q, snapshot => {
    snapshot.forEach(docSnap => {
      const p = { id: docSnap.id, ...docSnap.data() };
      if (filter !== 'all' && p.cat !== filter) return;
      container.innerHTML += `
        <div class="card" onclick="showInfo('${p.id}')">
          <img src="${p.img}">
          <h3>${p.name}</h3>
          <p>S/ ${p.price}</p>
          <button onclick="event.stopPropagation(); addToCart('${p.id}')">
            Agregar al carrito
          </button>
        </div>
      `;
    });
  });
}

// =====================
// INFO PRODUCTO
// =====================
async function showInfo(id) {
  const docSnap = await getDocs(doc(db, 'products', id));
  alert(JSON.stringify(docSnap.data(), null, 2));
}

// =====================
// CARRITO
// =====================
async function addToCart(id) {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDocs(docRef);
  if (!docSnap.exists()) return;
  cart.push({ id: docSnap.id, ...docSnap.data() });
  alert('Producto agregado 🛒');
}

function renderCart() {
  const c = document.getElementById('cart');
  if (!c) return;
  if (cart.length === 0) {
    c.innerHTML = '<p>🛒 Tu carrito está vacío</p>';
    return;
  }

  let total = 0;
  c.innerHTML = '';
  cart.forEach((p, i) => {
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

function removeFromCart(i) {
  cart.splice(i, 1);
  renderCart();
}

function whatsapp() {
  const dir = document.getElementById('dir')?.value || '';
  let msg = 'Pedido:%0A';
  let total = 0;
  cart.forEach(p => {
    total += Number(p.price);
    msg += `- ${p.name} S/${p.price}%0A`;
  });
  msg += `%0ATotal: S/${total}%0ADirección: ${dir}`;
  window.open(`https://wa.me/51925096515?text=${msg}`);
}

// =====================
// LOGIN
// =====================
let attempts = 3;

function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const errorMsg = document.getElementById("error-msg");
  const attemptsMsg = document.getElementById("attempts-msg");

  const adminUser = "frank";
  const adminPass = "pomahuaca";

  if (user === "" || pass === "") {
    errorMsg.textContent = "Por favor completa todos los campos.";
    return;
  }

  if (user === adminUser && pass === adminPass) {
    window.location.href = "admin.html";
  } else {
    attempts--;
    errorMsg.textContent = "Usuario o contraseña incorrectos.";
    attemptsMsg.textContent = `Te quedan ${attempts} intento(s).`;

    if (attempts <= 0) {
      errorMsg.textContent = "Has excedido el número de intentos.";
      attemptsMsg.textContent = "";
      document.querySelector("button").disabled = true;
      document.querySelector("button").style.background = "#9ca3af";
    }
  }
}
