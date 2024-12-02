// api/controllers/ConnectionCheckController.js

module.exports = {
    checkConnection: function(req, res) {
      const datastoreConfig = sails.config.datastores.default;
  
      // Construct the connection string
      const connectionString = `mysql://${datastoreConfig.user}:${datastoreConfig.password}@${datastoreConfig.host}:${datastoreConfig.port || 3306}/${datastoreConfig.database}`;
  
      // Log it
      console.log('Connection String:', connectionString);
  
      // Respond with the connection string
      return res.json({
        message: 'Connection string loaded successfully!',
        connectionString: connectionString
      });
    }
  };
