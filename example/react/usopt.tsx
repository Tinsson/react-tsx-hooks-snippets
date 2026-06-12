// @name: useOptimistic
// @prefix: usopt
// @description: react useOptimistic
const [${1:optimisticState}, ${2:addOptimistic}] = useOptimistic(${3:state}, (${4:currentState}, ${5:optimisticValue}) => {
  ${6:return optimisticValue}
})
