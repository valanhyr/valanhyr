export class Store {
    constructor(initialState) {
        this.subscribers = new Map();
        this.state = new Proxy(initialState, {
            set: (target, key, value) => {
                target[key] = value;
                if (this.subscribers.has(key)) {
                    this.subscribers.get(key).forEach(cb => cb(value));
                }
                return true;
            }
        });
    }

    subscribe(key, callback) {
        if (!this.subscribers.has(key)) this.subscribers.set(key, []);
        this.subscribers.get(key).push(callback);
    }
}

export const store = new Store({
    selectedSkill: null,
    navigation: { path: '/' }
});
