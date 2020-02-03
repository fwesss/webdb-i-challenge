import express, { Request, Response, NextFunction } from 'express'
import Validation from 'folktale/validation'
import { findById } from './accounts.model'
import { validator, didItValidate, Matcher } from '../../utils/validator'
import controllers from './accounts.controllers'
import dbErrorHandler from '../../utils/dbErrorHandler'

const { Success } = Validation

const router = express.Router()

const hasBody = (req: Request): boolean => !!req.body
const hasName = (req: Request): boolean => !!req.body.name
const hasBudget = (req: Request): boolean => !!req.body.budget
const realBudget = (req: Request): boolean =>
  typeof req.body.budget === 'number' && req.body.mileage >= 0

const bodyValidator = validator('Missing account data', hasBody)
const nameValidator = validator('Missing name', hasName)
const budgetValidator = validator('Missing budget', hasBudget)
const realBudgetValidator = validator(
  'Budget must be a positive number',
  realBudget
)

const accountValidationResult = (req: Request): Matcher =>
  Success()
    .concat(bodyValidator(req))
    .concat(nameValidator(req))
    .concat(budgetValidator(req))
    .concat(realBudgetValidator(req))

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
    const account = await findById(req.params.id)
    if (account) {
      next()
    } else {
      res.status(404).json({ error: 'Invalid account ID' })
    }
  } catch (error) {
    dbErrorHandler(error, res)
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
