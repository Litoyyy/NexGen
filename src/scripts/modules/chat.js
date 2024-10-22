import { getCurrentQuery } from "./utils.js";

export function chat() {
    const messagesList = document.querySelector('.__messages_list');
    const messagesHeader = document.querySelector('.__messages_header');
    if(messagesList) {
        const currentQuery = getCurrentQuery();
        const queryName = currentQuery[0].name;
        const chatCardsBullet = document.querySelectorAll('.chat-card-bullet');
        const message = messagesList.querySelector('.message');
        chatCardsBullet.forEach(card=>{
            if(card.dataset.name == queryName) {
                message.innerHTML = `
                    ${card.querySelector('.chat-card-bullet__text').innerHTML}
                    <span>${card.querySelector('.chat-card-bullet__title-block').querySelector('span').innerHTML}</span>
                `;
                messagesHeader.innerHTML = `
                    ${card.dataset.name} • Менеджер
                    <span>Проект “${card.dataset.project}”</span>
                `;
            };
        });
    };
    const form = document.querySelector('#chat-input-form');
    if(form) {
        const submitButton = form.querySelector('.__submit_button')
        form.onsubmit = (event) =>{
            event.preventDefault();
        };
        form.addEventListener('submit',()=>{
            submitFunc()
        });
        submitButton.addEventListener('click',()=>{
            submitFunc()
        });
        function submitFunc() {
            const input = form.elements.message;
            if(input.value === '') return;
            const message = createMessage(input.value);
            messagesList.appendChild(message);
            input.value = '';
        }
    };
}
function createMessage(value) {
    const Data = new Date();
    const message = document.createElement('div');
    message.classList.add('message__container');
    message.innerHTML = `
        <div class="message message_your">
            ${value}
            <span>${Data.getHours()}:${Data.getMinutes()}</span>
        </div>
    `;
    return message;
}