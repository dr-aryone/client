// @flow
import * as React from 'react'
import * as Types from '../../../../constants/types/chat2'
import * as RPCChatTypes from '../../../../constants/types/rpc-chat-gen'
import * as Kb from '../../../../common-adapters'
import * as Styles from '../../../../styles'
import {imgMaxWidthRaw} from '../../messages/attachment/image/image-render'
import {formatTimeForChat} from '../../../../util/timestamp'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const getDateInfo = thumb => {
  const date = new Date(thumb.ctime)
  return {
    month: monthNames[date.getMonth()],
    year: date.getFullYear(),
  }
}

const formMonths = thumbs => {
  if (thumbs.length === 0) {
    return []
  }
  let curMonth = {
    ...getDateInfo(thumbs[0]),
    data: [],
  }
  const months = thumbs.reduce((l, t, index) => {
    const dateInfo = getDateInfo(t)
    if (dateInfo.month !== curMonth.month || dateInfo.year !== curMonth.year) {
      if (curMonth.data.length > 0) {
        l.push(curMonth)
      }
      curMonth = {
        data: [t],
        month: dateInfo.month,
        year: dateInfo.year,
      }
    } else {
      curMonth.data.push(t)
    }
    if (index === thumbs.length - 1 && curMonth.data.length > 0) {
      l.push(curMonth)
    }
    return l
  }, [])
  return months
}

const createLoadMoreSection = onLoadMore => {
  return {
    data: ['load more'],
    renderItem: () => {
      return (
        !!onLoadMore && (
          <Kb.Button
            type="Default"
            mode="Secondary"
            label="Load more"
            onClick={onLoadMore}
            style={styles.loadMore}
          />
        )
      )
    },
  }
}

type Sizing = {
  marginBottom: number,
  marginLeft: number,
  marginRight: number,
  marginTop: number,
}

type Thumb = {|
  ctime: number,
  height: number,
  isVideo: boolean,
  onClick: () => void,
  previewURL: string,
  width: number,
|}

type MediaThumbProps = {
  thumb: Thumb,
  sizing: Sizing,
}

type MediaThumbState = {
  loading: boolean,
}

class MediaThumb extends React.Component<MediaThumbProps, MediaThumbState> {
  state = {loading: true}
  _setLoaded = () => {
    this.setState({loading: false})
  }
  render() {
    const {sizing, thumb} = this.props
    return (
      <Kb.Box2 direction="vertical" style={styles.thumbContainer}>
        <Kb.ClickableBox onClick={thumb.onClick} style={{...sizing.margins}}>
          <Kb.Image src={thumb.previewURL} style={{...sizing.dims}} onLoad={this._setLoaded} />
        </Kb.ClickableBox>
        {!!thumb.isVideo && (
          <Kb.Box style={styles.durationContainer}>
            <Kb.Icon type="icon-film-64" style={Kb.iconCastPlatformStyles(styles.filmIcon)} />
          </Kb.Box>
        )}
        {this.state.loading && <Kb.ProgressIndicator style={styles.loading} />}
      </Kb.Box2>
    )
  }
}

const rowSize = 4

type MediaProps = {|
  onLoadMore: null | (() => void),
  thumbs: Array<Thumb>,
  status: Types.AttachmentViewStatus,
|}

class MediaView extends React.Component<MediaProps> {
  _clamp = (thumb, maxThumbSize) => {
    return thumb.height > thumb.width
      ? {height: (maxThumbSize * thumb.height) / thumb.width, width: maxThumbSize}
      : {height: maxThumbSize, width: (maxThumbSize * thumb.width) / thumb.height}
  }
  _resize = thumb => {
    const maxThumbSize = Styles.isMobile ? imgMaxWidthRaw() / rowSize : 80
    const dims = this._clamp(thumb, maxThumbSize)
    const marginHeight = dims.height > maxThumbSize ? (dims.height - maxThumbSize) / 2 : 0
    const marginWidth = dims.width > maxThumbSize ? (dims.width - maxThumbSize) / 2 : 0
    return {
      dims,
      margins: {
        marginBottom: -marginHeight,
        marginLeft: -marginWidth,
        marginRight: -marginWidth,
        marginTop: -marginHeight,
      },
    }
  }

  _formRows = thumbs => {
    let row = []
    return thumbs.reduce((l, t, index) => {
      if (index % rowSize === 0) {
        if (row.length > 0) {
          l.push(row)
        }
        row = []
      }
      row.push({
        sizing: this._resize(t),
        thumb: t,
      })
      if (index === thumbs.length - 1 && row.length > 0) {
        l.push(row)
      }
      return l
    }, [])
  }

  _finalizeMonth = month => {
    month.data = this._formRows(month.data)
    return month
  }

  _renderSectionHeader = ({section}) => {
    if (!section.month) {
      return null
    }
    const label = `${section.month} ${section.year}`
    return <Kb.SectionDivider label={label} />
  }
  _renderRow = ({item, index}) => {
    return (
      <Kb.Box2 key={index} direction="horizontal" fullWidth={true}>
        {item.map((cell, index) => {
          return <MediaThumb key={index} sizing={cell.sizing} thumb={cell.thumb} />
        })}
      </Kb.Box2>
    )
  }

  render() {
    const months = formMonths(this.props.media.thumbs).reduce((l, m) => {
      l.push(this._finalizeMonth(m))
      return l
    }, [])
    const sections = months.concat(createLoadMoreSection(this.props.media.onLoadMore))
    return (
      <Kb.Box2 direction="vertical" fullWidth={true} fullHeight={true}>
        <Kb.SectionList
          stickySectionHeadersEnabled={true}
          renderSectionHeader={this._renderSectionHeader}
          keyboardShouldPersistTaps="handled"
          renderItem={this._renderRow}
          sections={sections}
        />
      </Kb.Box2>
    )
  }
}

type Doc = {|
  author: string,
  ctime: number,
  downloading: boolean,
  name: string,
  progress: number,
  onDownload: null | (() => void),
  onShowInFinder: null | (() => void),
|}

type DocProps = {|
  docs: Array<Doc>,
  onLoadMore: null | (() => void),
  status: Types.AttachmentViewStatus,
|}

class DocView extends React.Component<DocProps> {
  _renderSectionHeader = ({section}) => {
    if (!section.month) {
      return null
    }
    const label = `${section.month} ${section.year}`
    return <Kb.SectionDivider label={label} />
  }
  _renderItem = ({item}) => {
    return (
      <Kb.Box2 direction="vertical" fullWidth={true}>
        <Kb.ClickableBox onClick={item.onDownload}>
          <Kb.Box2 direction="horizontal" fullWidth={true} style={styles.docRowContainer} gap="xtiny">
            <Kb.Icon type={'icon-file-32'} style={Kb.iconCastPlatformStyles(styles.docIcon)} />
            <Kb.Box2 direction="vertical">
              <Kb.Text type="BodySemibold">{item.name}</Kb.Text>
              <Kb.Text type="BodySmall">
                Sent by {item.author} • {formatTimeForChat(item.ctime)}
              </Kb.Text>
            </Kb.Box2>
          </Kb.Box2>
        </Kb.ClickableBox>
        {item.downloading && (
          <Kb.Box2 direction="horizontal" style={styles.docBottom} fullWidth={true} gap="tiny">
            <Kb.Text type="BodySmall">Downloading...</Kb.Text>
            <Kb.ProgressBar ratio={item.progress} style={styles.docProgress} />
          </Kb.Box2>
        )}
        {item.onShowInFinder && (
          <Kb.Box2 direction="horizontal" style={styles.docBottom} fullWidth={true}>
            <Kb.Text type="BodySmallPrimaryLink" onClick={item.onShowInFinder}>
              Show in {Styles.fileUIName}
            </Kb.Text>
          </Kb.Box2>
        )}
      </Kb.Box2>
    )
  }
  render() {
    const months = formMonths(this.props.docs.docs)
    const sections = months.concat(createLoadMoreSection(this.props.docs.onLoadMore))
    return (
      <Kb.Box2 direction="vertical" fullWidth={true} fullHeight={true}>
        <Kb.SectionList
          stickySectionHeadersEnabled={true}
          renderSectionHeader={this._renderSectionHeader}
          keyboardShouldPersistTaps="handled"
          renderItem={this._renderItem}
          sections={sections}
        />
      </Kb.Box2>
    )
  }
}

type Link = {|
  author: string,
  ctime: number,
  snippet: string,
  title: string,
  url: string,
|}

type LinkProps = {|
  links: Array<Link>,
  onLoadMore: null | (() => void),
  status: Types.AttachmentViewStatus,
|}

class LinkView extends React.Component<LinkProps> {
  _renderSectionHeader = ({section}) => {
    if (!section.month) {
      return null
    }
    const label = `${section.month} ${section.year}`
    return <Kb.SectionDivider label={label} />
  }
  _renderItem = ({item}) => {
    return (
      <Kb.Box2 direction="vertical" fullWidth={true} style={styles.linkContainer}>
        <Kb.Box2 direction="horizontal" fullWidth={true} gap="tiny">
          <Kb.NameWithIcon avatarSize={32} colorFollowing={true} username={item.author} horizontal={true} />
          <Kb.Text type="BodyTiny" style={styles.linkTime}>
            {formatTimeForChat(item.ctime)}
          </Kb.Text>
        </Kb.Box2>
        <Kb.Text type="BodySmall" lineClamp={2}>
          {item.snippet}
        </Kb.Text>
        <Kb.Text type="BodySmallPrimaryLink" onClickURL={item.url}>
          {item.title}
        </Kb.Text>
        <Kb.Divider />
      </Kb.Box2>
    )
  }
  render() {
    const months = formMonths(this.props.links.links)
    const sections = months.concat(createLoadMoreSection(this.props.links.onLoadMore))
    return (
      <Kb.Box2 direction="vertical" fullWidth={true} fullHeight={true}>
        <Kb.SectionList
          stickySectionHeadersEnabled={true}
          renderSectionHeader={this._renderSectionHeader}
          keyboardShouldPersistTaps="handled"
          renderItem={this._renderItem}
          sections={sections}
        />
      </Kb.Box2>
    )
  }
}

type SelectorProps = {
  selectedView: RPCChatTypes.GalleryItemTyp,
  onSelectView: RPCChatTypes.GalleryItemTyp => void,
}

class AttachmentTypeSelector extends React.Component<SelectorProps> {
  _getBkgColor = typ => {
    return typ === this.props.selectedView
      ? {backgroundColor: Styles.globalColors.blue}
      : {backgroundColor: undefined}
  }
  _getColor = typ => {
    return typ === this.props.selectedView
      ? {color: Styles.globalColors.white}
      : {color: Styles.globalColors.blue}
  }
  render() {
    return (
      <Kb.Box2 direction="horizontal" style={styles.selectorContainer} alignItems="center">
        <Kb.ClickableBox
          onClick={() => this.props.onSelectView(RPCChatTypes.localGalleryItemTyp.media)}
          style={Styles.collapseStyles([
            styles.selectorItemContainer,
            styles.selectorMediaContainer,
            this._getBkgColor(RPCChatTypes.localGalleryItemTyp.media),
          ])}
        >
          <Kb.Text type="BodySemibold" style={this._getColor(RPCChatTypes.localGalleryItemTyp.media)}>
            Media
          </Kb.Text>
        </Kb.ClickableBox>
        <Kb.ClickableBox
          onClick={() => this.props.onSelectView(RPCChatTypes.localGalleryItemTyp.doc)}
          style={Styles.collapseStyles([
            styles.selectorDocContainer,
            styles.selectorItemContainer,
            this._getBkgColor(RPCChatTypes.localGalleryItemTyp.doc),
          ])}
        >
          <Kb.Text type="BodySemibold" style={this._getColor(RPCChatTypes.localGalleryItemTyp.doc)}>
            Docs
          </Kb.Text>
        </Kb.ClickableBox>
        <Kb.ClickableBox
          onClick={() => this.props.onSelectView(RPCChatTypes.localGalleryItemTyp.link)}
          style={Styles.collapseStyles([
            styles.selectorItemContainer,
            styles.selectorLinkContainer,
            this._getBkgColor(RPCChatTypes.localGalleryItemTyp.link),
          ])}
        >
          <Kb.Text type="BodySemibold" style={this._getColor(RPCChatTypes.localGalleryItemTyp.link)}>
            Links
          </Kb.Text>
        </Kb.ClickableBox>
      </Kb.Box2>
    )
  }
}

type Props = {|
  docs: DocProps,
  links: LinkProps,
  media: MediaProps,
  onViewChange: RPCChatTypes.GalleryItemTyp => void,
  selectedView: RPCChatTypes.GalleryItemTyp,
|}

class AttachmentPanel extends React.Component<Props> {
  componentDidMount() {
    this.props.onViewChange(this.props.selectedView)
  }

  _selectView = view => {
    this.props.onViewChange(view)
  }

  render() {
    let content
    switch (this.props.selectedView) {
      case RPCChatTypes.localGalleryItemTyp.media:
        content = <MediaView media={this.props.media} />
        break
      case RPCChatTypes.localGalleryItemTyp.doc:
        content = <DocView docs={this.props.docs} />
        break
      case RPCChatTypes.localGalleryItemTyp.link:
        content = <LinkView links={this.props.links} />
        break
      default:
        return null
    }
    return (
      <Kb.Box2 direction="vertical" fullWidth={true} style={styles.container}>
        <AttachmentTypeSelector selectedView={this.props.selectedView} onSelectView={this._selectView} />
        <Kb.Box2 direction="vertical" fullWidth={true}>
          {content}
        </Kb.Box2>
      </Kb.Box2>
    )
  }
}

const styles = Styles.styleSheetCreate({
  container: {
    flex: 1,
    height: '100%',
  },
  docBottom: {
    padding: Styles.globalMargins.tiny,
  },
  docIcon: {
    height: 32,
  },
  docProgress: {
    alignSelf: 'center',
  },
  docRowContainer: {
    padding: Styles.globalMargins.tiny,
  },
  durationContainer: {
    alignSelf: 'flex-start',
    bottom: Styles.globalMargins.xtiny,
    position: 'absolute',
    right: Styles.globalMargins.xtiny,
  },
  filmIcon: {
    height: 16,
  },
  linkContainer: {
    padding: Styles.globalMargins.tiny,
  },
  linkTime: {
    alignSelf: 'center',
  },
  loadMore: {
    margin: Styles.globalMargins.tiny,
  },
  loading: {
    bottom: '50%',
    left: '50%',
    marginBottom: -12,
    marginLeft: -12,
    marginRight: -12,
    marginTop: -12,
    position: 'absolute',
    right: '50%',
    top: '50%',
    width: 24,
  },
  selectorContainer: {
    flexShrink: 0,
    justifyContent: 'space-between',
    marginBottom: Styles.globalMargins.tiny,
    marginTop: Styles.globalMargins.tiny,
  },
  selectorDocContainer: {
    borderColor: Styles.globalColors.blue,
    borderLeftWidth: 1,
    borderRadius: 0,
    borderRightWidth: 1,
  },
  selectorItemContainer: {
    ...Styles.globalStyles.flexBoxColumn,
    ...Styles.padding(Styles.globalMargins.xtiny, Styles.globalMargins.small),
    borderBottomWidth: 1,
    borderColor: Styles.globalColors.blue,
    borderStyle: 'solid',
    borderTopWidth: 1,
  },
  selectorLinkContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: Styles.borderRadius,
    borderRightWidth: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: Styles.borderRadius,
  },
  selectorMediaContainer: {
    borderBottomLeftRadius: Styles.borderRadius,
    borderBottomRightRadius: 0,
    borderLeftWidth: 1,
    borderTopLeftRadius: Styles.borderRadius,
    borderTopRightRadius: 0,
  },
  thumbContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
})

export default AttachmentPanel
