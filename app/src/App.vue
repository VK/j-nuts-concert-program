
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              J🌰 Programmheft
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          >Sommersemester 2023 <br />
          Version 0.1</v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>J🌰 Programmheft</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <JnutsProgram ref="program" />
    </v-main>
    <UpdateDialog ref="updateDialog"></UpdateDialog>
    <InstallDialog ref="installDialog"></InstallDialog>
  </v-app>
</template>


<script>
import JnutsProgram from "./components/JnutsProgram";
import UpdateDialog from "./components/UpdateDialog.vue";
import InstallDialog from "./components/InstallDialog.vue";

export default {
  name: "App",

  components: {
    JnutsProgram,
    UpdateDialog,
    InstallDialog,
  },

  data: () => ({
    drawer: null,
    refreshing: false,
    appTitle: "J🌰 Programmheft",
    type: "bariton",
    subscribed: undefined,
    subscription: null,
    worker: null,
    auto: false,
    wakelock: false,
  }),
  methods: {
    isMobile() {
      return navigator.userAgentData.mobile;
    },
    isApple() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },

    refreshPossible(e) {
      if (e.detail) {
        this.$refs.updateDialog.show = true;
        this.$refs.updateDialog.worker = e.detail;
      } else {
        console.warn("No worker data found!");
      }
    },

    changeProgramType() {
      this.$refs.program.type = this.type;
      this.$refs.program.auto = this.auto;
      localStorage.setItem("type", this.type);
      localStorage.setItem("auto", this.auto);
    },

    checkInstall() {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        console.log("uses app");
      } else {
        let installed = false;
        try {
          installed = JSON.parse(localStorage.getItem("appinstalled"));
        } catch {
          console.log("install not set");
        }

        if (installed) {
          this.$refs.installDialog.show = true;
          this.$refs.installDialog.installed = installed;
        }
      }

      const search = decodeURIComponent(location.search);
      if (search.includes("sopran")) {
        this.type = "sopran";
        this.changeProgramType();
      } else if (search.includes("alt")) {
        this.type = "alt";
        this.changeProgramType();
      } else if (search.includes("bariton")) {
        this.type = "bariton";
        this.changeProgramType();
      }
    },

    initWakeLock() {
      try {
        navigator.wakeLock.request("screen").then((wakeLock) => {
          wakeLock.addEventListener("release", () => {
            console.log("Wake Lock was released");
            this.wakelock = false;
          });
          console.log("Wake Lock is active");
          this.wakelock = true;
        });
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    },
  },

  created() {
    try {
      let old_type = localStorage.getItem("type");

      if (old_type) {
        this.type = old_type;
      }
    } catch {
      console.log("no old type config");
    }

    try {
      // let old_auto = JSON.parse(localStorage.getItem("auto"));

      //  if (old_auto) {
      //     this.auto = old_auto;
      //   }
      this.auto = false;
    } catch {
      console.log("no old type config");
    }

    // update the program config after 200ms
    setTimeout(() => {
      this.$refs.program.set_config(this.auto, this.type);
    }, 200);

    // check install after 2 seconds
    setTimeout(this.checkInstall, 2000);

    // add the installed event listeners
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("appinstalled", "true");
    });
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      localStorage.setItem("appinstalled", "false");
      this.$refs.installDialog.installEvent = event;
      this.$refs.installDialog.canInstall = true;
      this.$refs.installDialog.show = true;
    });

    //Listener for the push stuff
    document.addEventListener("swRegistered", this.pushPossible);

    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener("swUpdated", this.refreshPossible, {
      once: true,
    });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker &&
      navigator.serviceWorker.addEventListener(
        //triggered by registration.claim
        "controllerchange",
        () => {
          if (this.refreshing) return;
          this.refreshing = true;
          console.log("controllerchange triggered, -> auto refresh!!");
          window.location.reload();
        }
      );

    addEventListener("focus", this.initWakeLock);
    this.initWakeLock();
  },
};
</script>


<style>
html {
  overflow-y: auto;
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}

.v-toolbar {
  background: #28a745 !important;
}

.v-toolbar__title {
  color: #fff;
  font-weight: 400;
}
</style>
