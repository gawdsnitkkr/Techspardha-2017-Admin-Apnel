export class LocalStorage {
    getItem(key: string) {
        let jsonString = localStorage.getItem(key);
        let json;
        try {
            json = JSON.parse(jsonString);
        } catch(exception) {
            return jsonString;
        }
        return json;
    }
    setItem(key: string, value: string) {
        if (typeof value == 'object') {
            let jsonString = JSON.stringify(value);
            localStorage.setItem(key, jsonString);
        } else {
            localStorage.setItem(key, value);
        }
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }
}
