'use strict'

const Store = require('./store')
const _ = require('lodash')
const GistConstants = require('../constants/gist')
const GistActions = require('../actions/gist')
const {autobind, debounce} = require('core-decorators')

module.exports = class Gist extends Store {

  constructor (options) {
    super(options)
    this.username = options.username
  }

  @autobind
  all (action) {
    const {refresh} = action
    this.log(`gist::all - getting gist for user ${this.username}`)
    this.request('gists', `/users/${this.username}/gists`, (err, gists) => {
      if (err) {
        return GistActions.error(err)
      }
      GistActions.sendAll(gists)
    }, refresh)
  }

  @autobind
  parse (data) {
    if (Array.isArray(data)) {
      return data
        .filter(Gist.markdownOnly)
        .map(Gist.parseResponse)
    }
    return Gist.parseResponse(data)
  }

  @autobind
  get (action) {
    this.log(`gist::get - getting gist ${action.id}`)
    this.request(`gists:${action.id}`, `/gists/${action.id}`, (err, gist) => {
      if (err) {
        return GistActions.error(err)
      }
      GistActions.sendGist(gist)
    })
  }

  @autobind
  remove (action) {
    const {id} = action
    this.del(`/gists/${id}`, (err) => {
      if (err) {
        return GistActions.error(err)
      }
      GistActions.all(true) // refresh our list
    })
  }

  @autobind
  create (action) {
    const {gist} = action
    this.post('/gists', gist, (err, _gist) => {
      if (err) {
        return GistActions.error(err)
      }
      this.setCache(`gists:${_gist.id}`, _gist)
      GistActions.sendGist(_gist)
      GistActions.all(true)
    })
  }

  updateCache (callback) {
    this.request('gists', `/users/${this.username}/gists`, callback, true)
  }

  @autobind
  @debounce(2000)
  update (action) {
    const {id, gist} = action
    const payload = {
      files: gist.files,
      description: gist.description
    }
    this.log(`gist::update - updating gist ${id}`)
    this.patch(`/gists/${id}`, payload, (err, _gist) => {
      if (err) {
        return GistActions.error(err)
      }
      if (_gist && _gist.id) {
        this.setCache(`gists:${id}`, gist)
      }
      GistActions.updated(gist)
    })
  }

  getEvents () {
    return {
      [GistConstants.GISTS_ALL]: this.all,
      [GistConstants.GIST_GET]: this.get,
      [GistConstants.GIST_UPDATE]: this.update,
      [GistConstants.GIST_CREATE]: this.create,
      [GistConstants.GIST_DELETE]: this.remove
    }
  }

  static markdownOnly (gist) {
    const files = Object.keys(gist.files)
    const file = files[0]
    return file ? !!file.match(/\.md$/) : false
  }

  static parseResponse (resp) {
    return _.pick(resp, 'files', 'id', 'description', 'html_url')
  }
}
