import { button, withKnobs } from "@storybook/addon-knobs"
import { storiesOf } from "@storybook/react"
import React, { useState } from "react"
import ButtonComponent, {
  DisplayStyle,
} from "Renderer/components/core/button/button.component"
import SelectionManager from "Renderer/components/core/selection-manager/selection-manager.component"
import { SelectionManagerProps } from "Renderer/components/core/selection-manager/selection-manager.interface"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import Delete from "Renderer/svg/delete.svg"
import Export from "Renderer/svg/upload.svg"
import styled from "styled-components"

const onDelete = () => {
  alert("Deleted")
}

const onExport = () => {
  alert("Exported")
}

export const deleteButton = (
  <ButtonComponent
    key="delete"
    label={"Delete"}
    displayStyle={DisplayStyle.Link1}
    Icon={Delete}
    data-testid="button"
    onClick={onDelete}
  />
)

export const exportButton = (
  <ButtonComponent
    key="export"
    label={"Export"}
    displayStyle={DisplayStyle.Link1}
    Icon={Export}
    data-testid="button"
    onClick={onExport}
  />
)

const buttons = [exportButton, deleteButton]

const useSelectionManager = () => {
  const [itemsNumber, setItemsNumber] = useState()
  const allItems = itemsNumber === 10

  const onToggle = () => {
    alert("Toggled")
  }

  const selectAll = () => setItemsNumber(10)
  const selectOne = () => setItemsNumber(1)
  const selectFew = () => setItemsNumber(1 + Math.ceil(Math.random() * 8))

  button("select all items", selectAll)
  button("select 1 item", selectOne)
  button("select few items", selectFew)
  return { allItems, onToggle, itemsNumber }
}

export const PredefinedSelectionManager = ({
  selectedItemsNumber = 1,
  allItemsSelected = false,
  collectionLabel = "Item",
  ...props
}: Partial<SelectionManagerProps>) => {
  return (
    <SelectionManager
      selectedItemsNumber={selectedItemsNumber}
      allItemsSelected={allItemsSelected}
      collectionLabel={collectionLabel}
      {...props}
    />
  )
}

export const CustomizedPredefinedSelectionManager = styled(
  PredefinedSelectionManager
)`
  grid-template-columns: 4.2rem 1fr auto;
`

storiesOf("Components", module)
  .addDecorator(withKnobs)
  .add("SelectionManager", () => {
    const { allItems, itemsNumber, onToggle } = useSelectionManager()
    return (
      <div style={{ margin: "2rem" }}>
        <Text displayStyle={TextDisplayStyle.SmallText}>Basic</Text>
        <br />
        <PredefinedSelectionManager
          selectedItemsNumber={itemsNumber}
          allItemsSelected={allItems}
          onToggle={onToggle}
        />
        <br />
        <br />
        <Text displayStyle={TextDisplayStyle.SmallText}>
          Basic with custom styles
        </Text>
        <br />
        <CustomizedPredefinedSelectionManager
          selectedItemsNumber={itemsNumber}
          allItemsSelected={allItems}
          onToggle={onToggle}
        />
        <br />
        <br />
        <Text displayStyle={TextDisplayStyle.SmallText}>With buttons</Text>
        <br />
        <PredefinedSelectionManager
          selectedItemsNumber={itemsNumber}
          allItemsSelected={allItems}
          onToggle={onToggle}
          buttons={buttons}
        />
        <br />
        <br />
        <Text displayStyle={TextDisplayStyle.SmallText}>
          Expanded with buttons
        </Text>
        <br />
        <PredefinedSelectionManager
          selectedItemsNumber={itemsNumber}
          allItemsSelected={allItems}
          onToggle={onToggle}
          buttons={buttons}
          expanded
        />
      </div>
    )
  })
