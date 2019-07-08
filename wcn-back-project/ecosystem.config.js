module.exports = {
  apps : [{
    name: 'API',
    script: 'server.js',
    watch: true,
    autorestart: true,
    max_memory_restart: '2G'
  }]
};
