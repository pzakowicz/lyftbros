

  
  module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
              host: process.env.DB_LOCAL_HOST,
              port: process.env.DB_LOCAL_PORT,
              user: process.env.DB_LOCAL_USER,
              password: process.env.DB_LOCAL_PASS,
              database: process.env.DB_LOCAL_NAME
            };

        case 'production':
            return {

            host: process.env.DB_CLOUD_HOST,
            port: process.env.DB_CLOUD_PORT,
            user: process.env.DB_CLOUD_USER,
            password: process.env.DB_CLOUD_PASS,
            database: process.env.DB_CLOUD_NAME
          };
    }
};

