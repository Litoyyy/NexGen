class ElemQuery {
    constructor(options) {
        this.query = options.query,
        this.value = options.value
    }
}


class QueryFilter {
    constructor (Elems, options) {
        this.$Elems = (typeof Elems) == 'string' ? document.querySelectorAll(`${Elems}`) : Elems,
        this.$confirmButton = (typeof options.confirmButton) == 'string' ? document.querySelectorAll(`${options.confirmButton}`) : options.confirmButton,
        this.$cancelButton = (typeof options.cancelButton) == 'string' ? document.querySelectorAll(`${options.cancelButton}`) : options.cancelButton,

        this.options = options || {},
        this.debounced = options.debounced,
        this.pagination = options.pagination,
        this.search = options.search

        if(this.pagination && !this.search) {
            this.paginationFunctionary();
            return;
        }

        if(this.search && !this.pagination) {
            this.searcherFunctionary();
            return;
        }

        if(this.$Elems.length === 0 || this.pagination) return;

        this.filtersFunctionary();
        this.filterButtonsFunctionary();
    }

    filtersFunctionary() {
        const activeQueries = getCurrentQuery();
        for(const elem of this.$Elems) {
            const elemQuery = new ElemQuery({
                query: elem.dataset.query,
                value: elem.dataset.value
            });

            const filterFamily = document.querySelectorAll(`.${elem.className}[data-query="${elemQuery.query}"]`);
            const filterFamilyAllSelector = document.querySelector(`.${elem.className}[data-query="${elemQuery.query}"][data-value=""]`);

            if(filterFamilyAllSelector) {
                if (
                    activeQueries.length === 0 || 
                    !activeQueries.find(obj => obj[elemQuery.query]) ||
                    activeQueries.some(obj => obj[elemQuery.query] === '')
                ) filterFamilyAllSelector.checked = true;
            }

            activeQueries.map((currentActive)=>{
                if(currentActive[`${elemQuery.query}`] === elemQuery.value) elem.checked = true;
            })

            elem.addEventListener('click',()=>{
                let someChecked = false;
                for(const elemFamilyFilter of filterFamily) {
                    if(elem == filterFamilyAllSelector) {
                        for(const uncheckedFilter of filterFamily) {
                            if(uncheckedFilter !== filterFamilyAllSelector) {
                                uncheckedFilter.checked = false;
                            }
                        }
                        elem.checked = true;
                    } else if(filterFamilyAllSelector &&
                              elemFamilyFilter !== filterFamilyAllSelector &&
                              elemFamilyFilter.checked) {
                        filterFamilyAllSelector.checked = false;
                        someChecked = true;
                    }
                }
                if(!someChecked && filterFamilyAllSelector) filterFamilyAllSelector.checked = true;


                if(!this.debounced || !!this.$confirmButton) return;

                const filterArray = this.getActiveFilters();
                debouncedSetNewQuery(filterArray);
            });
        }
    }
    filterButtonsFunctionary() {
        if(!!this.$confirmButton && !this.debounced && !this.search) {
            for (const btn of this.$confirmButton) {
                btn.addEventListener('click',()=>{
                    const filterArray = this.getActiveFilters();
                    setNewQuery(filterArray);
                });
            };
        };
        if(this.$cancelButton && this.$cancelButton.length > 0) {
            for (const btn of this.$cancelButton) {
                btn.addEventListener('click',()=>{
                    const filterArray = [];
                    setNewQuery(filterArray);
                });
            };
        };
    }

    paginationFunctionary() {
        const activeQueries = getCurrentQuery();
        const activeQueriesFiltered = this.filterCurrentQuery('page');
        for(const elem of this.$Elems) {
            activeQueries.map((currentActive)=>{
                if(currentActive.page === elem.dataset.value) elem.checked = true;
            });

            elem.addEventListener('click',()=>{
                const paginationQuery = new ElemQuery({
                    query: 'page',
                    value: elem.dataset.value
                });
                activeQueriesFiltered.push(paginationQuery);
                setNewQuery(activeQueriesFiltered);
            });
        }
    }

    searcherFunctionary() {
        const activeQueries = getCurrentQuery();
        for(const elem of this.$Elems) {
            const elementForm = elem.form;

            activeQueries.map((currentActive)=>{
                if(currentActive[`${elem.dataset.query}`]) elem.value = currentActive[`${elem.dataset.query}`];
            })
            let activeQueriesFiltered = this.filterCurrentQuery(elem.dataset.query);
            elem.addEventListener('input',()=>{
                const elemQueryObj = new ElemQuery({
                    query: elem.dataset.query,
                    value: elem.value
                });
                activeQueriesFiltered = activeQueriesFiltered.filter(obj => obj.query !== elemQueryObj.query);
                activeQueriesFiltered.push(elemQueryObj);

                if(!this.debounced) return;
                debouncedSetNewQuery(activeQueriesFiltered);
            });
            if(elementForm) {
                elementForm.addEventListener('submit',(event)=>{
                    event.preventDefault();

                    setNewQuery(activeQueriesFiltered);
                })
            }
        }
    }

    filterCurrentQuery(filterValue) {
        const activeQueries = getCurrentQuery();
        const activeQueriesFiltered = [];
        activeQueries.map((query)=>{
            if(!query[`${filterValue}`]) {
                const [[key, value]] = Object.entries(query);
                const elemQuery = new ElemQuery({
                    query: key,
                    value: value
                });
                activeQueriesFiltered.push(elemQuery);
            };
        });
        return activeQueriesFiltered;
    }

    getActiveFilters() {
        const filterArray = [];
        for(const checked of this.$Elems) {
            if(checked.checked &&
                checked.dataset.value !== '') {
                const checkedElemQuery = new ElemQuery({
                    query: checked.datawset.query,
                    value: checked.dataset.value
                });
                filterArray.push(checkedElemQuery);
            }
        }
        return filterArray;
    }
}



const debouncedSetNewQuery = debounce(setNewQuery, 1000);

function setNewQuery(array) {
    const newQuery = new URLSearchParams();
    if(array.length > 0 && Array.isArray(array)) {
        array.forEach(filter=>{
            newQuery.append(filter.query, filter.value);
        });
    };
    window.location.search = newQuery.toString();
}
function getCurrentQuery() {
    const queryParams = new URLSearchParams(window.location.search);
    const filtersArray = [];
    for (let pair of queryParams.entries()) {
        const keysValue = {};
        let key = pair[0];
        let value = pair[1];
        keysValue[`${key}`] = value;
        filtersArray.push(keysValue);
    };
    return filtersArray;
}
function debounce(func, timeout) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            func.apply(context, args);
        }, timeout);
    };
};



export default QueryFilter;