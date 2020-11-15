// @name: useState
// @prefix: uss
// @description: Hooks useState
const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${3:type}>(${2:initialState})