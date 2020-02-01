import {
  wrapError,
  DBError,
  UniqueViolationError,
  NotNullViolationError,
} from 'db-errors'
import { error as logError } from 'console'
import { Response } from 'express'

const dbErrorHandler = (dbError: Error, res: Response): void => {
  logError(dbError)
  const error = wrapError(dbError)

  if (error instanceof UniqueViolationError) {
    res.status(409).json({
      error: `${error.columns} of ${error.table} must be unique`,
    })
  } else if (error instanceof NotNullViolationError) {
    res.status(409).json({
      error: `Not null constraint failed for table ${error.table} and column ${error.column}`,
    })
  } else if (error instanceof DBError) {
    res.status(500).json({ error: `Operation failed` })
  }
}

export default dbErrorHandler
