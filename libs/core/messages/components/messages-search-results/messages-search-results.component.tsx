/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import styled, { css } from "styled-components"
import {
  Col,
  EmptyState,
  LoadingState,
  Actions,
} from "Core/__deprecated__/renderer/components/core/table/table.component"
import { basicAvatarStyles } from "Core/__deprecated__/renderer/components/core/avatar/avatar.component"
import {
  backgroundColor,
  borderColor,
} from "Core/core/styles/theming/theme-getters"
import useTableScrolling from "Core/__deprecated__/renderer/utils/hooks/use-table-scrolling"
import { MessagesSearchResultsTestIdsEnum } from "Core/messages/components/messages-search-results/messages-search-results-test-ids.enum"
import { ResultState } from "Core/contacts/reducers/contacts.interface"
import { Message } from "Core/messages/dto"
import Text from "Core/__deprecated__/renderer/components/core/text/text.component"
import { TextDisplayStyle } from "Core/__deprecated__/renderer/components/core/text/text.component"
import { defineMessages } from "react-intl"
import {
  InitialsAvatar,
  ThreadCol,
  ThreadDataWrapper,
  LastMessageText,
  WarningIconWrapper,
} from "Core/messages/components/thread-row.styled"
import { Settings } from "Core/settings/dto"
import { noop } from "Core/__deprecated__/renderer/utils/noop"
import moment from "moment"
import { isToday } from "Core/__deprecated__/renderer/utils/is-today"
import { Time } from "Core/__deprecated__/renderer/components/rest/messages/threads-table.component"
import ThreadRowName from "Core/messages/components/thread-row-name"
import Dropdown from "Core/__deprecated__/renderer/components/core/dropdown/dropdown.component"
import { IconButtonWithSecondaryTooltip } from "Core/__deprecated__/renderer/components/core/icon-button-with-tooltip/icon-button-with-secondary-tooltip.component"
import { IconType } from "Core/__deprecated__/renderer/components/core/icon/icon-type"
import { AvatarSize } from "Core/__deprecated__/renderer/components/core/avatar/avatar.component"
import Icon from "Core/__deprecated__/renderer/components/core/icon/icon.component"
import ButtonComponent from "Core/__deprecated__/renderer/components/core/button/button.component"
import { DisplayStyle } from "Core/__deprecated__/renderer/components/core/button/button.config"
import { ElementWithTooltipPlace } from "Core/__deprecated__/renderer/components/core/tooltip/element-with-tooltip.component"
import ScrollAnchorContainer from "Core/__deprecated__/renderer/components/rest/scroll-anchor-container/scroll-anchor-container.component"
import { Contact } from "Core/contacts/reducers/contacts.interface"
import { MessageType } from "Core/messages/constants"
import { intl } from "Core/__deprecated__/renderer/utils/intl"
import { Threads } from "Core/messages/components/thread-list.component"
import ThreadBaseRow from "Core/messages/components/thread-base-row.component"

export const lightAvatarStyles = css`
  background-color: ${backgroundColor("row")};
`

export const AvatarPlaceholder = styled.div`
  ${basicAvatarStyles};
  margin-right: 1.2rem;
`

export const SearchResultQueryWrapper = styled.div`
  padding: 0 3.2rem 1.7rem;
  border-bottom: solid 0.1rem ${borderColor("list")};
`

export const SearchTitle = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
export const SearchResultContainer = styled(ThreadBaseRow)`
  :hover {
    ${InitialsAvatar} {
      background-color: ${backgroundColor("row")};
    }
  }
`

const messages = defineMessages({
  searchResultsTitle: {
    id: "module.messages.searchResultsTitle",
  },
  dropdownTogglerTooltipDescription: {
    id: "component.dropdownTogglerTooltipDescription",
  },
})

interface MessagesSearchResultProps extends Pick<Settings, "language"> {
  resultsState: ResultState
  results: Message[]
  searchValue: string
  onRowClick: (message: Message) => void
  removeMessage: (messageId: string) => void
  resendMessage?: (messageId: string) => void
  getContactByPhoneNumber: (phoneNumber: string) => Contact | undefined
}

const MessagesSearchResults: FunctionComponent<MessagesSearchResultProps> = ({
  results,
  resultsState,
  searchValue,
  language,
  onRowClick,
  removeMessage = noop,
  resendMessage = noop,
  getContactByPhoneNumber,
  ...restProps
}) => {
  const { enableScroll, disableScroll, scrollable } = useTableScrolling()

  const emptyList = () => (
    <EmptyState
      title={{ id: "module.messages.emptyResultsListTitle" }}
      description={{
        id: "module.messages.emptyResultsListDescription",
      }}
      data-testid={MessagesSearchResultsTestIdsEnum.Empty}
    />
  )

  return (
    <div {...restProps}>
      <SearchResultQueryWrapper>
        <SearchTitle displayStyle={TextDisplayStyle.Headline4}>
          {intl.formatMessage(messages.searchResultsTitle, {
            value: searchValue,
          })}
        </SearchTitle>
      </SearchResultQueryWrapper>

      <Threads
        scrollable={scrollable}
        data-testid={MessagesSearchResultsTestIdsEnum.Table}
      >
        {resultsState === ResultState.Loaded &&
          (results.length
            ? results.map((message) => {
                const phoneNumber = message.phoneNumber
                const { id, date, content } = message
                const contact = getContactByPhoneNumber(message.phoneNumber)
                const isMessageFailed =
                  message.messageType === MessageType.FAILED
                const handleRowClick = () => onRowClick(message)
                // AUTO DISABLED - fix me if you like :)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                const remove = () => removeMessage(id)
                // AUTO DISABLED - fix me if you like :)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                const resend = () => resendMessage(id)

                return (
                  <SearchResultContainer
                    key={id}
                    selected={false}
                    active={false}
                  >
                    <Col>
                      <InitialsAvatar
                        user={contact}
                        light={false}
                        size={AvatarSize.Big}
                      />
                    </Col>
                    <ThreadCol onClick={handleRowClick}>
                      <ThreadDataWrapper
                        sidebarOpened={false}
                        isMessageFailed={isMessageFailed}
                      >
                        <ThreadRowName
                          contact={contact}
                          phoneNumber={phoneNumber}
                        />
                        <Time
                          displayStyle={TextDisplayStyle.Label}
                          color="secondary"
                        >
                          {isToday(date)
                            ? moment(date).format("h:mm A")
                            : moment(date)
                                .locale(language ?? "en")
                                .format("ll")}
                        </Time>

                        <LastMessageText
                          unread={false}
                          color="secondary"
                          displayStyle={TextDisplayStyle.Paragraph4}
                        >
                          {content}
                        </LastMessageText>
                      </ThreadDataWrapper>
                      {isMessageFailed && (
                        <WarningIconWrapper>
                          <Icon type={IconType.Warning} width={1.6} />
                        </WarningIconWrapper>
                      )}
                    </ThreadCol>
                    <Col>
                      <Actions>
                        <Dropdown
                          onOpen={disableScroll}
                          onClose={enableScroll}
                          toggler={
                            <IconButtonWithSecondaryTooltip
                              iconType={IconType.More}
                              description={
                                messages.dropdownTogglerTooltipDescription
                              }
                              // FIXME: The position based on offset is a sticky. However, this is a quick workaround
                              //  for buggy overridePosition lib feature
                              place={ElementWithTooltipPlace.Bottom}
                              offset={{ left: 15, bottom: 5 }}
                            />
                          }
                        >
                          {isMessageFailed && (
                            <ButtonComponent
                              labelMessage={{
                                id: "module.messages.messageDropdownResend",
                              }}
                              Icon={IconType.Send}
                              onClick={resend}
                              displayStyle={DisplayStyle.Dropdown}
                            />
                          )}
                          <ButtonComponent
                            labelMessage={{
                              id: "module.messages.messageDropdownDelete",
                            }}
                            Icon={IconType.Delete}
                            onClick={remove}
                            displayStyle={DisplayStyle.Dropdown}
                          />
                        </Dropdown>
                      </Actions>
                    </Col>
                    <ScrollAnchorContainer key={id} active={false} />
                  </SearchResultContainer>
                )
              })
            : emptyList())}
        {resultsState === ResultState.Empty && emptyList()}
        {resultsState === ResultState.Loading && (
          <LoadingState
            data-testid={MessagesSearchResultsTestIdsEnum.Loading}
          />
        )}
      </Threads>
    </div>
  )
}

export default MessagesSearchResults
