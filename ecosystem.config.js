module.exports = {
    apps : [{
      name: 'discord',
      script: 'index.js',
      args: 'dev',
      node_args: ['-r', './env/initializeEnvs.js'],
      watch: true
    }]
  };
  