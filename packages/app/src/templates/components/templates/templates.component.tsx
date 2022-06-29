/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { useState, useEffect } from "react"
import { FunctionComponent } from "App/__deprecated__/renderer/types/function-component.interface"
import useTableSelect from "App/__deprecated__/renderer/utils/hooks/useTableSelect"
import {
  TemplatesProps,
  TemplateServiceState,
} from "App/templates/components/templates/templates.interface"
import { TemplatesSection } from "App/templates/components/templates/templates.styled"
import { TemplatesPanel } from "App/templates/components/templates-panel"
import { TemplatesList } from "App/templates/components/templates-list"
import { TemplateForm } from "App/templates/components/template-form"
import { Template, NewTemplate } from "App/templates/dto"
import { TemplateError } from "App/templates/constants"
import { useLoadingState } from "App/ui"
import { DeletingTemplateModals } from "App/templates/components/deleting-template-modals"
import { UpdatingTemplateModals } from "App/templates/components/updating-template-modals"
import { CreatingTemplateModals } from "App/templates/components/creating-template-modals"
import { DropResult } from "react-beautiful-dnd"

export const Templates: FunctionComponent<TemplatesProps> = ({
  templates,
  loading,
  loaded,
  error,
  createTemplate,
  deleteTemplates,
  updateTemplate,
  updateTemplateOrder,
}) => {
  const { states, updateFieldState, resetState } =
    useLoadingState<TemplateServiceState>({
      creating: false,
      creatingInfo: false,
      updating: false,
      updatingInfo: false,
      deleting: false,
      deletingConfirmation: false,
      deletingInfo: false,
    })

  // const sortedTemplates = templates.sort((a, b) => a.order = b.order)
  const [editedTemplate, setEditedTemplate] = useState<Template | undefined>()
  const [templateFormOpen, setTemplateFormOpenState] = useState<boolean>(false)
  const [deletedTemplates, setDeletedTemplates] = useState<string[]>([])
  const [templatesList, setTemplatesList] = useState<Template[]>(templates)

  const { selectedRows, allRowsSelected, toggleAll, resetRows, ...rest } =
    useTableSelect<Template>(templates)

  useEffect(() => {
    setTemplatesList(templates)
  }, [templates])
  useEffect(() => {
    if (!loaded || error) {
      return
    }

    const firstTimeout = setTimeout(() => {
      if (states.deleting) {
        updateFieldState("deleting", false)
        updateFieldState("deletingConfirmation", false)
        updateFieldState("deletingInfo", true)
      }

      if (states.updating) {
        updateFieldState("updating", false)
        updateFieldState("updatingInfo", true)
      }

      if (states.creating) {
        updateFieldState("creating", false)
        updateFieldState("creatingInfo", true)
      }
    }, 1000)

    const secondTimeout = setTimeout(() => {
      resetState()
    }, 5000)
    return () => {
      clearTimeout(firstTimeout)
      clearTimeout(secondTimeout)
    }
  }, [loaded, error])

  // Deleting functionality
  const handleCloseDeleteModal = () => {
    updateFieldState("deletingConfirmation", false)
    setDeletedTemplates([])
    resetRows()
  }

  const handleOpenDeleteModal = (ids: string[]) => {
    updateFieldState("deletingConfirmation", true)
    setDeletedTemplates(ids)
  }

  const handleDeleteButton = async () => {
    updateFieldState("deleting", true)
    updateFieldState("deletingConfirmation", false)
    resetRows()
    await deleteTemplates(deletedTemplates)
  }

  const handleDeleteSelected = () => {
    const ids = selectedRows.map((thread) => thread.id)
    handleOpenDeleteModal(ids)
  }

  const handleCloseDeletingErrorModal = () => {
    updateFieldState("deleting", false)
    setDeletedTemplates([])
    resetRows()
  }

  // Updating functionality
  const handleOpenUpdateTemplate = (id: string) => {
    const template = templates.find((template) => template.id === id)
    setEditedTemplate(template)
    setTemplateFormOpenState(true)
  }

  const handleUpdateTemplate = async (template: NewTemplate) => {
    if (!editedTemplate) {
      return
    }

    updateFieldState("updating", true)
    setTemplateFormOpenState(false)

    const data = await updateTemplate({
      ...template,
      id: editedTemplate.id,
      lastUsedAt: editedTemplate.lastUsedAt,
      order: editedTemplate.order,
    })

    if (data.payload.type !== TemplateError.UpdateTemplate) {
      setEditedTemplate(undefined)
    }
  }

  const handleCloseUpdatingErrorModal = () => {
    updateFieldState("updating", false)
  }

  // Creating functionality
  const handleOpenNewTemplateForm = () => {
    setTemplateFormOpenState(true)
  }

  const handleCloseNewTemplateForm = () => {
    setTemplateFormOpenState(false)
  }

  const handleCreateTemplate = async (template: NewTemplate) => {
    updateFieldState("creating", true)
    setTemplateFormOpenState(false)

    await createTemplate(template)
  }

  const handleCloseCreatingErrorModal = () => {
    updateFieldState("creating", false)
  }
  const reorder = (
    list: Template[],
    startIndex: number,
    endIndex: number
  ): void => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    const movedTemplates = result.filter((_template, index) => {
      if (startIndex < endIndex) {
        return startIndex <= index && index <= endIndex
      } else {
        return endIndex <= index && index <= startIndex
      }
    })
    const orderStartValue = startIndex < endIndex ? startIndex : endIndex
    const indexToOrderValue = 1
    const updatedTemplates: Template[] = movedTemplates.map(
      (template, index) => {
        return {
          ...template,
          order: orderStartValue + indexToOrderValue + index,
        }
      }
    )
    updateTemplateOrder(updatedTemplates)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    reorder(templatesList, result.source.index, result.destination.index)
  }
  return (
    <>
      <TemplatesPanel
        disabled={templateFormOpen}
        onAddNewTemplate={handleOpenNewTemplateForm}
        selectedTemplates={selectedRows}
        allItemsSelected={allRowsSelected}
        toggleAll={toggleAll}
        onDeleteClick={handleDeleteSelected}
      />
      <TemplatesSection>
        <TemplatesList
          templates={templatesList}
          deleteTemplates={handleOpenDeleteModal}
          updateTemplate={handleOpenUpdateTemplate}
          onDragEnd={onDragEnd}
          {...rest}
        />
        {templateFormOpen && (
          <TemplateForm
            template={editedTemplate}
            saving={loading}
            savingPossible={templateFormOpen}
            error={error}
            onSave={
              editedTemplate ? handleUpdateTemplate : handleCreateTemplate
            }
            onClose={handleCloseNewTemplateForm}
          />
        )}
      </TemplatesSection>

      <DeletingTemplateModals
        error={error}
        deletedTemplatesLength={deletedTemplates.length}
        deleting={states.deleting}
        deletingInfo={states.deletingInfo}
        deletingConfirmation={states.deletingConfirmation}
        onCloseDeletingErrorModal={handleCloseDeletingErrorModal}
        onCloseDeletingModal={handleCloseDeleteModal}
        onDelete={handleDeleteButton}
      />

      <UpdatingTemplateModals
        error={error}
        updating={states.updating}
        updatingInfo={states.updatingInfo}
        onCloseUpdatingErrorModal={handleCloseUpdatingErrorModal}
      />

      <CreatingTemplateModals
        error={error}
        creating={states.creating}
        creatingInfo={states.creatingInfo}
        onCloseCreatingErrorModal={handleCloseCreatingErrorModal}
      />
    </>
  )
}
