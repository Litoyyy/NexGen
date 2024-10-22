export function checkLoggedIn() {
    const loginSection = document.querySelector('.login-section');
    if(loginSection) return;
    const accountCookies = document.cookie.replace(/(?:(?:^|.*;\s*)account\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if(!accountCookies) window.location.href = '/templates/index.html';
}