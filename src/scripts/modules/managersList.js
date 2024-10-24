export function managersList() {
    const managerCards = document.querySelectorAll('.manager-card');
    if(managerCards.length > 0) {
        managerCards.forEach(card=>{
            cardFunctionality(card)
        });
    }
    const addNewCardBtn = document.querySelector('.__new_manager__btn');
    if(addNewCardBtn) {
        const list = document.querySelector('.__new_manager__list')
        addNewCardBtn.addEventListener('click',()=>{
            createCard(list);
        });
    };
}

function createCard(list) {
    const card = document.createElement('div');
    card.classList.add('manager-card');
    card.innerHTML = `
        <div class="manager-card__title-block">
            <div class="manager-card__title-block__title">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#813DE0"/>
                    <path d="M11.5 22C11.5 20.7876 11.9741 19.6248 12.818 18.7675C13.6619 17.9102 14.8065 17.4286 16 17.4286C17.1935 17.4286 18.3381 17.9102 19.182 18.7675C20.0259 19.6248 20.5 20.7876 20.5 22H11.5ZM16 16.8571C14.1353 16.8571 12.625 15.3229 12.625 13.4286C12.625 11.5343 14.1353 10 16 10C17.8647 10 19.375 11.5343 19.375 13.4286C19.375 15.3229 17.8647 16.8571 16 16.8571Z" fill="white"/>
                </svg>
                <span class="__title_block">Имя:</span>
            </div>
            <button class="manager-card__title-block__button __change_manager__btn">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5864 10.1456L19.5752 8.15675C20.2465 7.48546 20.5821 7.14982 20.9578 6.99741C21.4399 6.80181 21.9793 6.80181 22.4615 6.99741C22.8372 7.14982 23.1728 7.48546 23.8441 8.15675C24.5154 8.82805 24.851 9.16369 25.0035 9.53938C25.1991 10.0215 25.1991 10.5609 25.0035 11.0431C24.851 11.4188 24.5154 11.7544 23.8441 12.4257L21.8788 14.391C20.0958 13.3731 18.6173 11.9054 17.5864 10.1456ZM16.1319 11.6L8.69194 19.04C8.26688 19.465 8.05435 19.6776 7.91462 19.9387C7.77488 20.1998 7.71594 20.4945 7.59805 21.0839L6.91541 24.4971C6.84889 24.8297 6.81563 24.996 6.91024 25.0906C7.00484 25.1852 7.17114 25.152 7.50372 25.0855L7.50375 25.0855L7.50376 25.0855L10.9169 24.4028C11.5064 24.2849 11.8011 24.226 12.0622 24.0862C12.3233 23.9465 12.5358 23.734 12.9609 23.3089L20.4207 15.8492C18.6886 14.7669 17.2245 13.3125 16.1319 11.6Z" fill="#212121"/>
                </svg>
            </button>
        </div>
        <div class="manager-card__info" data-info="login">
            <span>Логин:</span>
            
        </div>
        <div class="manager-card__info" data-info="password">
            <span>Пароль:</span>
            
        </div>
    `;
    cardFunctionality(card);
    list.appendChild(card);

    const changeBtn = card.querySelector('.__change_manager__btn');
    changeBtn.click();
}

function cardFunctionality(card) {
    const changeBtn = card.querySelector('.__change_manager__btn');
    const infos = card.querySelectorAll('.manager-card__info');
    const title = card.querySelector('.__title_block');
    if(!changeBtn) return;
    changeBtn.addEventListener('click',()=>{
        title.innerHTML = `Имя:${createInput()}`;
        infos.forEach(info=>{
            const text = info.dataset.info == 'login' ? 'Логин:': 'Пароль:';
            info.innerHTML = `
                <span>${text}</span>
                ${createInput()}
            `;
        });
        const forms = card.querySelectorAll('form');
        forms.forEach(form=>{
            form.onsubmit = (event) =>{
                const input = form.querySelector('input');
                event.preventDefault();
                form.innerHTML = input.value;
            };
        });
    });
}

function createInput() {
    const input = `
        <form class="field">
            <label for="project-input" class="input-label">
                <input type="text"
                    id="project-input"
                >
            </label>
        </form>
    `;
    return input;
}