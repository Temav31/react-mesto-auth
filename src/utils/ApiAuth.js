class ApiAuth {
    constructor(basePath) {
        this._basePath = basePath;
        // this._token = token;
    }
    _getHeaders() {
        return {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    _getJson(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }
    checkToken(token) {
        return fetch(`${this._basePath}/users/me`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => this._getJson(res));
    }
    register(body) {
        return fetch(`${this._basePath}/signup`, {
            method: "POST",
            headers: this._getHeaders(),
            body: JSON.stringify(body)
        })
            .then((res) => this._getJson(res));
    }
    authorize(body) {
        return fetch(`${this._basePath}/signin`, {
            method: "POST",
            headers: this._getHeaders(),
            body: JSON.stringify(body)
        })
            .then((res) => this._getJson(res));
    }
}
// класс апи
const auth = new ApiAuth('https://auth.nomoreparties.co');
// экспортирем класс
export default auth;