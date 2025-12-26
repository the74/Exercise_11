// Выпадающее меню
document.addEventListener('DOMContentLoaded', function() {
    // Элементы выпадающего меню
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Открытие/закрытие выпадающего меню на десктопе
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // На десктопе - по hover
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', () => {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            });
        }
        // На мобильных - по клику
        else {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Закрыть все другие выпадающие меню
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                // Переключить текущее
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Обработка кликов по пунктам выпадающего меню
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            const pageId = this.getAttribute('href').substring(1);
            
            // Перейти на страницу меню
            showPage(pageId);
            
            // Активировать соответствующую категорию
            setTimeout(() => {
                const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
                if (categoryBtn) {
                    categoryBtn.click();
                    
                    // Прокрутить к меню
                    document.querySelector('.menu-categories').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
            
            // Закрыть выпадающее меню на мобильных
            if (window.innerWidth <= 768) {
                const dropdown = this.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
                
                // Закрыть мобильное меню
                const navMenu = document.getElementById('mainNav');
                navMenu.classList.remove('show');
            }
        });
    });
    
    // Закрытие выпадающих меню при клике вне их
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Обновление иконки стрелки при изменении размера
    function updateDropdownArrows() {
        const chevrons = document.querySelectorAll('.dropdown-toggle .fa-chevron-down');
        chevrons.forEach(chevron => {
            if (window.innerWidth <= 768) {
                chevron.style.transform = 'none';
            }
        });
    }
    
    window.addEventListener('resize', updateDropdownArrows);
    updateDropdownArrows();
});
    // Функция для показа страницы
    function showPage(pageId) {
        console.log('Показываем страницу:', pageId);

        // Скрыть все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Показать выбранную страницу
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.style.display = 'block';

            // Прокрутить вверх
            window.scrollTo(0, 0);
        }

        // Обновить активную ссылку в навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + pageId) {
                link.classList.add('active');
            }
        });

        // Обновить активную ссылку в футере
        document.querySelectorAll('.footer-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + pageId) {
                link.classList.add('active');
            }
        });
    }

    // Обработчик для всех навигационных ссылок
    function handleNavigationClick(e) {
        e.preventDefault();
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
            const pageId = href.substring(1);
            showPage(pageId);

            // Закрыть мобильное меню
            const navMenu = document.getElementById('mainNav');
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        }
    }

    // Добавить обработчики для навигационных ссылок
    document.querySelectorAll('.nav-link, .footer-nav-link, .view-menu-btn, .about-order-btn').forEach(link => {
        link.addEventListener('click', handleNavigationClick);
    });

    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('show');
        });
    }

    // Фильтрация меню
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.pizza-card[data-category]');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удалить активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Добавить активный класс текущей кнопке
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Показать/скрыть элементы меню
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Корзина
    let cart = [];

    // Функция обновления корзины
    function updateCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalPrice = document.getElementById('cartTotalPrice');
        const cartCount = document.getElementById('cartCount');

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalCount = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalCount += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="decrease-item" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-item" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        if (cartTotalPrice) cartTotalPrice.textContent = total;
        if (cartCount) cartCount.textContent = totalCount;

        // Добавить обработчики для кнопок в корзине
        document.querySelectorAll('.decrease-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });

        document.querySelectorAll('.increase-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Добавление товаров в корзину
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));

            // Проверить, есть ли уже такой товар в корзине
            const existingItemIndex = cart.findIndex(item => item.name === name);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();

            // Показать уведомление
            showNotification(`${name} добавлен в корзину!`);
        });
    });

    // Управление корзиной
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', function() {
            cartModal.style.display = 'block';
            if (cartOverlay) cartOverlay.style.display = 'block';
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', function() {
            if (cartModal) cartModal.style.display = 'none';
            if (cartOverlay) cartOverlay.style.display = 'none';
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            if (cartModal) cartModal.style.display = 'none';
            this.style.display = 'none';
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cart.length > 0 && confirm('Очистить корзину?')) {
                cart = [];
                updateCart();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Корзина пуста! Добавьте товары в корзину.');
                return;
            }

            showPage('contact');

            if (cartModal) cartModal.style.display = 'none';
            if (cartOverlay) cartOverlay.style.display = 'none';
        });
    }

    // Обработка формы заказа
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (cart.length === 0) {
                alert('Корзина пуста! Добавьте товары в корзину.');
                return;
            }

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const comments = document.getElementById('comments').value;

            // Формировать список товаров
            let orderDetails = 'Ваш заказ:\n\n';
            cart.forEach(item => {
                orderDetails += `${item.name} - ${item.quantity} шт. × ${item.price} ₽ = ${item.quantity * item.price} ₽\n`;
            });

            const cartTotalPrice = document.getElementById('cartTotalPrice');
            orderDetails += `\nИтого: ${cartTotalPrice ? cartTotalPrice.textContent : '0'} ₽`;
            orderDetails += `\n\nДанные для доставки:`;
            orderDetails += `\nИмя: ${name}`;
            orderDetails += `\nТелефон: ${phone}`;
            orderDetails += `\nАдрес: ${address}`;
            if (comments) {
                orderDetails += `\nКомментарий: ${comments}`;
            }

            alert(`Спасибо за заказ, ${name}!\n\n${orderDetails}\n\nМы перезвоним вам в течение 5 минут для подтверждения заказа.`);

            // Очистить корзину и форму
            cart = [];
            updateCart();
            orderForm.reset();

            // Вернуться на главную страницу
            showPage('home');
        });
    }

    // Функция показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Инициализация корзины
    updateCart();

    // Показать главную страницу по умолчанию
    showPage('home');
});
// Форма трудоустройства с отправкой в Telegram
document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация Telegram бота
    const TELEGRAM_BOT_TOKEN = '8582441779:AAEaxpo9u330uomaFc75Wk5OseKncQ2scwk';
    const TELEGRAM_CHAT_ID = '1449136849';

    // Элементы формы трудоустройства
    const openJobFormBtn = document.getElementById('openJobFormBtn');
    const jobFormContainer = document.getElementById('jobFormContainer');
    const closeJobFormBtn = document.getElementById('closeJobFormBtn');
    const jobForm = document.getElementById('jobForm');

    // Открытие формы трудоустройства
    if (openJobFormBtn && jobFormContainer) {
        openJobFormBtn.addEventListener('click', function() {
            jobFormContainer.style.display = 'block';

            // Плавная прокрутка к форме
            jobFormContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Закрытие формы трудоустройства
    if (closeJobFormBtn && jobFormContainer) {
        closeJobFormBtn.addEventListener('click', function() {
            jobFormContainer.style.display = 'none';
        });
    }

    // Валидация телефона
    const jobPhoneInput = document.getElementById('job-phone');
    if (jobPhoneInput) {
        jobPhoneInput.addEventListener('input', function(e) {
            let input = e.target.value.replace(/\D/g, '');

            if (input.length > 0) {
                // Формат: +7 (XXX) XXX-XX-XX
                if (input[0] === '7' || input[0] === '8') {
                    input = input.substring(1);
                }

                let formatted = '+7 ';

                if (input.length > 0) {
                    formatted += '(' + input.substring(0, 3);
                }
                if (input.length >= 3) {
                    formatted += ') ' + input.substring(3, 6);
                }
                if (input.length >= 6) {
                    formatted += '-' + input.substring(6, 8);
                }
                if (input.length >= 8) {
                    formatted += '-' + input.substring(8, 10);
                }

                this.value = formatted;
            }
        });

        // Проверка при потере фокуса
        jobPhoneInput.addEventListener('blur', function() {
            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Введите телефон в формате: +7 (999) 123-45-67');
            } else {
                this.style.borderColor = '#ddd';
                clearFieldError(this);
            }
        });
    }

    // Валидация email
    const jobEmailInput = document.getElementById('job-email');
    if (jobEmailInput) {
        jobEmailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Введите корректный email адрес');
            } else {
                this.style.borderColor = '#ddd';
                clearFieldError(this);
            }
        });
    }

    // Валидация ФИО
    const jobNameInput = document.getElementById('job-name');
    if (jobNameInput) {
        jobNameInput.addEventListener('blur', function() {
            if (this.value.trim().split(' ').length < 2) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Введите фамилию, имя и отчество');
            } else {
                this.style.borderColor = '#ddd';
                clearFieldError(this);
            }
        });
    }

    // Функции для показа ошибок
    function showFieldError(field, message) {
        clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
        `;
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Обработка отправки формы
    if (jobForm) {
        jobForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Проверка валидности формы
            if (!validateForm()) {
                return;
            }

            // Собираем данные формы
            const formData = new FormData(jobForm);
            const formDataObject = {};

            for (let [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }

            // Добавляем дату отправки
            formDataObject.timestamp = new Date().toLocaleString('ru-RU');

            // Показываем индикатор загрузки
            const submitBtn = jobForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;

            // Скрываем предыдущие статусы
            const oldStatus = jobForm.querySelector('.form-status');
            if (oldStatus) {
                oldStatus.remove();
            }

            // Показываем статус отправки
            const statusDiv = document.createElement('div');
            statusDiv.className = 'form-status loading';
            statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка заявки в Telegram...';
            jobForm.appendChild(statusDiv);

            try {
                // Сохраняем данные в localStorage
                await saveToLocalStorage(formDataObject);

                // Отправляем в Telegram
                await sendToTelegram(formDataObject);

                // Показываем успешное сообщение
                statusDiv.className = 'form-status success';
                statusDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i> Заявка успешно отправлена!<br><br>
                    <small>Мы свяжемся с вами в течение 3 рабочих дней.</small>
                `;

                // Очищаем форму через 3 секунды
                setTimeout(() => {
                    jobForm.reset();
                    statusDiv.remove();
                    jobFormContainer.style.display = 'none';
                }, 3000);

            } catch (error) {
                console.error('Ошибка отправки:', error);

                // Показываем сообщение об ошибке
                statusDiv.className = 'form-status error';
                statusDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i> Ошибка отправки!<br><br>
                    <small>Пожалуйста, свяжитесь с нами по телефону: +7 (928) 460-78-60</small>
                `;
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Функция валидации формы
    function validateForm() {
        let isValid = true;

        // Проверка обязательных полей
        const requiredFields = jobForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                showFieldError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });

        // Проверка телефона
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (jobPhoneInput.value && !phoneRegex.test(jobPhoneInput.value)) {
            jobPhoneInput.style.borderColor = '#e74c3c';
            showFieldError(jobPhoneInput, 'Введите телефон в формате: +7 (999) 123-45-67');
            isValid = false;
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (jobEmailInput.value && !emailRegex.test(jobEmailInput.value)) {
            jobEmailInput.style.borderColor = '#e74c3c';
            showFieldError(jobEmailInput, 'Введите корректный email адрес');
            isValid = false;
        }

        // Проверка ФИО
        if (jobNameInput.value && jobNameInput.value.trim().split(' ').length < 2) {
            jobNameInput.style.borderColor = '#e74c3c';
            showFieldError(jobNameInput, 'Введите фамилию, имя и отчество');
            isValid = false;
        }

        return isValid;
    }

    // Функция сохранения в localStorage
    async function saveToLocalStorage(formData) {
        // Сохраняем данные в localStorage
        const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        formData.localTimestamp = new Date().toISOString();
        formData.id = Date.now();
        applications.push(formData);
        localStorage.setItem('jobApplications', JSON.stringify(applications));

        console.log('Заявка сохранена в localStorage:', formData);

        return Promise.resolve();
    }

    // Функция отправки в Telegram
    async function sendToTelegram(formData) {
        // Формируем сообщение для Telegram
        const message = formatTelegramMessage(formData);

        // Отправляем сообщение в Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Telegram API error: ${result.description || 'Unknown error'}`);
        }

        console.log('Сообщение отправлено в Telegram:', result);
        return result;
    }

    // Функция форматирования сообщения для Telegram
    function formatTelegramMessage(formData) {
        return `🎯 <b>НОВАЯ ЗАЯВКА НА РАБОТУ</b>

👤 <b>Кандидат:</b> ${formData.fio || 'Не указано'}
📅 <b>Дата рождения:</b> ${formData.birthdate || 'Не указано'}
🏙️ <b>Город:</b> ${formData.city || 'Не указано'}

📞 <b>Телефон:</b> ${formData.phone || 'Не указано'}
📧 <b>Email:</b> ${formData.email || 'Не указано'}

💼 <b>Должность:</b> ${formData.position || 'Не указано'}
⏰ <b>График:</b> ${formData.schedule || 'Не указано'}

📊 <b>Опыт работы:</b>
${formData.experience || 'Не указано'}

🎓 <b>Образование:</b>
${formData.education || 'Не указано'}

🛠️ <b>Навыки:</b>
${formData.skills || 'Не указано'}

✅ <b>Готов к собеседованию:</b> ${formData.ready_for_interview ? 'Да' : 'Нет'}

⏱️ <b>Отправлено:</b> ${formData.timestamp}
🆔 <b>ID заявки:</b> ${formData.id || 'N/A'}

#заявка #работа #пиццерия`;
    }

    // Инициализация даты рождения (устанавливаем максимальную дату - 16 лет назад)
    const birthdateInput = document.getElementById('job-birthdate');
    if (birthdateInput) {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
        birthdateInput.max = maxDate.toISOString().split('T')[0];

        // Устанавливаем подсказку
        birthdateInput.title = 'Минимальный возраст: 16 лет';
    }

    // Добавляем иконку Telegram в форму для наглядности
    const formTitle = document.querySelector('.job-form-section h3');
    if (formTitle) {
        const telegramIcon = document.createElement('i');
        telegramIcon.className = 'fab fa-telegram-plane';
        telegramIcon.style.cssText = `
            color: #0088cc;
            margin-left: 10px;
            font-size: 20px;
        `;
        telegramIcon.title = 'Заявки отправляются в Telegram';
        formTitle.appendChild(telegramIcon);
    }
});

