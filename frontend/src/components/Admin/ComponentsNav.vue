<template>
    <v-navigation-drawer width="300" height="500">
        <v-card>
            <v-tabs
            show-arrows=false
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

            <v-window v-model="tab">
                <v-window-item value="tab-1">
                    <v-list v-model:opened="open">
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
  }
</script>


