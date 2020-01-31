import { error as logError } from 'console'
import { Request, Response } from 'express'
import { QueryBuilder } from 'knex'
import { Id, Account } from '../resources/accounts/accounts.model'

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
    logError(error)
    res.status(500).json({ error: 'The information could not be retrieved.' })
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
    if (item) {
      res.status(200).json(item)
    } else {
      res.status(404).json({
        message: 'The item with the specified ID does not exist.',
      })
    }
  } catch (error) {
    logError(error)
    res.status(500).json({ error: 'The information could not be retrieved.' })
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
    logError(error)
    res.status(500).json({ error: 'The information could not be posted.' })
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
    if (updated) {
      res.status(200).json(updated)
    } else {
      res.status(404).json({
        message: 'The item with the specified ID does not exist.',
      })
    }
  } catch (error) {
    logError(error)
    res.status(500).json({ error: 'The information could not be modified.' })
  }
}

export const removeOne = (
  model: Model
): ((req: Request, res: Response) => Promise<void>) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await model.remove(req.params.id)
    if (count) {
      res.status(200).json({ message: `This item has been deleted` })
    } else {
      res.status(404).json({
        message: 'The item with the specified ID does not exist.',
      })
    }
  } catch (error) {
    logError(error)
    res.status(500).json({ error: 'The information could not be modified.' })
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
