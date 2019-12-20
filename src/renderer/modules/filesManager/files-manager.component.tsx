import React from "react"
import MemoryChartContainer from "Renderer/modules/filesManager/components/memory-chart.container"
import FunctionComponent from "Renderer/types/function-component.interface"

const FilesManager: FunctionComponent = props => {
  return (
    <div>
      Files manager
      <MemoryChartContainer />
    </div>
  )
}

export default FilesManager
