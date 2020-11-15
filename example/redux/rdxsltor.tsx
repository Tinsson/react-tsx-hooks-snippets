// @name: ReduxSelector
// @prefix: rdxsltor
// @description: redux selector with reselect
import { createSelector } from 'reselect'

export const ${1:selectorName} = createSelector(
  state => state.${2:selector},
)