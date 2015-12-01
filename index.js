'use strict'

const os = require('os')
const join = require('path').join

const Node = require('./lib/node')

function tempDir () {
  return join(os.tmpdir(), `ipfs_${(Math.random() + '').substr(2)}`)
}

module.exports = {
  version (done) {
    (new Node()).version(done)
  },
  local (path, done) {
    if (!done) {
      done = path
      path = process.env.IPFS_PATH ||
        join(process.env.HOME ||
             process.env.USERPROFILE, '.ipfs')
    }
    done(null, new Node(path))
  },
  disposableApi (opts, done) {
    if (typeof opts === 'function') {
      done = opts
      opts = {}
    }
    this.disposable(opts, (err, node) => {
      if (err) return done(err)
      node.startDaemon((err, api) => {
        if (err) return done(err)
        done(null, api)
      })
    })
  },
  disposable (opts, done) {
    if (typeof opts === 'function') {
      done = opts
      opts = {}
    }
    opts['Addresses.Swarm'] = ['/ip4/0.0.0.0/tcp/0']
    // opts['Addresses.Gateway'] = ''
    opts['Addresses.API'] = '/ip4/127.0.0.1/tcp/0'
    const node = new Node(tempDir(), opts, true)
    node.init(err => {
      if (err) return done(err)
      done(null, node)
    })
  }
}
