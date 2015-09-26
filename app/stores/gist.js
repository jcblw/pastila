'use strict'

const Store = require('./store')
const _ = require('lodash')
const GistConstants = require('../constants/gist')
const GistActions = require('../actions/gist')

module.exports = class Gist extends Store {

  constructor (options) {
    super(options)
    this.username = options.username
  }

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

  parse (data) {
    if (Array.isArray(data)) {
      return data
        .filter(Gist.markdownOnly)
        .map(Gist.parseResponse)
    }
    return Gist.parseResponse(data)
  }

  get (action) {
    this.log(`gist::get - getting gist ${action.id}`)
    this.request(`gists:${action.id}`, `/gists/${action.id}`, (err, gist) => {
      if (err) {
        return GistActions.error(err)
      }
      GistActions.sendGist(gist)
    })
  }

  remove (action) {
    const {id} = action
    this.del(`/gists/${id}`, (err) => {
      if (err) {
        return GistActions.error(err)
      }
      GistActions.all(true) // refresh our list
    })
  }

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
      [GistConstants.GISTS_ALL]: this.all.bind(this),
      [GistConstants.GIST_GET]: this.get.bind(this),
      [GistConstants.GIST_UPDATE]: this.update.bind(this),
      [GistConstants.GIST_CREATE]: this.create.bind(this),
      [GistConstants.GIST_DELETE]: this.remove.bind(this)
    }
  }

  static markdownOnly (gist) {
    const files = Object.keys(gist.files)
    const file = files[0]
    return file ? !!file.match(/\.md$/) : false
  }

  static parseResponse (resp) {
    return _.pick(resp, 'files', 'id', 'description')
  }
}
