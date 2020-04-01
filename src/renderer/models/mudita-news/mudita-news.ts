import { Dispatch } from "Renderer/store"
import axios from "axios"
import { Entry, Asset } from "contentful"
import {
  NewsEntry,
  NewsImage,
  Store,
} from "Renderer/models/mudita-news/mudita-news.interface"

const initialState: Store = {
  newsIds: [],
  images: {},
  newsItems: {},
  commentsCount: {},
}

export default {
  state: initialState,
  reducers: {
    update(state: Store, payload: NewsEntry[]) {
      const newsIds = payload.map((news: NewsEntry) => news.discussionId)
      const newsItems = payload.reduce(
        (acc: Record<string, NewsEntry>, newsItem: NewsEntry) => {
          acc[newsItem.discussionId] = newsItem
          return acc
        },
        {} as Record<string, NewsEntry>
      )
      return { ...state, newsIds, newsItems }
    },
    updateComments(
      state: Store,
      payload: { discussionId: string; count: number }[]
    ) {
      const counts = payload.reduce((acc, { discussionId, count }) => {
        acc[discussionId] = count
        return acc
      }, {} as Record<string, number>)
      return {
        ...state,
        commentsCount: {
          ...state.commentsCount,
          ...counts,
        },
      }
    },
    updateImages(state: Store, payload: any) {
      const images = payload.reduce(
        (acc: Record<string, string>, { imageId, imageUrl }: NewsImage) => {
          acc[imageId] = imageUrl
          return acc
        },
        {} as Record<string, NewsEntry>
      )
      return { ...state, images }
    },
  },
  effects: (dispatch: Dispatch) => ({
    async loadData() {
      const getCommentsCountByDiscussionId = async (
        discussionId?: string
      ): Promise<{ discussionId?: string; count: number }> => {
        const {
          data: { posts_count },
        } = await axios.get(
          `${process.env.GATSBY_COMMUNITY_URL}/t/${discussionId}.json`
        )
        return { discussionId, count: posts_count }
      }
      try {
        const {
          data: { items, includes },
        } = await axios.get(
          `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=newsItem`
        )
        const news = items.map(({ fields }: Entry<NewsEntry>) => {
          return {
            ...fields,
            imageId: fields?.image?.sys?.id,
          }
        })
        console.log(includes.Asset)
        const images = includes.Asset.map(
          (image: Asset): NewsImage => ({
            imageId: image.sys.id,
            imageUrl: image.fields.file.url,
          })
        )
        dispatch.muditaNews.updateImages(images)
        dispatch.muditaNews.update(news)
        const commentsCalls = news.map(
          ({
            discussionId,
          }: Partial<NewsEntry>): Promise<{
            discussionId?: string
            count: number
          }> => getCommentsCountByDiscussionId(discussionId)
        )
        const commentsCounts: {
          discussionId: string
          count: number
        }[] = await Promise.all(commentsCalls)
        dispatch.muditaNews.updateComments(commentsCounts)
      } catch (error) {
        console.error(error)
      }
    },
  }),
}
