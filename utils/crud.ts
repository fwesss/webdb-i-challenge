import { Request, Response } from 'express'
import { QueryBuilder } from 'knex'
import { Id, Account } from '../resources/accounts/accounts.model'
import dbErrorHandler from './dbErrorHandler'

type Model = {
  findAll: () => QueryBuilder
  findById: (id: Id) => QueryBuilder
  insert: (account: Account) => Promise<number>
  update: (id: Id) => (account: Account) => QueryBuilder
  remove: (id: Id) => QueryBuilder
}

export const getMany = (
  model: Model
): ((_req: Request, res: Response) => Promise<void>) => async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await model.findAll()
    res.status(200).json(items)
  } catch (error) {
    dbErrorHandler(error, res)
  }
}

export const getOne = (
  model: Model
): ((req: Request, res: Response) => Promise<void>) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await model.findById(req.params.id)
    res.status(200).json(item)
  } catch (error) {
    dbErrorHandler(error, res)
  }
}

export const createOne = (
  model: Model
): ((req: Request, res: Response) => Promise<void>) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await model.insert(req.body)
    res.status(201).json(item)
  } catch (error) {
    dbErrorHandler(error, res)
  }
}

export const updateOne = (
  model: Model
): ((req: Request, res: Response) => Promise<void>) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await model.update(req.params.id)(req.body)
    res.status(200).json(updated)
  } catch (error) {
    dbErrorHandler(error, res)
  }
}

export const removeOne = (
  model: Model
): ((req: Request, res: Response) => Promise<void>) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await model.remove(req.params.id)
    res.status(200).json({ message: `This item has been deleted` })
  } catch (error) {
    dbErrorHandler(error, res)
  }
}

type Controllers = {
  getMany: (req: Request, res: Response) => Promise<void>
  getOne: (req: Request, res: Response) => Promise<void>
  createOne: (req: Request, res: Response) => Promise<void>
  updateOne: (req: Request, res: Response) => Promise<void>
  removeOne: (req: Request, res: Response) => Promise<void>
}

export const crudControllers = (model: Model): Controllers => ({
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  removeOne: removeOne(model),
})
