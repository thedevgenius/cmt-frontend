// src/store/storage.ts
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
};

// If we are on the server, use the noop storage. Otherwise, use local storage.
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;