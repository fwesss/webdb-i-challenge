import Validation from 'folktale/validation'

const { Success, Failure } = Validation

export const validator = <T>(
  errorString: string,
  predicate: (o: T) => boolean
): ((o: T) => T) => (o: T): T =>
  predicate(o) ? Success(o) : /* otherwise */ Failure([errorString])

export type Matcher = {
  matchWith: (cases: {
    Success: () => boolean
    Failure: () => boolean
  }) => boolean
}

export const didItValidate = (validationErrors: Matcher): boolean =>
  validationErrors.matchWith({
    Success: () => true,
    Failure: () => false,
  })
