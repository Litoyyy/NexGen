import { z } from "../../libraries/zod.js"
import { getCookiesRequests, sendData, setCookie } from "../utils.js";


function getTextInsideSquareBrackets(text) {
    const startIndex = text.indexOf('['); // Находим индекс первой открывающей скобки
    const endIndex = text.lastIndexOf(']'); // Находим индекс последней закрывающей скобки
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) { // Проверяем, что скобки найдены и первая скобка находится перед последней
        return text.substring(startIndex + 1, endIndex); // Возвращаем текст между первой и последней скобками
    } else {
        return ''; // Если скобки не найдены или первая скобка находится после последней, возвращаем пустую строку
    }
}

const schemaRegister = z.object({
    email: z.string()
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(4,{message: "слишком коротко"}),
    repeat_password: z.string()
        .min(4,{message: "слишком коротко"}),
}).refine(
    (data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["password","repeat_password"], // path of error
});
const schemaNewPass = z.object({
    password: z.string()
        .min(4,{message: "слишком коротко"}),
    repeat_password: z.string()
        .min(4,{message: "слишком коротко"}),
}).refine(
    (data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["password","repeat_password"], // path of error
});
const schemaLogin = z.object({
    email: z.string()
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(4,{message: "слишком коротко"}),
});
const schemaManager = z.object({
    login: z.string()
        .min(1,{message: "слишком коротко"}),
    password: z.string()
        .min(4,{message: "слишком коротко"}),
});
const schemaRequest = z.object({
    company: z.string()
        .min(1,{message: "слишком коротко"}),
    project: z.string()
        .min(1,{message: "слишком коротко"}),
    date_from: z.string(),
    date_to: z.string(),
    description: z.string()
        .min(1,{message: "слишком коротко"}),
});
const clientProfile = z.object({
    first_name: z.string()
        .min(1,{message: "слишком коротко"}),
    last_name: z.string()
        .min(1,{message: "слишком коротко"}),
    company: z.string()
        .min(1,{message: "слишком коротко"}),
    email: z.string()
        .email({ message: "Invalid email address" }),
    phone: z.string()
        .min(18,{message: "слишком коротко"}),
    city: z.string()
});

export function validation() {
    const loginClient = document.querySelector('#login-client-form');
    if(loginClient) {
        formValidate(
            loginClient,
            schemaLogin,
            (body)=>{
                setCookie('account', JSON.stringify(body));
                clearForm(loginClient);
                window.location.href = '/templates/client/client-profile.html';
            }
        );
    };
    const loginManager = document.querySelector('#login-manager-form');
    if(loginManager) {
        formValidate(
            loginManager,
            schemaManager,
            (body)=>{
                setCookie('account', JSON.stringify(body));
                clearForm(loginManager);
                window.location.href = '/templates/manager-profile.html';
            }
        );
    };
    const loginAdmin = document.querySelector('#login-admin-form');
    if(loginAdmin) {
        formValidate(
            loginAdmin,
            schemaManager,
            (body)=>{
                setCookie('account', JSON.stringify(body));
                clearForm(loginAdmin);
                window.location.href = '/templates/admin-profile.html';
            }
        );
    };
    const registerForm = document.querySelector('#register-client-form');
    if(registerForm) {
        formValidate(
            registerForm,
            schemaRegister,
            (body)=>{
                setCookie('account', JSON.stringify(body));
                clearForm(registerForm);
                window.location.href = '/templates/client/client-profile.html';
            }
        );
    };
    const makeRequest = document.querySelector('#make-request-form');
    if(makeRequest) {
        formValidate(
            makeRequest,
            schemaRequest,
            (body)=>{
                const requestsCookie = getCookiesRequests();
                requestsCookie.push(body);
                setCookie('requests', JSON.stringify(requestsCookie));
                clearForm(makeRequest);
            }
        )
    };
    const profileForm = document.querySelector('#client-profile-form');
    if(profileForm) {
        formValidate(
            profileForm,
            clientProfile,
            (body)=>{
                setCookie('account', JSON.stringify(body));
                clearForm(profileForm);
                window.location.reload();
            }
        )
    };
}

function formValidate(form, schema, callBack, formData) {
    form.onsubmit = (e) => {
        e.preventDefault();
    }
    const button = form.elements.button;

    const inputs = Object.keys(getBody(form))
        .map(el=> 
            form.elements[`${el}`]
        )

    inputs.forEach((el)=>{
        el.oninput = (evt) => {
            el.classList.remove('error');

            const body = getBody(evt.target.form);
            validateParse({
                schema: schema,
                body,
            }).then(res => {
                if(button) button.disabled = false;
                if(button && form.dataset.state && form.dataset.state == 'disabled') button.disabled = true;
                inputs.forEach((el) => {
                    el.classList.remove('error');
                });
                if(button) button.onclick = () => {
                    const formDataBody = new FormData(form);
                    if(callBack) formData ? callBack(formDataBody) : callBack(body);
                }
            }).catch(error => {
                const parse = JSON.parse(`[${getTextInsideSquareBrackets(error.toString())}]`);
                const nameErrorInput = parse.map(el=>el.path[0]);
                let input = [];
                for(const errorName of nameErrorInput) {
                    input.push(form.elements[`${errorName}`]);
                }
                if(button) button.disabled = true;
                input.forEach((el) => {
                    el.classList.add('error');
                });
                if(button) button.onclick = () => {};
            });
        }
    })
}

async function validateParse(validateInfo) {
    try {
        validateInfo.schema.parse(validateInfo.body);
        console.log("Validation successful");
        if(typeof validateInfo?.callback == 'function')validateInfo?.callback();
        return true;
    } 
    catch (error) {
        if (error instanceof z.ZodError) {
            // console.error("Validation failed:", error.errors);
            throw new Error(JSON.stringify(error.errors));
        } else {
            // console.error("Unknown error", error);
        }
    }
}

function clearForm(form) {
    const inputs = Object.keys(getBody(form))
        .map(el=> 
            form.elements[`${el}`]
        )

    const button = form.elements.button;

    inputs.forEach(elem=>{
        elem.value = '';
    });

    button.disabled = true;
}



export function getBody(form) {
    const formData = new FormData(form);
    const body = {};
    for (let [name, value] of formData.entries()) {
        body[name] = value;
    }
    return body;
}

function getQuery(query) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(query);
}

// Для корректной работы необходимо подключить и активировать эту функцию в app.js

// Пример подключения: import { validation } from "./путь/к/файлу/validation.js";

// Активация: validation();