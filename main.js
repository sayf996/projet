const productsList = document.querySelector(".product-list");
const addProduct = document.getElementById("add");
const productNom = document.getElementById("product");
const productQte = document.getElementById("quantity");
const url =
  "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/31/produits";

let output = "";

let headers = `<tr>
  <th>ID</th>
  <th>Product Name</th>
  <th>Quantity</th>
  </tr>`;

function renderProducts(products) {
  products.forEach((product) => {
    output += ` 
      
    <tr id="${product.id}">
      <td>${product.id}</td>
      <td class="product-nom${product.id}">${product.nom}</td>
      <td class="product-qte${product.id}">${product.qte}</td>
      <td class="update-btn${product.id}">
        <button class="button button1" id="${product.id}" onclick ="updateItem(this.id)">Update</button>
      </td>
      <td>
        <button class="button button2" id= "${product.id}" onclick="deleteItem(this.id)">Delete</button>
      </td>
    </tr>
    
      `;
  });
  productsList.innerHTML = headers + output;
}

// Get - Read the products
// Method: GET
fetch(url)
  .then((res) => res.json())
  .then((data) => renderProducts(data));

function add() {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom: productNom.value,
      qte: productQte.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const dataArr = [];
      dataArr.push(data);
      renderProducts(dataArr);
    })
    .then(() => location.reload());
}

function deleteItem(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => location.reload());
}

let jsonResult = "";

fetch(url)
  .then((res) => res.json())
  .then((data) => (jsonResult = data));
let searchResult = "";
const resultDiv = document.querySelector(".search-res");

function renderResult(product) {
  searchResult += `<tr id="${product.id}">
  <td>${product.id}</td>
  <td class="product-nom${product.id}">${product.nom}</td>
  <td class="product-qte${product.id}">${product.qte}</td>
  <td class="update-btn${product.id}">
    <button class="button button1" id="${product.id}" onclick ="updateItem(this.id)">Update</button>
  </td>
  <td>
    <button class="button button2" id= "${product.id}" onclick="deleteItem(this.id)">Delete</button>
  </td>
</tr>`;

  resultDiv.innerHTML = headers + searchResult;
}
function searchKeyword() {
  let resultExists = false;
  searchResult = "";
  let searchvalue = document.getElementById("search-value").value;

  for (let i = 0; i < jsonResult.length; i++) {
    if (jsonResult[i].nom.toLowerCase().includes(searchvalue.toLowerCase())) {
      renderResult(jsonResult[i]);
      resultExists = true;
    }
  }
  if (searchvalue.length == 0 || resultExists === false)
    resultDiv.innerHTML = `<td>No Result</td>`;
}

let checkResult = "";
let checkTable = document.getElementById("check-res");

function renderCheck(products) {
  checkResult = `<tr><td>${products.id}</td>
<td>${products.nom}</td>
<td>${products.qte}</td></tr>`;
  checkTable.innerHTML = headers + checkResult;
}

function checkID() {
  let checkValue = document.getElementById("check-value").value;
  let statusIndi = document.getElementById("statusIndi");
  let checkExists = false;
  for (let i = 0; i < jsonResult.length; i++) {
    if (jsonResult[i].id == checkValue) {
      renderCheck(jsonResult[i]);
      statusIndi.style.backgroundColor = "green";
      checkExists = true;
    }
  }
  if (!checkExists) {
    statusIndi.style.backgroundColor = "red";
    checkTable.innerHTML = `<td>No Result</td>`;
  }
  if (checkValue == 0) {
    statusIndi.style.backgroundColor = "grey";
    checkTable.innerHTML = `<td>Please enter a value</td>`;
  }
}
let inputValueNom = "";
let inputValueQte = "";
function updateItem(id) {
  let pNom = document.querySelector(".product-nom" + id);
  let pQte = document.querySelector(".product-qte" + id);
  inputValueNom =
    `<input type="text" class="nom${id}" value="` +
    pNom.textContent +
    `"></input>`;
  inputValueQte =
    `<input type="number" class="qte${id}" value="` +
    pQte.textContent +
    `"></input>`;
  let createBtns = `<button class= "button button7" onclick="cancelBtn()">✖</button> <button class="button button3" id="${id}"onclick="saveBtn(this.id)">Save</button>`;
  let updateBtnTD = document.querySelector(".update-btn" + id);
  pNom.innerHTML = inputValueNom;
  pQte.innerHTML = inputValueQte;

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id == id) {
      e.target.setAttribute("style", "display:none;");
      updateBtnTD.innerHTML = createBtns;
    }
  });
}

function saveBtn(id) {
  let updatedInputNom = document.querySelector(".nom" + id);
  let updatedInputQte = document.querySelector(".qte" + id);

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom: updatedInputNom.value,
      qte: updatedInputQte.value,
    }),
  }).then((res) => res.json());
}

function cancelBtn() {
  location.reload();
}
