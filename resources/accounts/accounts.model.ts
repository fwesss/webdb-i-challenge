import { QueryBuilder } from 'knex'
import db from '../../data/dbConfig'

export type Account = {
  readonly name: string
  readonly budget: number
}

export type Id = number | string

export const findAll = (): QueryBuilder => db('accounts')

export const findById = (id: Id): QueryBuilder =>
  db('accounts')
    .where({ id: Number(id) })
    .first()

export const findByName = (name: string): QueryBuilder =>
  db('accounts')
    .where('name', name)
    .first()

export const insert = async (account: Account): Promise<number> =>
  (await db('accounts').insert(account))[0]

export const update = (id: Id) => (account: Account): QueryBuilder =>
  db('accounts')
    .where('id', Number(id))
    .update(account)

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
