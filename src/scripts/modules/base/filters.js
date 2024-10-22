import QueryFilter from "../../libraries/QueryLibrary.min.mjs";

export function filters() {
    const filterElems = document.querySelectorAll('.__filter__elem');
    if(filterElems.length === 0) return;
    const filtersDefault = new QueryFilter(filterElems,{
        // debounced: true,
        confirmButton: '.__filter__btn_confirm',
        cancelButton: '.__filter__btn_cancel'
    });
}