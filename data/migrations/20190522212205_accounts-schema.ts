import Knex, { SchemaBuilder } from 'knex'

export const up = (knex: Knex): SchemaBuilder =>
  knex.schema.createTable('accounts', tbl => {
    tbl.increments()
    tbl
      .string('name')
      .notNullable()
      .unique()
    tbl.decimal('budget').notNullable()
  })

export const down = (knex: Knex): SchemaBuilder =>
  knex.schema.dropTableIfExists('accounts')
