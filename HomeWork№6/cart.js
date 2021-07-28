
// Создание класса Product с публичными свойствами и функциями
function Product(id, productName, brand, price, quantity) {
    this.id = id;
    this.productName = productName;
    this.brand = brand;
    this.price = price;
    this.quantity = quantity;
};

// Создание корзины и инициализация пяти продуктов
let productList = {
    products: [
        new Product(id = 1, productName = "Туфли мужские", brand = "Carlo Pazolini", price = 100),
        new Product(id = 2, productName = "Шляпа", brand = "Borsalino", price = 20),
        new Product(id = 3, productName = "Пальто женское", brand = "Finn Flare", price = 300),
        new Product(id = 4, productName = "Сорочка", brand = "Henderson", price = 80),
        new Product(id = 5, productName = "Футболка", brand = "Lacoste", price = 40),
        new Product(id = 6, productName = "Галстук", brand = "Henderson", price = 15),
        new Product(id = 7, productName = "Брюки", brand = "O'stin", price = 180),
        new Product(id = 8, productName = "Платье", brand = "D&G", price = 250),
        new Product(id = 9, productName = "Сумочка", brand = "GUCCI", price = 500),
    ],

    getProductById: function(id) {
        let product = this.products.find(product => product.id === id);
        let newProduct = new Product();
        for (let prop in product) {
            newProduct[prop] = product[prop];
        }
        return newProduct;
    },
};

let cart = {
    products: [],

    addProduct: function(newProduct) {
        let existProduct = this.products.find(product => product.id === newProduct.id);
        if (existProduct === undefined) {
            newProduct.quantity = 1;
            this.products[this.products.length] = newProduct;
        }
        else {
            existProduct.quantity++
        }
    },

    getQuantityOfProducts: function() {
        let totalQuantity = 0;
        for (let product of this.products) {
            totalQuantity += product.quantity;
        }
        return totalQuantity;
    },

    getTotalPrice: function() {
        let totalPrice = 0;
        for (let product of this.products) {
            totalPrice += product.quantity * product.price;
        }
        return totalPrice;
    },
};

function addToCartButtonClick(event) {
    let target = event.target;
    let row;
    if (target.localName === "a") {
        row = target.parentNode.parentNode;
    }
    else {
        row = target.parentNode.parentNode.parentNode;
    }
    let id = +row.childNodes[0].innerText;
    cart.addProduct(productList.getProductById(id));
    updateCartFields();
};

function updateCartFields () {
    let th = document.getElementById("numOfProduct");
    th.innerText = cart.getQuantityOfProducts();
    th = document.getElementById("totalPrice");
    th.innerText = cart.getTotalPrice();
}

function createProductTable() {
    let productTable = document.getElementsByTagName("tbody")[0];
    for (let product of productList.products) {
        let newProduct = document.createElement("tr");
        productTable.appendChild(newProduct);
        for (let prop in product) {
            if (prop === "quantity") {
                continue
            }
            let td = document.createElement("td");
            if (prop === "productName" || prop === "brand") {
                td.style = "text-align: left; padding: 5px;";
            }
            newProduct.appendChild(td).innerHTML = product[prop];
        }
        let addToCart = document.createElement("td");
        let addToCartButton = document.createElement("a");
        addToCart.className = "addToCartColumn";
        addToCartButton.className = "buttonBuy";
        addToCartButton.title = "Добавить в корзину";
        addToCartButton.addEventListener('click', addToCartButtonClick);
        addToCart.appendChild(addToCartButton).innerHTML = "<img class=\"addToCartPicture\" src=\"images/full-cart-light.png\">"
        newProduct.appendChild(addToCart);
    }
};

function openCartWindow(event) {
    let cartWindow = document.getElementById("cartWindow");
    let span = document.getElementsByClassName("close")[0];
    cartWindow.style.display = "block";
    span.addEventListener("click", onClickSpan);
    if (cart.getQuantityOfProducts() !== 0) {
        let openConfirmationWindowButton = document.getElementById("openConfirmationWindowButton");
        openConfirmationWindowButton.addEventListener('click', openConfirmationWindow);
    }
    createCartTable();
};

function openConfirmationWindow() {
    let buyConfirmationWindow = document.getElementById("buyConfirmationWindow");
    let span = document.getElementsByClassName("close")[1];
    buyConfirmationWindow.style.display = "block";
    span.addEventListener("click", onClickSpan);
    cart.products = [];
    let openConfirmationWindowButton = document.getElementById("openConfirmationWindowButton");
    openConfirmationWindowButton.removeEventListener('click', openConfirmationWindow);

}

function onClickSpan() {
    cartWindow.style.display = "none";
    buyConfirmationWindow.style.display = "none";
    updateCartFields();
};

function createCartTable() {
    let productTable = document.getElementById("cartList");
    productTable.innerHTML = "";
    let count = 0;
    for (let product of cart.products) {
        let newProduct = document.createElement("tr");
        productTable.appendChild(newProduct);
        for (let prop in product) {
            let td = document.createElement("td");
            if (prop === "productName" || prop === "brand") {
                td.style = "text-align: left; padding: 5px;";
            }
            if (prop === "id") {
                count++;
                newProduct.appendChild(td).innerHTML = count;
            }
            else {
                newProduct.appendChild(td).innerHTML = product[prop];
            }
        }
        let cost = document.createElement("td");
        newProduct.appendChild(cost).innerHTML = product.quantity * product.price;
        let deleteFromCart = document.createElement("td");
        let deleteFromCartButton = document.createElement("a");
        deleteFromCart.className = "addToCartColumn";
        deleteFromCartButton.className = "buttonBuy";
        deleteFromCartButton.title = "Удалить из корзины";
        deleteFromCartButton.addEventListener('click', deleteFromCartButtonClick);
        deleteFromCart.appendChild(deleteFromCartButton).innerHTML = "<img class=\"addToCartPicture\" src = \"images/delete-from-cart.png\">"
        newProduct.appendChild(deleteFromCart);
    }
    document.getElementById("productsQuantity").innerText = cart.getQuantityOfProducts();
    document.getElementById("totalCost").innerText = cart.getTotalPrice();    
};

function deleteFromCartButtonClick (event) {
    let target = event.target;
    let row;
    if (target.localName === "a") {
        row = target.parentNode.parentNode;
    }
    else {
        row = target.parentNode.parentNode.parentNode;
    }
    let position = +row.childNodes[0].innerText;
    let quantity = cart.products[position-1].quantity;
    if (quantity > 1) {
        cart.products[position-1].quantity--;
    }
    else {
        cart.products.splice(position-1, 1);
    }
    createCartTable();
};

function onCliclImage(event) {
    let path = event.target.src;
    const galery = document.getElementsByClassName("galleryContent")[0];
    let str = `<img id="image" class="mainImage" src="${path}">`
    galery.innerHTML = str;
};

window.addEventListener("load", init);

function setImagesClickHandler() {
    let thumbnails = document.getElementsByClassName("thumbnails")
    for (let thubnail of thumbnails) {
        thubnail.addEventListener("click", onCliclImage);
    };
};

function init() {
    createProductTable();
    const rows = document.getElementById("list-of-products").childNodes;
    for (let row of rows) {
        let cells = row.childNodes;
        for (let i = 0; i < cells.length-1; i++) {
            cells[i].addEventListener("mouseover", onFocusRowHandler);
        };
    };   
};

function onFocusRowHandler(event) {    
    let thumbnailsWindow = document.getElementsByClassName("thumbnailsWindow")[0];
    let galleryContent = document.getElementsByClassName("galleryContent")[0];
    thumbnailsWindow.innerHTML = "";
    let id = +event.target.parentNode.childNodes[0].innerText;
    for (let i = 1; i <= 5; i++) {
        let path = `images/galery/${id}/${id}_${i}.jpg`;
        if ((id === 2 || id === 6) && i > 3) {
            break;
        }
        let element = document.createElement("img");
        if (i === 1) {
            let str = `<img id="image" class="mainImage" src="${path}">`;
            galleryContent.innerHTML = str;
        }
        element.id = `image-thumbnail-${i}`;
        element.className = "thumbnails";
        element.src = `${path}`;
        thumbnailsWindow.appendChild(element);
    };
    setImagesClickHandler();
};