        const field = document.getElementById('name');
        const error = document.getElementById('nameError');


        field.addEventListener('blur', function() {
            validateField(this.value);
        });

        field.addEventListener('input', function() {
            // Сбрасываем ошибку при вводе
            if (this.value.length >= 2) {
                error.textContent = '';
                this.className = 'valid';
            } else {
                this.className = '';
            }
        });
        const nameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        function validateField(value) {
            let isValid = true;
            if (value.trim() == '') {
                error.textContent = 'Поле не может быть пустым';
                field.className = 'invalid';
                return false;
            } else if (value.length <= 3 || !(/\s/.test(value)) || value !== value.trim()) {
                error.textContent = 'Введите корректное ФИО';
                field.className = 'invalid';
                return false;
            } else {
                error.textContent = '';
                field.className = 'valid';
            }


            // Проверка email
            const email = document.getElementById('Email').value;
            const emailError = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email.trim() == '') {
                emailError.textContent = 'Email обязателен для заполнения';
                isValid = false;
            } else if (!emailRegex.test(email)) {
                emailError.textContent = 'Введите корректный email';
                isValid = false;
            } else {
                emailError.textContent = '';
            }

            return isValid;
        }
        
         const form = document.getElementById('Form');
        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');

        // Функция проверки российского номера
        function validateRussianPhone(phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            
            // Проверка длины
            if (cleanPhone.length !== 11) {
                return false;
            }
            
            // Проверка префикса (7 или 8)
            if (!cleanPhone.startsWith('7') && !cleanPhone.startsWith('8')) {
                return false;
            }
            
            // Проверка кода оператора (вторая цифра не может быть 0,1,2,3)
            if (/[0-3]/.test(cleanPhone[1])) {
                return false;
            }
            
            return true;
        }
        
        const agreeCheckbox = document.getElementById('agree');
        const agreeError = document.getElementById('agreeError');
        const checkboxGroup = document.getElementById('checkboxGroup');
       
        // Функция проверки галочки
        function validateCheckbox() {
            if (!agreeCheckbox.checked) {
                agreeError.style.display = 'block';
                checkboxGroup.classList.add('invalid');
                return false;
            } else {
                agreeError.style.display = 'none';
                checkboxGroup.classList.remove('invalid');
                return true;
            }
        }

        // Проверка при изменении состояния галочки
        agreeCheckbox.addEventListener('change', function() {
            validateCheckbox();
        });
        // Функция форматирования телефона
        function formatPhone(input) {
            let value = input.value.replace(/\D/g, '');
            
            // Заменяем 8 на 7 в начале
            if (value.startsWith('8')) {
                value = '7' + value.substring(1);
            }
            
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = '+7 ';
            }
            if (value.length > 1) {
                formattedValue += '(' + value.substring(1, 4);
            }
            if (value.length > 4) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 9);
            }
            if (value.length > 9) {
                formattedValue += '-' + value.substring(9, 11);
            }
            
            input.value = formattedValue;
        }

        // Функция получения чистого номера
        function getCleanPhone(phone) {
            let clean = phone.replace(/\D/g, '');
            if (clean.startsWith('8')) {
                clean = '7' + clean.substring(1);
            }
            return clean;
        }

        // Обработчик ввода телефона
        phoneInput.addEventListener('input', function() {
            formatPhone(this);
            validatePhoneField();
        });

        // Функция проверки поля телефона
        function validatePhoneField() {
            const value = phoneInput.value;
            
            if (value.trim() == '') {
                phoneError.style.display = 'none';

                phoneInput.classList.remove('valid', 'invalid');
                return false;
            }
            
            if (validateRussianPhone(value)) {
                phoneError.style.display = 'none';

                phoneInput.classList.remove('invalid');
                phoneInput.classList.add('valid');
                return true;
            } else {
                phoneError.style.display = 'block';

                phoneInput.classList.remove('valid');
                phoneInput.classList.add('invalid');
                return false;
            }
        }
        document.getElementById('Form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateField(field.value) && validatePhoneField()) {
                alert('Форма заполнена корректно!');
            }
        });