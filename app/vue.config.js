const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'J🌰 Programmheft'
    }
  },
  pwa: {
    name: 'J🌰 Programmheft',
    themeColor: '#28a745',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/service-worker.js",
    },

    manifestOptions: {
      "id": "/",
      "start_url": "/", 
      "scope": "/", 
      "prefer_related_applications": true,
      "related_applications": [{
        "platform": "webapp",
        "url": "https://j-nuts-concert-program.krueckl.de/manifest.json"

      }],

      "protocol_handlers": [
        {
          "protocol": "web+jnutsprogram",
          "url": "/index.html?voice=%s"
        },
      ]      
    }

  }
})
