const development = {
  client: 'sqlite3',
  connection: {
    filename: './data/budget.db3',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './data/migrations',
  },
  seeds: {
    directory: './data/seeds',
  },
}

export default development
