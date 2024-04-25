const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    webSocketServer: false
  },
  transpileDependencies: true
})
