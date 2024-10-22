export function debounce(func, timeout) {
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
export async function sendData(data, url) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let token = userLoggedIn();

    async function makeRequest(token) {
        const headers = {
            'Content-Type': "application/json",
            'X-CSRFToken': csrfToken,
        };

        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return response.json();
        } else if (response.status === 401 && token) {
            try {
                token = await refreshAccessToken();
                setCookie('access_token', token);
                return makeRequest(token);
            } catch (error) {
                throw new Error('Failed to refresh token');
            }
        } else {
            throw new Error(response.statusText);
        }
    }

    return makeRequest(token);
}

export async function refreshAccessToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)refresh_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await fetch('/api/authentication/refresh-token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({'refresh': refreshToken})
    });

    if (response.ok) {
        const data = await response.json();
        setCookie('access_token', data.access);
        return data.access;
    } else {
        throw new Error('Unable to refresh token');
    }
}
export async function patchData(data, url) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let token = userLoggedIn();

    async function makeRequest(token) {
        const headers = {
            'Content-Type': "application/json",
            'X-CSRFToken': csrfToken,
        };

        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        const response = await fetch(url, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return response.json();
        } else if (response.status === 401 && token) {
            try {
                token = await refreshAccessToken();
                setCookie('access_token', token);
                return makeRequest(token);
            } catch (error) {
                throw new Error('Failed to refresh token');
            }
        } else {
            throw new Error(response.statusText);
        }
    }

    return makeRequest(token);
};
export async function getData(url) {
    const response = await fetch(url, {
        method: "GET",
    });
    if(response.ok) return response.json();
    else throw new Error(response.statusText);
};
export const userLoggedIn = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};
export function setNewQuery(key, value) {
    const url = new URLSearchParams(window.location.search);
    url.delete(key);
    if(Array.isArray(value)) {
        url.append(key, value);
    } else {
        if(!!value) url.append(key, value);
    }

    window.location.search = url.toString();
};
export async function sendText(url, text) {
    const response = await fetch(url + '&text=' + text,{
        method: "GET",
    })
    if(response.ok) return response.json();
    else throw new Error(response.statusText);
};
export function formatDate(date) {
    const splittedDate = date.split('.');
    const formatedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
    return formatedDate;
};
export function getCurrentQuery() {
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
};
export function getRem() {
    var element = document.querySelector("html");
    var fontSize = window.getComputedStyle(element).fontSize;
    var numericFontSize = parseInt(fontSize, 10);
    return fontSize.slice(0, -2);
};
export function setCookie(name, value, options = {}) {
    options = {
        path: '/',
      ...options
    };
  
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = name + "=" + value;
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
  
    document.cookie = updatedCookie;
};
export const getCookiesRequests = () => {
    const requestsCookies = document.cookie.replace(/(?:(?:^|.*;\s*)requests\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return requestsCookies ? JSON.parse(requestsCookies) : [];
}