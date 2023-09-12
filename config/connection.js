const { Sequelize } = require('sequelize');
const config = require('../config/config')
require('dotenv').config();

const sequelize = new Sequelize( config.development);

try {
  sequelize.authenticate();
  console.log('Conexão estabelecida com sucesso.');
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
}

module.exports = { Sequelize, sequelize };
