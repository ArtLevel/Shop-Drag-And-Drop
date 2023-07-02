// * Новый блок кода, отвечает за добавление нового продукта в список
// Находим нужные элементы
const formProduct = document.querySelector('#form-product')
const buttonAddingProduct = formProduct.querySelector('#button-add-product')
const buttonDeleteProduct = formProduct.querySelector('#button-delete-product')
const formError = document.querySelector('#form-error')

// Находим поле fieldMoney и поле fieldProduct
const fieldProduct = document.querySelector('#field-product')
const fieldMoney = document.querySelector('#field-money')
let fieldMoneyValue = 0

// Placeholders
const placeholders = document.querySelectorAll('#placeholder')
const placeholderShoppingList = document.querySelector('[data-placeholder-shopping-list]')
const placeholderShoppingDelete = document.querySelector('[data-placeholder-shopping-delete]')

// При клике на кнопку добавить продукт, добавляем его если все уловия true, иначе выводим ошибку
// Проверяем есть ли место для него
buttonAddingProduct.addEventListener('click', (event) => {
	// Обнуляем ошибки и убираем у event стандартное поведение
	event.preventDefault()
	let offsetHeightBlockError = false
	formError.innerHTML = ''

	// Проверяем если поле fieldMoney не заполнено, выдаём ошибку
	if(fieldMoney.value === '') {
		formError.innerHTML += '<strong><p style="color: #229efd;">Вы не ввели сколько у вас на счету денег ! (Буквы вводить нельзя)</p></strong>'
	}

	// Проверяем есть ли место для него
	for(const placeholder of placeholders) {
		if(placeholder.offsetHeight >= 598) {
			offsetHeightBlockError = true
		}
	}

	// Если ошибок нет и высота позволяет добавить ещё один элемент, выполняем действия: 
	if(!offsetHeightBlockError) {
		// Проверяем если человек не заполнил поле, или добавил слишком много текста выдаём ошибку
		if(fieldProduct.value !== '' && fieldProduct.value.length <= 14) {
			// Создаём элемент в DOM и даём ему: class, id, draggable, textContent
			const fieldProductElement = document.createElement('div')
			fieldProductElement.className = 'item'
			fieldProductElement.id = 'item'
			fieldProductElement.draggable = 'true'
			fieldProductElement.textContent = fieldProduct.value
			
			// Добавляем элемент в placeholderShoppingList
			placeholderShoppingList.append(fieldProductElement)
			// Очищаем поле input
			fieldProduct.value = ''
		} else {
			// Выдаём ошибку
			formError.innerHTML += '<strong><p style="color: red;">Вы не заполнили поле или ввели слишком много текста !</p></strong>'
		}
	} else {
		// Выдаём ошибку
		formError.innerHTML += '<strong><p style="color: #229efd;">Слишком большой список покупок ! <p style="color: #229efd;">(В одной колонке максимум 8 продуктов)</p></p></strong>'
	}
})


// При клике на кнопку удалить купленные продукты, выполняем действия:
buttonDeleteProduct.addEventListener('click', (event) => {
	// Даём event стандартное поведение, и очищаем от всего placeholderShoppingDelete
	event.preventDefault()
	placeholderShoppingDelete.innerHTML = ''
})


// * Новый блок кода, отвечает за drop и drag
buttonAddingProduct.addEventListener('click', (event) => {
	event.preventDefault()
	
	searchNewItemsAndHandingOnTheItemDragAndDrop()
})

// * Новый блок кода, отвечает за нахождение новых элементов, которых можно перетаскивать

function searchNewItemsAndHandingOnTheItemDragAndDrop() {
	// Находим все нужные элементы
	const items = document.querySelectorAll('#item')

	// Вешаем обработчики событий на каждый item
	for (const item of items) {
		item.addEventListener('dragstart', dragstart)
		item.addEventListener('dragend', dragend)
	}

	// Раскладываем NodeList (placeholders) на отдельные элементы (placeholder)
	for (const placeholder of placeholders) {
		placeholder.addEventListener('dragover', dragover)
		placeholder.addEventListener('dragenter', dragenter)
		placeholder.addEventListener('dragleave', dragleave)
		placeholder.addEventListener('drop', dragdrop)
	}

	// Функции которые отвечают за использование dragover и dragenter

	function dragstart(event) {
		event.target.classList.add('hold')
		setTimeout(() => {
			event.target.classList.add('hide')
		}, 0)
	}

	function dragend(event) {
		event.target.className = 'item'
	}

	// Функции для placehodler

	function dragover(event) {
		event.preventDefault()
	}

	function dragenter(event) {
		event.target.classList.add('hovered')
	}

	function dragleave(event) {
		event.target.classList.remove('hovered')
	}

	function dragdrop(event) {
		event.target.classList.remove('hovered')
		let objectDrop
		for(const item of items) {
			if(item.classList.contains('hold')) {
				objectDrop = item
			}
		}
		if(objectDrop !== undefined) {
			event.target.append(objectDrop)
		}
	}
}

// * Новый блок кода, отвечает за перемещением между списком покупок и магазином:

// Находим нужные элементы

const containers = document.querySelectorAll('[data-container]')
const buttonsShop = document.querySelectorAll('[data-shop-and-shop-list-and-admin]')

// NodeList => el
buttonsShop.forEach(el => {
	// При клике, выполняем следующее:
	el.addEventListener('click', (event) => {
		// Находим нужный нам контейнер
		const container = document.querySelector('#' + event.target.dataset.shopAndShopListAndAdmin)
		// Каждому container в containers даём класс hide (скрываем их)
		for(const container of containers) {
				container.classList.add('hide')
		}
		// Показываем нужный нам элемент
		container.classList.remove('hide')
		const wallet = document.querySelector('#wallet')

		// При переходе в магазин выводим значение кошелька
		if(fieldMoney.value !== '') {
			fieldMoneyValue = fieldMoney.value
		} else {
			fieldMoneyValue = 0
		}
		wallet.innerHTML = `Кошелёк: ${fieldMoneyValue} руб`
	})
})

// * Новый блок кода, отвечает за магазин

// Находим нужные элементы
const buttonCountProduct = document.querySelector('#button-count-product')
const buttonBuyProduct = document.querySelector('#button-buy-product')
const formErrorShop = document.querySelector('#form-error-shop')

// При клике на кнопку считать стоимость товара, считаем стоимость
buttonCountProduct.addEventListener('click', (event) => {
	event.preventDefault()
	const products = document.querySelector('[data-placeholder-basket]').querySelectorAll('[data-product]')
	formErrorShop.innerHTML = ''

	let price = 0

	for(const product of products) {
		price += Number(product.dataset.product)
	}

	// Записываем в localStorage цену товара, и оповещаем пользователя о цене товара
	localStorage.setItem('priceProduct', price)

	// Записываем в localStorage, что продукты посчитались
	localStorage.setItem('countProduct', true)

	formErrorShop.innerHTML += `<strong><p style="color: #229efd;">Стоимость продуктов: ${price} руб</p></strong>`

})

// Находим нужные элементы
const placeholderBasket = document.querySelector('[data-placeholder-basket]')

// При клике на кнопку купить, покупаем товар
buttonBuyProduct.addEventListener('click', (event) => {
	event.preventDefault()
	formErrorShop.innerHTML = ''
	const price = localStorage.getItem('priceProduct')
	const countProduct = localStorage.getItem('countProduct')

	// Проверяем если человек не посчитал цену продуктов, не даём ему их купить и выводим ошибку
	// Если же он подсчиталь цену продуктов даём ему их купить
	if(countProduct === 'true') {
		// Выполняем проверку если денег мало или товара вообще нет, выдаём оповещение

		if(Number(fieldMoneyValue) - Number(price) >= 0 && placeholderBasket.innerHTML !== '') {
			// Оповещаем пользователя о цене товара, и очищаем корзину
			formErrorShop.innerHTML += `<strong><p style="color: #229efd;">Вы купили продукты.<p style="color: #229efd;">Осталось ${Number(fieldMoneyValue) - Number(price)} руб, сэкономил - значит заработал !</p></p></strong>`
			wallet.innerHTML = `Кошелёк: ${Number(fieldMoneyValue) - Number(price)} руб`

			// Вычисляем сколько денег осталось и перезаписываем переменные
			fieldMoneyValue = Number(fieldMoneyValue) - Number(price)
			fieldMoney.value = Number(fieldMoneyValue) - Number(price)

			placeholderBasket.innerHTML = ''
			localStorage.clear()
		} else if(Number(fieldMoneyValue) - Number(price) < 0) {
			formErrorShop.innerHTML += `<strong><p style="color: #229efd;">Вам не хватило: ${-(Number(fieldMoneyValue) - Number(price))} руб</p></strong>`
		} else {
			formErrorShop.innerHTML += `<strong><p style="color: #229efd;">Товара в корзине нет</p></strong>`
		}
	} else {
		formErrorShop.innerHTML += `<strong><p style="color: red;">Вы не посчитали стоимость продуктов !</p></strong>`
	}
	localStorage.setItem('countProduct', false)
})


// * Новый блок кода, отвечает за админку:

// Находим нужные элементы
const formSignInAdmin = document.querySelector('#form-sign-in-admin')
const formErrorAdmin = document.querySelector('#form-error-admin')

const fieldLoginAdmin = formSignInAdmin.querySelector('#field-login-admin')
const fieldPasswordAdmin = formSignInAdmin.querySelector('#field-password-admin')

const loginAdmin = 'Admin'
const passwordAdmin = 'Lena1234'

const buttonSignInAdmin = formSignInAdmin.querySelector('button')
const roomAdmin = document.querySelector('#' + buttonSignInAdmin.dataset.signInAdmin)

// При клике на кнопку войти в админку, выполняем действия:
buttonSignInAdmin.addEventListener('click', (event) => {
	// Даём event стандартное поведение и очищаем ошибки
	event.preventDefault()
	formErrorAdmin.innerHTML = ''

		// Проверяем авторизован ли пользователь
		if(localStorage.getItem('signInAdmin') !== 'true') {
			// Проверяем, если пароль или логин не совпали с логином и паролем админа, выводим ошибку
			if(fieldLoginAdmin.value === loginAdmin && fieldPasswordAdmin.value === passwordAdmin) {

				// Каждому container в containers даём класс hide (скрываем их)
				for(const container of containers) {
					container.classList.add('hide')
				}

				// Показываем админку
				roomAdmin.classList.remove('hide')

				// Записываем в localStorage что пользователь авторизован
				localStorage.setItem('signInAdmin', 'true')
		
			} else {
				formErrorAdmin.innerHTML += `<strong><p style="color: red;">Логин или пароль не верен !</p></strong>`

				// Записываем в localStorage что пользователь не авторизован
				localStorage.setItem('signInAdmin', 'false')
			}
		} else if(localStorage.getItem('signInAdmin') === 'true'){
			// Каждому container в containers даём класс hide (скрываем их)
			for(const container of containers) {
				container.classList.add('hide')
			}
			// Показываем админку
			roomAdmin.classList.remove('hide')
		}
	
})

// * Новый блок кода, отвечает за добавление нового товара в магазин:

// Находим нужные элементы

const formRoomAdmin = document.querySelector('#form-room-admin')
const formErrorRoomAdmin = document.querySelector('#form-error-room-admin')

const fieldNameProduct = document.querySelector('#field-name-product')
const fieldPriceProduct = document.querySelector('#field-price-product')

const buttonAddingProductInShop = document.querySelector('#button-adding-product-in-shop')

const placeholderShop = document.querySelector('[data-placeholder-shop]')

// При нажатии на кнопку 'добавить продукт', выполняем следующее:
buttonAddingProductInShop.addEventListener('click', (event) => {

	event.preventDefault()
	formErrorRoomAdmin.innerHTML = ''

	// Проверяем не пустые ли input поля
	if(fieldNameProduct.value !== '' && fieldPriceProduct.value !== '') {
		// Даём event стандартное поведение и очищаем ошибки
		const fieldNameProductValue = fieldNameProduct.value
		const fieldPriceProductValue = fieldPriceProduct.value

		// Создаём элемент 'div' и даём ему всё необходимое
		const newProduct = document.createElement('div')
		newProduct.className = 'item'
		newProduct.id = 'item'
		newProduct.draggable = 'true'
		newProduct.textContent = `${fieldNameProductValue} (${fieldPriceProductValue})`
		newProduct.dataset.product = fieldPriceProductValue

		// Добавляем элемент newProduct в placeholderShop
		placeholderShop.append(newProduct)

		// Очищаем поля input
		fieldNameProduct.value = ''
		fieldPriceProduct.value = ''

		// Вызываем функцию dragAndDropFunctional, которая отвечает за нахождение новых элементов, которых можно перетаскивать
		searchNewItemsAndHandingOnTheItemDragAndDrop()

		// Говорим пользователю что продукт добавлен
		formErrorRoomAdmin.innerHTML += `<strong><p style="color: #229efd;">Продукт успешно добавлен !</p></strong>`
	} else {
		// Говорим пользователю что он не заполнил все поля
		formErrorRoomAdmin.innerHTML += `<strong><p style="color: red;">Вы не заполнили все поля !</p></strong>`
	}
})