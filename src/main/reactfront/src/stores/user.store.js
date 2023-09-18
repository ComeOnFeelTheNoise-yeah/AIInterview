import {create} from "zustand";

/**
 * @typedef {Object} UserStore
 * @property {any} user
 * @property {(user: any) => void} setUser
 * @property {() => void} removeUser
 */

const useStore = create((set) => ({
    user: null,
    setUser: (user) => {
        set((state) => ({...state, user}));
    },
    removeUser: () => {
        set((state) => ({...state, user: null}));
    },
}));

export default useStore;
