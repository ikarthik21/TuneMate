import { create } from "zustand";

const useDropDownStore = create(set => ({
  components: {},
  showDropDown: component =>
    set(state => ({
      components: {
        ...state.components,
        [component]: true
      }
    })),
  hideDropDown: component =>
    set(state => ({
      components: {
        ...state.components,
        [component]: false
      }
    }))
}));

export default useDropDownStore;
