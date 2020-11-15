// @name: ReactClassComponentTypeScript
// @prefix: rccts
// @description: React class component with TypeScript interfaces
import React, { Component } from 'react'

interface Props {
  
}
interface State {
  
}

class ${1:${TM_FILENAME_BASE}} extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>
        $0
      </div>
    )
  }
}

export default ${1:${TM_FILENAME_BASE}}
