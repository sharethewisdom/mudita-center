import React, { useEffect, useRef } from "react"
import { FunctionComponent } from "Renderer/types/function-component.interface"
import {
  Sidebar,
  SidebarHeaderIcon,
} from "Renderer/components/core/table/table.component"
import { Type } from "Renderer/components/core/icon/icon.config"
import { noop } from "Renderer/utils/noop"
import { ActiveRow } from "Renderer/components/rest/messages/messages-list.component"
import Text, {
  TextDisplayStyle,
} from "Renderer/components/core/text/text.component"
import styled from "styled-components"
import InputComponent from "Renderer/components/core/input-text/input-text.component"
import Icon from "Renderer/components/core/icon/icon.component"
import MessageBubble from "Renderer/components/rest/messages/message-bubble.component"
import { createFullName } from "Renderer/models/phone/phone.helpers"
import { backgroundColor } from "Renderer/styles/theming/theme-getters"
import { isNameAvailable } from "Renderer/components/rest/messages/is-name-available"
import { intl } from "Renderer/utils/intl"

interface Props {
  details: ActiveRow
  onClose?: () => void
}

const PhoneNumberText = styled(Text)`
  margin-top: 0.8rem;
`

const MessagesWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 3rem;
  overflow: auto;
`

const MessageBubblesWrapper = styled.div`
  margin-top: 1.2rem;
  margin-bottom: 2.4rem;
`

const TextareaWrapper = styled.div`
  position: sticky;
  bottom: 0;
  background-color: ${backgroundColor("row")};
  padding: 0 3rem;
`

const Textarea = styled(InputComponent)`
  margin-bottom: 1.6rem;
`

const MessagesSidebar = styled(Sidebar)`
  border-top: none;
`

const iconsConfig = { height: 2.8, width: 2.8 }

const leadingIcons = [
  <Icon type={Type.AttachContact} key={Type.AttachContact} {...iconsConfig} />,
  <Icon type={Type.Template} key={Type.Template} {...iconsConfig} />,
]

const trailingIcon = [
  <Icon type={Type.Send} key={Type.Send} {...iconsConfig} />,
]

const MessageDetails: FunctionComponent<Props> = ({
  details,
  onClose = noop,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView()
    }
  }, [ref.current])
  const iconConfig = {
    height: 2.8,
    width: 2.8,
  }
  const icons = (
    <>
      <SidebarHeaderIcon Icon={Type.Calls} onClick={noop} {...iconConfig} />
      <SidebarHeaderIcon Icon={Type.Contacts} onClick={noop} {...iconConfig} />
      <SidebarHeaderIcon
        Icon={Type.BorderCheckIcon}
        onClick={noop}
        {...iconConfig}
      />
      <SidebarHeaderIcon Icon={Type.Delete} onClick={noop} {...iconConfig} />
    </>
  )
  const nameAvailable = isNameAvailable(details.caller)
  return (
    <MessagesSidebar
      show
      headerLeft={
        <>
          <Text
            displayStyle={TextDisplayStyle.LargeBoldText}
            data-testid="sidebar-fullname"
          >
            {nameAvailable
              ? createFullName(details.caller)
              : details.caller.primaryPhoneNumber}
          </Text>
          {nameAvailable && (
            <PhoneNumberText
              displayStyle={TextDisplayStyle.MediumFadedLightText}
              data-testid="sidebar-phone-number"
            >
              {details.caller.primaryPhoneNumber}
            </PhoneNumberText>
          )}
        </>
      }
      headerRight={icons}
      onClose={onClose}
      appColorSidebarHeader
      padded={false}
    >
      <MessagesWrapper>
        <MessageBubblesWrapper>
          {details.messages.map(
            ({ author, content, interlocutor, id }, index) => {
              const prevMessage = details.messages[index - 1]
              const previousAuthor = prevMessage?.author.id !== author.id
              if (index === details.messages.length - 1) {
                return (
                  <div ref={ref} key={id}>
                    <MessageBubble
                      id={id}
                      user={author}
                      message={content}
                      interlocutor={interlocutor}
                      previousAuthor={previousAuthor}
                    />
                  </div>
                )
              }
              return (
                <MessageBubble
                  key={id}
                  id={id}
                  user={author}
                  message={content}
                  interlocutor={interlocutor}
                  previousAuthor={previousAuthor}
                />
              )
            }
          )}
        </MessageBubblesWrapper>
      </MessagesWrapper>
      <TextareaWrapper>
        <Textarea
          type="textarea"
          value={""}
          onChange={noop}
          leadingIcons={leadingIcons}
          trailingIcons={trailingIcon}
          disabled
          label={intl.formatMessage({
            id: "view.name.messages.textAreaPlaceholder",
          })}
        />
      </TextareaWrapper>
    </MessagesSidebar>
  )
}

export default MessageDetails
