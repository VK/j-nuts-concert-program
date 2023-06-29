<template>
  <div>
    <v-sheet>
      <div class="w-100 text-center pa-3" v-if="offline || ignore">

        <v-card elevation="4" outlined shaped v-for="el in daten" v-bind:key="el.id" class="mb-2">
          <v-list-item-content>
            <div class="text-overline mb-2 ml-3 text-left" v-if="el.title != 'Pause'">
              <span class="text-h6">{{ el.id }}.</span> <span class="grey--text">{{ el.artist}}</span>
            </div>
            <v-list-item-title class="text-h5">
              {{el.title}}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-4 ml-3 text-left grey--text" v-if="el.title != 'Pause'">
              <p class="mb-2 mt-0">
                <b>Autor(en):</b> {{ el.author }}
              </p>
              <p class="mb-1 mt-0"><b>Arrangement:</b> {{ el.arr }}</p>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-card>
      </div>
      <div v-else class="w-100 text-center text-h3 pa-3">
        Bitte verwenden Sie den Flugmodus!<br />
        <v-icon :size="airplaneSIze">mdi-airplane-check</v-icon><br />
        <v-btn elevation="2" x-large @click="ign">Ignorieren</v-btn>
      </div>
    </v-sheet>
  </div>
</template>


<script>
import { watch, check } from "is-offline";
import daten from "./daten";

export default {
  data: () => ({
    iWidth: 0,
    iHeight: 0,
    iTop: 0,
    offline: false,
    ignore: false,
    type: "sopran",
    types: ["sopran", "alt", "bariton"],
    auto: false,
    enabled: true,
    touching: false,

    daten: daten,
  }),

  computed: {
    airplaneSIze() {
      return (this.iWidth * 0.5).toString() + "px";
    },
    progSize() {
      return this.iWidth * 0.5;
    },
  },
  methods: {
    set_config(auto, type) {
      this.auto = auto;
      this.type = type;
    },
    ign() {
      this.ignore = true;
    },
  },

  mounted() {

    check().then((state) => {
      this.offline = state;
    });

    watch((state) => {
      this.offline = state;
    });
  },
};
</script>


<style scoped>
.theme--dark.v-card {
  border-color: #1d7531 !important;
  border-width: 2px;
  color: #ffffff;
}
</style>
