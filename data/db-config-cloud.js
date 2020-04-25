  /*
  let config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'b2adf4419db6f2',
    password: '079f2cd3',
    database: 'heroku_e8d9557eb319104'
  };
  
  module.exports = config;
  */

  
  module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
              host: process.env.DB_HOST,
              port: process.env.DB_PORT,
              user: process.env.DB_USER,
              password: process.env.DB_PASS,
              database: process.env.DB_NAME
            };

        case 'production':
            return {
            host: 'eu-cdbr-west-03.cleardb.net',
            port: 3306,
            user: 'b2adf4419db6f2',
            password: '079f2cd3',
            database: 'heroku_e8d9557eb319104'
          };

        default:
            return {              
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'R@GQ4JlHg5Qr@sI^',
            database: 'lyftbros-db'
          };
    }
};

