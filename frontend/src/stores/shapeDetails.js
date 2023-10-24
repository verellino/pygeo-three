import { defineStore } from "pinia";

export const useShapeDetails = defineStore("test", {
  state: () => {
    return {
      vertices: null,
      faces: null,
    };
  },
  actions: {
    changeVertices(payload) {
      this.vertices = payload;
    },
    changeFaces(payload) {
      this.faces = payload;
    },
  },
});
