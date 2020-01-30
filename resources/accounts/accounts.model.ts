import { QueryBuilder } from 'knex'
import db from '../../data/dbConfig'

type Account = {
  readonly name: string
  readonly budget: number
}

export const findAll = (): QueryBuilder => db('accounts')

export const findById = (id: number | string): QueryBuilder =>
  db('accounts')
    .where({ id: Number(id) })
    .first()

export const insert = async (account: Account): Promise<number> =>
  (await db('accounts').insert(account))[0]

export const update = (id: number | string) => (
  account: Account
): QueryBuilder =>
  db('accounts')
    .where('id', Number(id))
    .update(account)

export const remove = (id: number | string): QueryBuilder =>
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
