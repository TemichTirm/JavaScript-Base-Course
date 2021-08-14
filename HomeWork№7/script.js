const SERVER_URL = "";

window.addEventListener("load", init);

// Инициализация страницы, вывод списка товаров
function init() {  
    productList.createProductList();
    const rows = document.getElementById("listOfProducts").childNodes;
    for (let row of rows) {
        let cells = row.childNodes;
        for (let i = 0; i < cells.length-1; i++) {
            cells[i].addEventListener("click", onClickRowHandler);
        };
    };
    let openCartWindowButton = document.getElementById("openCartWindowButton");
    openCartWindowButton.addEventListener('click', openCartWindow); 
    let form = document.getElementsByTagName("form")[0];
    form.action = SERVER_URL;
    form.reset();
};

// ____________________________________________________________________________________________________________________________________________________________
// Раздел объектов и функций для работы с товарами и корзиной

// Создание класса Product с публичными свойствами и функциями
class Product {
    constructor(id, productName, brand, price, quantity) {
        this.id = id;
        this.productName = productName;
        this.brand = brand;
        this.price = price;
        this.quantity = quantity;
    };
};

// Создание списка товаров и инициализация девяти продуктов
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

    // Получение объекта товара по его ID
    getProductById: function(id) {
        let product = this.products.find(product => product.id === id);
        let newProduct = new Product();
        for (let prop in product) {
            newProduct[prop] = product[prop];
        };
        return newProduct;
    },

    // Получение наименования и бренда товара
    getProductName: function(id) {
        let product = this.products.find(product => product.id === id);
        return product.productName + ", " + product.brand;
    },
    
    // Функция формирования списка товаров
    createProductList: function() {
        let productList = document.getElementsByTagName("tbody")[0];
        for (let product of this.products) {
            let newProduct = document.createElement("tr");
            productList.appendChild(newProduct);
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
        };
    },
};

// Создание объекта корзина, содержащей список выбранных товаров
let cart = {
    products: [],

    // Функция добавления товара в корзину
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

    // Функция получения количества товаров, находящихся в корзине
    getQuantityOfProducts: function() {
        let totalQuantity = 0;
        for (let product of this.products) {
            totalQuantity += product.quantity;
        };
        return totalQuantity;
    },

    // Функция получения общей стоимости товаров, находящихся в корзине
    getTotalPrice: function() {
        let totalPrice = 0;
        for (let product of this.products) {
            totalPrice += product.quantity * product.price;
        };
        return totalPrice;
    },
    
    // Функция обновления полей корзины
    updateCartFields: function () {
        let th = document.getElementById("numOfProduct");
        th.innerText = cart.getQuantityOfProducts();
        th = document.getElementById("totalPrice");
        th.innerText = cart.getTotalPrice();
    },
    
    // Функция формирования списка товаров в корзине в отдельном окне
    createCartTable: function() {
        let productTable = document.getElementById("cartList");
        productTable.innerHTML = "";
        let count = 0;
        for (let product of this.products) {
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
            deleteFromCart.className = "addToCartColumn";
    
            let deleteFromCartButton = document.createElement("a");
            deleteFromCartButton.className = "buttonBuy";
            deleteFromCartButton.title = "Удалить из корзины";
            deleteFromCartButton.addEventListener('click', deleteFromCartButtonClick);
            deleteFromCart.appendChild(deleteFromCartButton).innerHTML = "<img class=\"addToCartPicture\" src = \"images/delete-from-cart.png\">"
            newProduct.appendChild(deleteFromCart);
        }
        document.getElementById("productsQuantity").innerText = cart.getQuantityOfProducts();
        document.getElementById("totalCost").innerText = cart.getTotalPrice();    
    },
};

// ____________________________________________________________________________________________________________________________________________________________
// Раздел обработчиков событий

// Установка обработчика клика мышки на эскизы картинок
function setImagesClickHandler() {
    let thumbnails = document.getElementsByClassName("thumbnails")
    for (let thubnail of thumbnails) {
        thubnail.addEventListener("click", onCliclImage);
    };
};

// Функция обработки нажатия на кнопку "положить в корзину"
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
    cart.updateCartFields();
};

// Функция открытия отдельного окна подтверждения покупки
function openConfirmationWindow(event) {
    const buyConfirmationWindow = document.getElementById("buyConfirmationWindow");
    const span = document.getElementById("confirmationWindowClose");
    const form = document.getElementsByTagName("form")[0];
    const okButton2 = document.getElementById("okButton2");
    okButton2.addEventListener("click", confirmationWindowClose);
    buyConfirmationWindow.style.display = "block";
    event.preventDefault();
    form.reset();
    window.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            confirmationWindowClose();
        }
    }); 
    span.addEventListener("click", onClickSpan);
    cart.products = [];
};

// Функция обработки нажатия на кнопку закрывания окна
function onClickSpan(event) {
    switch (event.target.id) {
        case "galleryClose":
            galleryClose();
            break;
        case "cartClose":
            cartClose();
            break;
        case "infoClose":
            infoClose();
            break;
        case "confirmationWindowClose":
            confirmationWindowClose()
            break;
    }
    buyConfirmationWindow.style.display = "none";
};

// Функция закрытия окна Галереи
function galleryClose() {
    gallery.style.display = "none";
};

// Функция закрытия окна Корзины
function cartClose() {
    const cartWindow = document.getElementById("cart");
    cartWindow.style.display = "none";    
    cart.updateCartFields();
};

function infoClose() {    
    infoWindow.style.display = "none";
    cartClose();
};

function confirmationWindowClose() {
    cartClose()
    buyConfirmationWindow.style.display = "none";
    commentsField.style.display = "none";
};

// Функция открытия отдельного окна корзины
function openCartWindow(event) {
    const cartWindow = document.getElementById("cart");
    const span = document.getElementById("cartClose");
    const cartListField = document.getElementById("cartListField");
    const deliveryField = document.getElementById("deliveryField");
    const nextStepButton = document.getElementById("nextStepButton");

    cartWindow.style.display = "block";
    span.addEventListener("click", onClickSpan);
    window.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            cartClose();
        }
    });    
    cartListField.style.display = "block";
    deliveryField.style.display = "none";
    nextStepButton.addEventListener('click', openDeliveryForm);
    cart.createCartTable();
};

// Функция проверки заполнения обязательных полей формы
function checkFormFill() {
    let inputs = document.getElementsByTagName("input");
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if ((inputs[i].value === "") && (inputs[i].required)) {
            inputs[i].style.border = "2px solid red";
            valid = false;
        }
        else {
            inputs[i].style.border = "";
        }
    };
    return valid;
};

// Функция открытия формы комментариев
function openCommentsWindow() {    
    deliveryField.style.display = "none";        
    const commentsField = document.getElementById("commentsField");
    const prevStepButton2 = document.getElementById("prevStepButton2");
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", openConfirmationWindow)
    prevStepButton2.addEventListener("click", openDeliveryForm);
    commentsField.style.display = "block";
}


// Функция добавления события для перехода к окну комментариев при условии заполнения обязательных полей формы
function addOnClickEvent() {
    if (checkFormFill()) {
        nextStepButton2.addEventListener("click", openCommentsWindow)
    };
};

// Функция открытия формы для заполнения адреса доставки
function openDeliveryForm() {
    if (cart.getQuantityOfProducts() !== 0) {
        const nextStepButton2 = document.getElementById("nextStepButton2");        
        const prevStepButton = document.getElementById("prevStepButton");
        prevStepButton.addEventListener("click", openCartWindow);
        nextStepButton2.addEventListener("mouseover", addOnClickEvent)
        cartListField.style.display = "none";
        deliveryField.style.display = "block";
        commentsField.style.display = "none"; 
        deliveryField.addEventListener("mouseover", checkFormFill)       
    }
    else {
        const infoWindow = document.getElementById("infoWindow");
        const close = document.getElementById("infoClose");   
        const okButton = document.getElementById("okButton");   

        okButton.addEventListener("click", infoClose);
        infoWindow.style.display = "block";
        close.addEventListener("click", onClickSpan);
        window.addEventListener("keydown", function(event) {
            if (event.key === "Escape") {
                infoClose();
            }
        });  
    } 
};

// Функция обработки нажатия кнопки "удалить из корзины"
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
    cart.createCartTable();
};

// Функция обработки клика на картинке эскиза
function onCliclImage(event) { 
    let path = event.target.src;
    let str = `<img id="image" class="mainImage" src="${path}">`
    galleryMain.innerHTML = str;
    let thumbnails = event.target.parentNode.childNodes;
    for (let thumbnal of thumbnails) {
        thumbnal.setAttribute("data-content", "noFocus");
    }
    event.target.setAttribute("data-content", "focus");
};

// Функция обработки нажатия на строке товара, для открытия окна Галереи с картинками и эскизами
function onClickRowHandler(event) {
    const gallery = document.getElementById("gallery");  
    const span = document.getElementById("galleryClose");
    const thumbnailsWindow = document.getElementById("thumbnailsWindow");
    const galleryMain = document.getElementById("galleryMain");
    const header = document.getElementById("header");
    const id = +event.target.parentNode.childNodes[0].innerText;
    window.addEventListener("keydown", keyDownHandler);
    
    gallery.style.display = "block";
    header.innerHTML = `<h3>${productList.getProductName(id)}</h3>`;
    span.addEventListener("click", onClickSpan);
    thumbnailsWindow.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        let path = `images/gallery/${id}/${id}_${i}.jpg`;
        if ((id === 2 || id === 6) && i > 3) {
            break;
        }
        let element = document.createElement("img");
        element.setAttribute("data-content", "noFocus");
        if (i === 1) {
            let str = `<img id="image" class="mainImage" src="${path}">`;
            galleryMain.innerHTML = str;
            element.setAttribute("data-content", "focus");
        }
        element.id = `image-thumbnail-${i}`;
        element.className = "thumbnails";
        element.src = `${path}`;
        thumbnailsWindow.appendChild(element);
    };
    setImagesClickHandler();
};

// Функция обработки нажатия клавиш
function keyDownHandler(event) {
    const key = event.key;
    let changePosition = 0;
    switch (key) {
        case "ArrowLeft":
            changePosition = -1;
            break;
        case "ArrowRight":
            changePosition = 1;
            break;
        case "Escape":
            galleryClose();
            break;
        default:
            changePosition = 0;
    }
    if (changePosition !== 0) {
        const thumbnails = document.getElementById("thumbnailsWindow").childNodes;
        const galleryMain = document.getElementById("galleryMain");
        for (let i = 0; i < thumbnails.length; i++) {
            let isFocus = thumbnails[i].getAttribute("data-content") === "focus";
            if (isFocus) {
                let newPosition;
                switch (changePosition) {
                    case -1:
                        if (i === 0) {
                            newPosition = thumbnails.length - 1;
                        }
                        else {
                            newPosition = i - 1;
                        };
                        break;
                    case 1:
                        if (i === thumbnails.length - 1) {
                            newPosition = 0;
                        }
                        else {
                            newPosition = i + 1;
                        };
                        break;     
                    };
                    thumbnails[newPosition].setAttribute("data-content", "focus");
                    thumbnails[i].setAttribute("data-content", "noFocus");
                let path = thumbnails[newPosition].src;
                let str = `<img id="image" class="mainImage" src="${path}">`
                galleryMain.innerHTML = str;                
                break;
            };
        };
    };
};