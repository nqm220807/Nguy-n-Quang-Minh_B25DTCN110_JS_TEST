
let products = JSON.parse(localStorage.getItem("products")) || [];
products = products.map((p) => ({ ...p, id: Number(p.id) }));
let editingId = null;

function renderTable() {
  let tbody = document.getElementById("tbody");
  let empty = document.getElementById("emptyState");
  let totalBadge = document.getElementById("totalBadge");

  if (!tbody || !empty || !totalBadge) return;

  tbody.innerHTML = "";

  if (products.length === 0) {
    empty.style.display = "block";
    totalBadge.innerText = "0 sản phẩm";
    return;
  }

  empty.style.display = "none";
  totalBadge.innerText = `${products.length} sản phẩm`;

  products.forEach((p, index) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${p.id})">Sửa</button>
        <button onclick="deleteProduct(${p.id})">Xóa</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
}

function validate(name, price, stock) {
  if (!name || name.trim() === "") {
    alert("Vui lòng nhập tên sản phẩm.");
    return false;
  }

  let check = products.find(
    (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== editingId
  );

  if (check) {
    alert("Tên sản phẩm đã tồn tại.");
    return false;
  }

  if (!Number.isFinite(price) || price <= 0) {
    alert("Giá phải là số dương lớn hơn 0.");
    return false;
  }

  if (!Number.isInteger(stock) || stock < 0) {
    alert("Tồn kho phải là số nguyên lớn hơn hoặc bằng 0.");
    return false;
  }

  return true;
}

// ===== SUBMIT =====
function submitForm() {
  let name = document.getElementById("iName").value.trim();
  let price = Number(document.getElementById("iPrice").value);
  let stock = Number(document.getElementById("iStock").value);

  if (!validate(name, price, stock)) return;

  if (editingId !== null) {
    let p = products.find((p) => p.id === editingId);
    if (p) {
      p.name = name;
      p.price = price;
      p.stock = stock;
      alert("Cập nhật sản phẩm thành công!");
    }
  } else {
    let newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    products.push({
      id: newId,
      name,
      price,
      stock,
    });

    alert("Thêm sản phẩm thành công!");
  }

  saveData();
  resetForm();
  renderTable();
}

// ===== EDIT =====
function editProduct(id) {
  id = Number(id);
  let p = products.find((p) => p.id === id);
  if (!p) return;

  document.getElementById("iName").value = p.name;
  document.getElementById("iPrice").value = p.price;
  document.getElementById("iStock").value = p.stock;
  document.getElementById("formTitle").innerText = "Chỉnh sửa sản phẩm";
  document.getElementById("btnSubmit").innerText = "Lưu";

  editingId = id;
}

// ===== DELETE =====
function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa?")) return;

  id = Number(id);
  products = products.filter((p) => p.id !== id);

  saveData();
  renderTable();

  alert("Xóa thành công!");
}

function resetForm() {
  document.getElementById("iName").value = "";
  document.getElementById("iPrice").value = "";
  document.getElementById("iStock").value = "";
  document.getElementById("formTitle").innerText = "Thêm sản phẩm mới";
  document.getElementById("btnSubmit").innerText = "Thêm sản phẩm";

  editingId = null;
}

function setUpSearch() {
  let searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    let keyword = this.value.toLowerCase();
    let rows = document.querySelectorAll("#tbody tr");

    rows.forEach((row) => {
      let name = row.children[1].innerText.toLowerCase();
      row.style.display = name.includes(keyword) ? "" : "none";
    });
  });
}


function initApp() {
  setUpSearch();
  renderTable();
}

window.addEventListener("DOMContentLoaded", initApp);
