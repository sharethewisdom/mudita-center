import * as React from "react"
import FunctionComponent from "Renderer/types/function-component.interface"
import Card from "Renderer/components/rest/news/card/card.component"
import styled from "styled-components"
import { useEffect } from "react"
import { noop } from "Renderer/utils/noop"
import { NewsEntry } from "Renderer/models/mudita-news/mudita-news.interface"

interface Props {
  newsItems: NewsEntry[]
  commentsCount: Record<string, number>
  loadData?: () => void
}

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4rem;
`

const Cards: FunctionComponent<Props> = ({
  newsItems,
  commentsCount,
  loadData = noop,
}) => {
  useEffect(() => {
    loadData()
  }, [])
  return (
    <CardContainer>
      {newsItems.slice(0, 3).map(newsItem => {
        return (
          <Card
            key={newsItem.newsId}
            title={newsItem.title}
            content={newsItem.content}
            imageSource={newsItem.imageSource}
            communityLink={newsItem.communityLink}
            url={newsItem.link}
            count={commentsCount[newsItem.newsId]}
            imageAlt={newsItem.imageAlt}
          />
        )
      })}
    </CardContainer>
  )
}

export default Cards
