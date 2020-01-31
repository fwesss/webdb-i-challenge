import express, { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import { error as logError } from 'console'
import { findById, findByName } from './accounts.model'
import { validator, didItValidate } from '../../utils/validator'
import controllers from './accounts.controllers'

const { Success } = Validation

const router = express.Router()

const hasBody = (req: Request): boolean => !!req.body
const hasName = (req: Request): boolean => !!req.body.name
const hasBudget = (req: Request): boolean => !!req.body.budget

const bodyValidator = validator('Missing account data', hasBody)
const nameValidator = validator('Missing name', hasName)
const budgetValidator = validator('Missing budget', hasBudget)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const accountValidationResult = (req: Request): any =>
  Success()
    .concat(bodyValidator(req))
    .concat(nameValidator(req))
    .concat(budgetValidator(req))

const validateAccount = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const didAccountValidate = didItValidate(accountValidationResult(req))
  if (!didAccountValidate) {
    res.status(400).json({ errors: accountValidationResult(req).value })
  } else {
    next()
  }
}

const validateAccountId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await findById(req.params.id)
    if (project) {
      next()
    } else {
      res.status(400).json({ error: 'Invalid account ID' })
    }
  } catch (error) {
    logError(error)
    res
      .status(500)
      .json({ error: 'Account information could not be retrieved' })
  }
}

router.use('/:id', validateAccountId)

router
  .route('/')
  .get(controllers.getMany)
  .post(validateAccount, controllers.createOne)

router
  .route('/:id')
  .get(controllers.getOne)
  .put(validateAccount, controllers.updateOne)
  .delete(controllers.removeOne)

export default router
