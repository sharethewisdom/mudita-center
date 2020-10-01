import React, { Ref, useEffect } from "react"
import { FunctionComponent } from "Renderer/types/function-component.interface"
import {
  Col,
  Labels,
  RowSize,
  TableSortButton,
  TextPlaceholder,
} from "Renderer/components/core/table/table.component"
import { Size } from "Renderer/components/core/input-checkbox/input-checkbox.component"
import { Type } from "Renderer/components/core/icon/icon.config"
import { UseTableSelect } from "Renderer/utils/hooks/useTableSelect"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import { UseTableSidebar } from "Renderer/utils/hooks/useTableSidebar"
import { InView } from "react-intersection-observer"
import { TemplatesTestIds } from "Renderer/modules/messages/tabs/templates.enum"
import { Template } from "Renderer/modules/messages/tabs/templates.component"
import { useTemporaryStorage } from "Renderer/utils/hooks/use-temporary-storage/use-temporary-storage.hook"
import { defineMessages } from "react-intl"
import {
  Row,
  TemplatesEmptyState,
  Table,
  TextPreview,
  DeleteCol,
} from "Renderer/components/rest/messages/templates/templates-list.styled"
import { intl } from "Renderer/utils/intl"
import { isToday } from "Renderer/utils/is-today"
import moment from "moment"
import { SortDirection } from "Renderer/utils/hooks/use-sort/use-sort.types"
import useSort from "Renderer/utils/hooks/use-sort/use-sort"
import { Checkbox } from "Renderer/components/rest/calls/calls-table.styled"
import Icon, { IconSize } from "Renderer/components/core/icon/icon.component"
import { TextInfo } from "Renderer/modules/tools/tabs/notes.styled"
import { normalizeText } from "Renderer/components/core/text-editor/text-editor.hook"

const messages = defineMessages({
  emptyStateTitle: { id: "view.name.messages.templates.emptyList.title" },
  temporaryText: { id: "view.name.messages.templates.temporary" },
  emptyStateDescription: {
    id: "view.name.messages.templates.emptyList.description",
  },
  note: {
    id: "view.name.messages.templates.template",
  },
  edited: {
    id: "view.name.messages.templates.edited",
  },
  today: {
    id: "view.generic.today",
  },
  newTemplate: {
    id: "view.name.messages.templates.newTemplate",
  },
  emptyTemplate: {
    id: "view.name.messages.templates.emptyTemplate",
  },
  unsavedTemplate: {
    id: "view.name.messages.templates.unsavedTemplate",
  },
})

type SelectHook = Pick<
  UseTableSelect<Template>,
  "getRowStatus" | "toggleRow" | "noneRowsSelected"
>

export interface TemplatesListProps
  extends SelectHook,
    UseTableSidebar<Template> {
  templates: Template[]
  deleteTemplate: (id: string) => void | Promise<void>
  newTemplateId?: string
}

const TemplatesList: FunctionComponent<TemplatesListProps> = ({
  templates,
  getRowStatus,
  toggleRow,
  noneRowsSelected,
  openSidebar,
  closeSidebar,
  activeRow,
  sidebarOpened,
  deleteTemplate,
  newTemplateId,
}) => {
  const { data: sortedData, sort, sortDirection } = useSort(templates)
  const templatesAvailable = sortedData.length > 0
  const sortByDate = () => sort("date", templates)

  useEffect(() => {
    sortByDate()
  }, [])

  return (
    <Table
      role="list"
      hide
      hideColumns={sidebarOpened}
      hideableColumnsIndexes={[2, 3, 4]}
    >
      <Labels size={RowSize.Small}>
        <Col />
        <Col>
          <Text message={messages.note} />
        </Col>
        <Col />
        <Col onClick={sortByDate}>
          <Text message={messages.edited} />
          <TableSortButton
            sortDirection={sortDirection.date || SortDirection.Ascending}
          />
        </Col>
      </Labels>
      {templatesAvailable ? (
        sortedData.map((template) => {
          const { id, content, date } = template
          const { selected } = getRowStatus(template)
          const deleteItem = () => deleteTemplate(id)

          const { getTemporaryValue } = useTemporaryStorage<string>(id, content)

          const editedTemplate =
            normalizeText(getTemporaryValue()) !== normalizeText(content)
          const newTemplate = id === newTemplateId
          const emptyTemplate = getTemporaryValue().length === 0

          const text = emptyTemplate
            ? intl.formatMessage(messages.emptyTemplate)
            : (editedTemplate
                ? getTemporaryValue()
                : normalizeText(content)
              ).substr(0, 250)

          const toggle = () => {
            if (sidebarOpened) {
              closeSidebar()
            }
            toggleRow(template)
          }

          const handleTextPreviewClick = () => {
            noneRowsSelected ? openSidebar(template) : toggle()
          }

          const interactiveRow = (ref: Ref<HTMLDivElement>) => (
            <Row
              key={id}
              selected={selected}
              active={activeRow?.id === id}
              ref={ref}
              role="listitem"
            >
              <Col>
                <Checkbox
                  size={Size.Small}
                  checked={selected}
                  onChange={toggle}
                  visible={!noneRowsSelected}
                />
              </Col>
              <TextPreview onClick={handleTextPreviewClick}>
                <Text displayStyle={TextDisplayStyle.LargeText}>
                  {emptyTemplate ? <em>{text}</em> : text}
                </Text>
              </TextPreview>
              <Col>
                {(editedTemplate || newTemplate) && (
                  <TextInfo>
                    {newTemplate && (
                      <>
                        <em>{intl.formatMessage(messages.newTemplate)}</em>
                        <br />
                      </>
                    )}
                    <em>{intl.formatMessage(messages.unsavedTemplate)}</em>
                  </TextInfo>
                )}
              </Col>
              <Col>
                <Text displayStyle={TextDisplayStyle.LargeText}>
                  {isToday(date)
                    ? intl.formatMessage(messages.today)
                    : moment(date).format("ll")}
                </Text>
              </Col>
              <DeleteCol onClick={deleteItem}>
                <Icon type={Type.Delete} width={IconSize.Medium} />
              </DeleteCol>
            </Row>
          )

          const placeholderRow = (ref: Ref<HTMLDivElement>) => (
            <Row key={id} ref={ref} role="listitem">
              <Col />
              <Col>
                <TextPlaceholder charsCount={content?.length} />
              </Col>
              <Col />
            </Row>
          )

          return (
            <InView key={id}>
              {({ inView, ref }) =>
                inView ? interactiveRow(ref) : placeholderRow(ref)
              }
            </InView>
          )
        })
      ) : (
        <TemplatesEmptyState
          title={messages.emptyStateTitle}
          description={messages.emptyStateDescription}
          data-testid={TemplatesTestIds.EmptyState}
        />
      )}
    </Table>
  )
}

export default TemplatesList
