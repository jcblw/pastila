'use strict'

const Store = require('./store')
const _ = require('lodash')
const GistConstants = require('../constants/gist')
const GistActions = require('../actions/gist')
const AppActions = require('../actions/app')
const {autobind, debounce} = require('core-decorators')

module.exports = class Gist extends Store {

  constructor (options) {
    super(options)
    this.username = options.username
  }

  @autobind
  all (action) {
    const {refresh} = action
    AppActions.loading()
    this.log(`gist::all - getting gist for user ${this.username}`)
    this.request('gists', `/users/${this.username}/gists`, (err, gists) => {
      AppActions.doneLoading()
      if (err) {
        GistActions.error(err)
        return AppActions.notification('failed to update gists list')
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
    AppActions.loading()
    this.request(`gists:${action.id}`, `/gists/${action.id}`, (err, gist) => {
      AppActions.doneLoading()
      if (err) {
        GistActions.error(err)
        return AppActions.notification('failed to load gist')
      }
      GistActions.sendGist(gist)
    })
  }

  @autobind
  remove (action) {
    const {id} = action
    AppActions.loading()
    this.del(`/gists/${id}`, (err) => {
      AppActions.doneLoading()
      if (err) {
        GistActions.error(err)
        return AppActions.notification('failed to remove gist')
      }
      GistActions.all(true) // refresh our list
    })
  }

  @autobind
  create (action) {
    const {gist} = action
    AppActions.loading()
    this.post('/gists', gist, (err, _gist) => {
      AppActions.doneLoading()
      if (err) {
        GistActions.error(err)
        return AppActions.notification('failed to create gist')
      }
      AppActions.notification('gist created!')
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
    AppActions.loading()
    this.isLoading = true;
    this.log(`gist::update - updating gist ${id}`)
    this.patch(`/gists/${id}`, payload, (err, _gist) => {
      this.isLoading = false;
      AppActions.doneLoading()
      if (err) {
        AppActions.notification('failed to update gist')
        return GistActions.error(err)
      }
      if (_gist && _gist.id) {
        AppActions.notification('saved')
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
