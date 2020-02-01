import { QueryBuilder } from 'knex'
import db from '../../data/dbConfig'

export type Account = {
  readonly name: string
  readonly budget: number
}

export type Id = number | string

export const findAll = (
  limit: number,
  sortBy = 'id',
  sortDir = 'asc'
): QueryBuilder =>
  db('accounts')
    .limit(limit)
    .orderBy(sortBy, sortDir)

export const findById = (id: Id): QueryBuilder =>
  db('accounts')
    .where({ id: Number(id) })
    .first()

export const findByName = (name: string): QueryBuilder =>
  db('accounts')
    .where('name', name)
    .first()

export const insert = (account: Account): Promise<QueryBuilder> =>
  db('accounts')
    .insert(account, 'id')
    .then(([id]) => findById(id))

export const update = (
  id: Id,
  account: Account
): Promise<QueryBuilder | null> =>
  db('accounts')
    .where('id', Number(id))
    .update(account)
    .then(count => count > 0 && findById(id))

export const remove = (id: Id): QueryBuilder =>
  db('accounts')
    .where('id', Number(id))
    .del()

export default {
  findAll,
  findById,
  insert,
  update,
  remove,
}
