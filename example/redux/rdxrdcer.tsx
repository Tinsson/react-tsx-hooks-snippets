// @name: ReduxReducer
// @prefix: rdxrdcer
// @description: redux reducer
const initialState = {

}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ${1:typeName}:
      return { ...state, ...payload }
    default:
      return state
  }
}
