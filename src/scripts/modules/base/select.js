export function select () {
    const selects = document.querySelectorAll('.__select');
    if(selects.length > 0) {
        selects.forEach(select=>{
            const selectSingle_title = select.querySelector('.__select__title');
            const selectSingle_labels = select.querySelectorAll('.__select__label');

            if (selectSingle_title) {
                selectSingle_title.addEventListener('click', () => {
                    if ('active' === select.getAttribute('data-state')) {
                        select.setAttribute('data-state', '');
                    } else {
                        select.setAttribute('data-state', 'active');
                    }
                });
            }

            for (let i = 0; i < selectSingle_labels.length; i++) {
            selectSingle_labels[i].addEventListener('click', (evt) => {
                selectSingle_title.textContent = evt.target.textContent;
                select.setAttribute('data-state', '');
            });
            }
        })
    }
}