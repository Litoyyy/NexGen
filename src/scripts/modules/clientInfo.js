import { getBody } from "./base/validation.js";
import { getCookiesRequests, setCookie } from "./utils.js";

export function clientInfo() {
    const form = document.querySelector('#client-profile-form');
    if(form) {
        const inputs = Object.keys(getBody(form))
            .map(el=> 
                form.elements[`${el}`]
            )

        const accountCookies = document.cookie.replace(/(?:(?:^|.*;\s*)account\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        inputs.forEach(input=>{
            const newValue = !!JSON.parse(accountCookies)[input.name] ? JSON.parse(accountCookies)[input.name]: '';
            input.value = newValue;
        });
    };
    const orderHistory = document.querySelector('.__order_history__list');
    if(orderHistory) {
        const requestsCookie = getCookiesRequests();
        if(requestsCookie.length > 0) {
            const fragment = document.createDocumentFragment();
            const promises = requestsCookie.map(async(item)=>{
                const card = await addCard(item);
                fragment.appendChild(card);
            });
            Promise.all(promises).then(res=>{
                orderHistory.appendChild(fragment);
            });
        };
    };
    const logoutBtn = document.querySelector('.__logout_btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click',()=>{
            setCookie('account', '', {'max-age': -1});
            window.location.reload();
        });
    };
}

function addCard(data) {
    const card = document.createElement('div');
    card.classList.add('order-history-card');

    card.innerHTML = `
        <div class="order-history-card__info-block">
            <div class="order-history-card__title-block">
                <span>Проект: ”${data.project}”</span>
                <div class="order-history-card__title-block__tag">
                    На рассмотрении
                </div>
            </div>
            <div class="order-history-card__text-block">
                <span>Компания: “${data.company}”</span>
                <span>Сроки: ${data.date_from} - ${data.date_to}</span>
            </div>
        </div>
        <div class="order-history-card__description">
            Описание проекта: ${data.description}
        </div>
    `;
    
    return card;
}