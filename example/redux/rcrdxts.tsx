// @name: React Redux Class Component
// @prefix: rcrdxts
// @description: React Redux Class Component With Connect
import React, { Component } from 'react'
import { connect } from 'react-redux'

interface Props {
  
}
interface State {
  
}

export class ${1:${TM_FILENAME_BASE}} extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>
        $0
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(${1:${TM_FILENAME_BASE}})
