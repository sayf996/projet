const productsList = document.querySelector(".product-list");
const addProduct = document.getElementById("add");
const productNom = document.getElementById("product");
const productQte = document.getElementById("quantity");
const url =
  "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/31/produits";

// undefined variable to use it to render Products in table
let output = "";

//Headers for the Table

let headers = `<tr>
  <th>ID</th>
  <th>Product Name</th>
  <th>Quantity</th>
  </tr>`;


//Function renderProducts to put products in table and Push it in HTML

function renderProducts(products) {
  products.forEach((product) => {
    output += ` 
      
    <tr id="${product.id}">
      <td>${product.id}</td>
      <td class="product-nom${product.id}">${product.nom}</td>
      <td class="product-qte${product.id}">${product.qte}</td>
      <td class="update-btn${product.id}">
        <button class="button button1" id="${product.id}" onclick ="updateItem(this.id)">Modify</button>
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



  //Function add to add a new product used for add button

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


// function deleteItem to delete product used for delete Button

function deleteItem(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => location.reload());
}



// Copy the API Json to Array in JS so we can use it in next functions

let jsonResult = "";

fetch(url)
  .then((res) => res.json())
  .then((data) => (jsonResult = data));



  // function renderResult to render table with buttons in HTML for searcnKeyword function 

let searchResult = "";
const resultDiv = document.querySelector(".search-res");

function renderResult(product) {
  searchResult += `<tr id="${product.id}">
  <td>${product.id}</td>
  <td class="product-nom${product.id}">${product.nom}</td>
  <td class="product-qte${product.id}">${product.qte}</td>
  <td class="update-btn${product.id}">
    <button class="button button1" id="${product.id}" onclick ="updateItem(this.id)">Modify</button>
  </td>
  <td>
    <button class="button button2" id= "${product.id}" onclick="deleteItem(this.id)">Delete</button>
  </td>
</tr>`;

  resultDiv.innerHTML = headers + searchResult;
}


// function to search for keyword in Json table used in Search Button
function searchKeyword() {
  let resultExists = false;
  searchResult = "";
  let searchvalue = document.getElementById("search-value").value;

// For loop to see if Keyword entered in search value exists in our Json Table

  for (let i = 0; i < jsonResult.length; i++) {
    if (jsonResult[i].nom.toLowerCase().includes(searchvalue.toLowerCase())) {
      renderResult(jsonResult[i]);
      resultExists = true;
    }
  }


  // If result wasnt found or no data entered in input 
  if (searchvalue.length == 0 || resultExists === false)
    resultDiv.innerHTML = `<td>No Result</td>`;
}



// renderCheck function is render result table after checking in checkId()  
let checkResult = "";
let checkTable = document.getElementById("check-res");

function renderCheck(products) {
  checkResult = `<tr><td>${products.id}</td>
<td>${products.nom}</td>
<td>${products.qte}</td></tr>`;
  checkTable.innerHTML = headers + checkResult;
}

// function to check if product exist by Id used in Check Button
function checkID() {
  let checkValue = document.getElementById("check-value").value;
  let statusIndi = document.getElementById("statusIndi");
  let checkExists = false;

// For loop to render table for matched ID and to make the status indicator Green

  for (let i = 0; i < jsonResult.length; i++) {
    if (jsonResult[i].id == checkValue) {
      renderCheck(jsonResult[i]);
      statusIndi.style.backgroundColor = "green";
      checkExists = true;
    }
  }

// If no ID match in checkID() makes the status indicator Red 
  if (!checkExists) {
    statusIndi.style.backgroundColor = "red";
    checkTable.innerHTML = `<td>No Result</td>`;
  }

//If no Input entered makes indicator back to Grey
  if (checkValue == 0) {
    statusIndi.style.backgroundColor = "grey";
    checkTable.innerHTML = `<td>Please enter a value</td>`;
  }
}


//updateItem(id) used for Modify Button

let inputValueNom = "";
let inputValueQte = "";
function updateItem(id) {
  let pNom = document.querySelector(".product-nom" + id);
  let pQte = document.querySelector(".product-qte" + id);


  // Making input tags for Qte and Nom of the pressed Btn ID

  inputValueNom =
    `<input type="text" class="nom${id}" value="` +
    pNom.textContent +
    `"></input>`;
  inputValueQte =
    `<input type="number" class="qte${id}" value="` +
    pQte.textContent +
    `"></input>`;

    //Create Cancel Button and Save Button

  let createBtns = `<button class= "button button7" onclick="cancelBtn()">✖</button> <button class="button button3" id="${id}"onclick="saveBtn(this.id)">Save</button>`;
  let updateBtnTD = document.querySelector(".update-btn" + id);
  pNom.innerHTML = inputValueNom;
  pQte.innerHTML = inputValueQte;


// Hide Modify Button onClick and add the other 2 buttons

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id == id) {
      e.target.setAttribute("style", "display:none;");
      updateBtnTD.innerHTML = createBtns;
    }
  });
}

// Method: "PUT" used for Save Button 
function saveBtn(id) {
  const updatedInputNom = document.querySelector(".nom" + id).value;
  const updatedInputQte = document.querySelector(".qte" + id).value;

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom: updatedInputNom,
      qte: updatedInputQte,
    }),
  }).then((res) => res.json());

  location.reload();
}

// CancelBtn() used for Cancel button
function cancelBtn() {
  location.reload();
}


//Function to delete item if null after update
function deleteIteamIfNull(JsonArray) {
  for (let i = 0; i < JsonArray.length; i++) {
    if (JsonArray[i].qte <= 0) {
      deleteItem(JsonArray[i].id);
      break;
    }
  }
}
fetch(url)
  .then((res) => res.json())
  .then((data) => deleteIteamIfNull(data));
