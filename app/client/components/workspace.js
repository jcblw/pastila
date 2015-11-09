'use strict'

const React = require('react')
const Editor = require('./editor')
const scrolly = require('./scrolly')
const GistActions = require('../../actions/gist')
const AppActions = require('../../actions/app')
const remote = require('remote')
const shell = remote.require('shell')
const {autobind} = require('core-decorators')
const propTypes = {
  note: React.PropTypes.object,
  style: React.PropTypes.object
}
const defaultProps = {
  style: {}
}

@scrolly({})
class Workspace extends React.Component {

  constructor (options) {
    super(options)
  }

  getContent () {
    if (this.props.note) {
      const fileNames = Object.keys(this.props.note.files)
      const note = this.props.note.files[fileNames[0]]
      AppActions.setTitle(fileNames[0])
      return note.content
    }

    return 'Open a note by clicking a note in the sidebar'
  }

  onScrollToTop (maxTravel) {
    if (maxTravel > 10) {
      console.log('loading top')
      this.setState({loadingTop: true})
    }
  }

  onScrollToBottom (maxTravel) {
    console.log(maxTravel)
  }


  @autobind
  onFileChange (content, id) {
    if (this.props.note) {
      const fileNames = Object.keys(this.props.note.files)
      if (this.props.note.id !== id || this.props.note.files[fileNames[0]].content === content) {
        return
      }
      this.props.note.files[fileNames[0]].content = content
      GistActions.update(this.props.note.id, this.props.note)
    }
  }

  @autobind
  onLinkClick ({token}) {
    shell.openExternal(token.value);
  }

  render () {
    const content = this.getContent()
    const id = this.props.note ? this.props.note.id : 'startup'
    const editor = (
      <Editor
        id={id}
        value={content}
        onChange={this.onFileChange}
        onLoad={this.onFileChange.cancel}
        onLinkClick={this.onLinkClick} />
    )

    return (
      <div className='workspace' style={this.props.style}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec scelerisque tortor. Proin pulvinar sem nunc, eget hendrerit massa placerat ac. Aliquam erat volutpat. Mauris consectetur hendrerit lacus, pretium laoreet felis dapibus sed. Aliquam erat volutpat. Donec cursus dui ante, ut aliquam lectus ornare id. Phasellus eleifend tincidunt metus. Cras placerat mauris lorem, in rhoncus metus molestie cursus. Duis eu erat nibh. In sollicitudin metus at tortor ultricies egestas. In hac habitasse platea dictumst. Praesent tempor non ipsum ut sodales.

Cras sagittis pulvinar leo nec porta. Cras sagittis dolor a justo vulputate, a fringilla lectus sagittis. Donec sit amet tempor nibh. Praesent non cursus nunc. Quisque condimentum efficitur risus ut auctor. Ut gravida lacus lorem, at bibendum elit vehicula eget. Aliquam sodales non risus at volutpat. Vestibulum vel magna ut ante auctor consequat. Vivamus vitae dignissim lectus. Ut placerat leo risus, ut interdum nulla vestibulum quis. Donec enim ex, auctor eu dui at, euismod pharetra arcu. Integer at maximus leo, vitae luctus nisl. Quisque elementum in elit vitae semper. Nulla ultricies lorem porta varius pulvinar.

Suspendisse ac est metus. Etiam cursus a quam et accumsan. Pellentesque vestibulum placerat finibus. Integer interdum congue eros, in gravida urna scelerisque ac. Aliquam diam mi, convallis ac pellentesque varius, pharetra eget turpis. Suspendisse dignissim, augue in porttitor sagittis, eros dolor efficitur velit, in molestie tortor erat vitae diam. Sed varius metus ut nulla porta placerat.

Nam at ultricies enim. Maecenas condimentum sit amet felis eu tempor. Vivamus pretium facilisis feugiat. Nam massa nibh, efficitur vitae egestas at, semper id eros. In consectetur sodales purus a molestie. Proin venenatis ligula eget mauris dictum rutrum eget egestas nisi. Sed finibus sagittis arcu, sed vulputate dolor tincidunt eu. Praesent a ipsum ex. Pellentesque vel tempor augue, in consequat nunc. Aliquam eget ornare nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In pretium odio non ligula hendrerit dictum.

Vivamus luctus ac sem id ultricies. Proin ullamcorper nulla vel sodales scelerisque. Quisque efficitur, eros id efficitur auctor, nisl lorem rutrum velit, quis fringilla ante neque ut dolor. Vestibulum lacinia, sem ut iaculis ornare, purus odio tempor elit, eget mollis urna metus id nibh. Proin sagittis enim tellus, congue viverra velit gravida ac. Curabitur et ipsum a tellus dignissim pulvinar. Ut lorem felis, pulvinar sit amet commodo ut, scelerisque sed velit. Vestibulum enim tortor, pulvinar vel pulvinar a, volutpat nec dui. Vestibulum ut vehicula diam, at molestie felis. Vivamus id feugiat risus, et tristique turpis. Donec non facilisis lacus, non sollicitudin felis. Fusce nulla arcu, convallis sit amet varius a, pulvinar in ex. Nullam in dui at odio facilisis blandit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec scelerisque tortor. Proin pulvinar sem nunc, eget hendrerit massa placerat ac. Aliquam erat volutpat. Mauris consectetur hendrerit lacus, pretium laoreet felis dapibus sed. Aliquam erat volutpat. Donec cursus dui ante, ut aliquam lectus ornare id. Phasellus eleifend tincidunt metus. Cras placerat mauris lorem, in rhoncus metus molestie cursus. Duis eu erat nibh. In sollicitudin metus at tortor ultricies egestas. In hac habitasse platea dictumst. Praesent tempor non ipsum ut sodales.

Cras sagittis pulvinar leo nec porta. Cras sagittis dolor a justo vulputate, a fringilla lectus sagittis. Donec sit amet tempor nibh. Praesent non cursus nunc. Quisque condimentum efficitur risus ut auctor. Ut gravida lacus lorem, at bibendum elit vehicula eget. Aliquam sodales non risus at volutpat. Vestibulum vel magna ut ante auctor consequat. Vivamus vitae dignissim lectus. Ut placerat leo risus, ut interdum nulla vestibulum quis. Donec enim ex, auctor eu dui at, euismod pharetra arcu. Integer at maximus leo, vitae luctus nisl. Quisque elementum in elit vitae semper. Nulla ultricies lorem porta varius pulvinar.

Suspendisse ac est metus. Etiam cursus a quam et accumsan. Pellentesque vestibulum placerat finibus. Integer interdum congue eros, in gravida urna scelerisque ac. Aliquam diam mi, convallis ac pellentesque varius, pharetra eget turpis. Suspendisse dignissim, augue in porttitor sagittis, eros dolor efficitur velit, in molestie tortor erat vitae diam. Sed varius metus ut nulla porta placerat.

Nam at ultricies enim. Maecenas condimentum sit amet felis eu tempor. Vivamus pretium facilisis feugiat. Nam massa nibh, efficitur vitae egestas at, semper id eros. In consectetur sodales purus a molestie. Proin venenatis ligula eget mauris dictum rutrum eget egestas nisi. Sed finibus sagittis arcu, sed vulputate dolor tincidunt eu. Praesent a ipsum ex. Pellentesque vel tempor augue, in consequat nunc. Aliquam eget ornare nunc. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In pretium odio non ligula hendrerit dictum.

Vivamus luctus ac sem id ultricies. Proin ullamcorper nulla vel sodales scelerisque. Quisque efficitur, eros id efficitur auctor, nisl lorem rutrum velit, quis fringilla ante neque ut dolor. Vestibulum lacinia, sem ut iaculis ornare, purus odio tempor elit, eget mollis urna metus id nibh. Proin sagittis enim tellus, congue viverra velit gravida ac. Curabitur et ipsum a tellus dignissim pulvinar. Ut lorem felis, pulvinar sit amet commodo ut, scelerisque sed velit. Vestibulum enim tortor, pulvinar vel pulvinar a, volutpat nec dui. Vestibulum ut vehicula diam, at molestie felis. Vivamus id feugiat risus, et tristique turpis. Donec non facilisis lacus, non sollicitudin felis. Fusce nulla arcu, convallis sit amet varius a, pulvinar in ex. Nullam in dui at odio facilisis blandit.


      </div>
    )
  }
}

Workspace.propTypes = propTypes
Workspace.defaultProps = defaultProps

module.exports = Workspace
