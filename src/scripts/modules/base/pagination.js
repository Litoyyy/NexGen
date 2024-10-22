import QueryFilter from "../../libraries/QueryLibrary.min.mjs";

export function pagination() {
    const paginationElems = document.querySelectorAll('.pagination__elem');
    if(paginationElems.length === 0) return;
    const paginationDefault = new QueryFilter(paginationElems, {
        pagination: true,
        cancelButton: '.__pagination__btn_cancel'
    });
}