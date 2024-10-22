import QueryFilter from "../../libraries/QueryLibrary.min.mjs";

export function inputs() {

    var elementPhone = document.querySelectorAll('input[name="phone"]');
    var maskOptions = {
        mask: '+7 (000) 000-00-00',
        prepare: function (appended, masked) {
            if (appended === '8' && masked.value === '') {
                return '7';
            }
            return appended;
        },
    };
    elementPhone.forEach((el) => {
        new IMask(el, maskOptions);
    });

    const dateInputs = document.querySelectorAll('input.__date_input')
    const dateMask = {
        mask: Date
    };
    dateInputs.forEach(input=>{
        new IMask(input, dateMask);
    });
}

// Для корректной работы необходимо подключить и активировать эту функцию в app.js

// Пример подключения: import { inputs } from "./путь/к/файлу/inputs.js";

// Активация: inputs();