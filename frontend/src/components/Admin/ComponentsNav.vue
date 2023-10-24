<template>
    <v-navigation-drawer width="300" height="500">
        <v-card class="h-100">
            <v-tabs
            grow
            v-model="tab"
            >
                <v-tab value="tab-1">
                    One
                </v-tab>

                <v-tab value="tab-2">
                    Two
                </v-tab>

                <v-tab value="tab-3">
                    Three
                </v-tab>
            </v-tabs>

            <v-window v-model="tab" class="h-100">
                <v-window-item value="tab-1" class="h-100">
                    <v-list v-model:opened="open" border class="h-50">
                        <v-list-item prepend-icon="mdi-cube" title="Item one"></v-list-item>

                        <v-list-group value="Item Two">
                            <template v-slot:activator="{ props }">
                            <v-list-item
                                v-bind="props"
                                prepend-icon="mdi-cube"
                                title="Item Two"
                            ></v-list-item>
                            </template>

                            <v-list-group value="Item Three">
                                <template v-slot:activator="{ props }">
                                    <v-list-item
                                    v-bind="props"
                                    prepend-icon="mdi-cube"
                                    title="Item Three"
                                    ></v-list-item>
                                </template>
                            </v-list-group>
                        </v-list-group>
                    </v-list>
                    <v-list v-model:opened="open" class="h-50" style="overflow-y:scroll">
                        <v-list-item>Edges: </v-list-item>
                        <v-list-group value="Faces">
                            <template v-slot:activator="{ props }">
                            <v-list-item
                                v-bind="props"
                            >Faces: {{ shapeDetails.faces.length }}</v-list-item>
                            </template>
                            <v-list-item v-for="i in shapeDetails.faces" key="i.index" v-bind="props">
                                {{ i }}
                            </v-list-item>
                            
                        </v-list-group>
                        <v-list-group value="Vertices">
                            <template v-slot:activator="{ props }">
                            <v-list-item
                                v-bind="props"
                            >Vertices: {{ shapeDetails.vertices.length }}</v-list-item>
                            </template>
                            <v-list-item v-for="i in shapeDetails.vertices" key="i.index" v-bind="props">
                                {{ i }}
                            </v-list-item>
                            
                        </v-list-group>
                    </v-list>
                </v-window-item>

                <v-window-item value="tab-2">
                Two
                </v-window-item>

                <v-window-item value="tab-3">
                Three
                </v-window-item>
            </v-window>
        </v-card>
    </v-navigation-drawer>
</template>
<script>
  import { useShapeDetails } from '@/stores/shapeDetails.js'
  export default {
    data: () => ({
      tab: null,
      open: ['Users'],
      admins: [
        ['Management', 'mdi-account-multiple-outline'],
        ['Settings', 'mdi-cog-outline'],
      ],
      cruds: [
        ['Create', 'mdi-plus-outline'],
        ['Read', 'mdi-file-outline'],
        ['Update', 'mdi-update'],
        ['Delete', 'mdi-delete'],
      ],
    }),
    setup() {
        const shapeDetails = useShapeDetails()

        // **only return the whole store** instead of destructuring
        return { shapeDetails }
    },
    computed: {
        computedVertices() {
            return this.shapeDetails.vertices
        },
        computedFaces() {
            return this.shapeDetails.faces
        },
    },
  }
</script>


