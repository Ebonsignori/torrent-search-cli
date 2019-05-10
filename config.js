const path = require('path')
const os = require('os')

module.exports = {
  method: {
    clipboard: false,
    openInApp: true,
    openInDefault: false
  },
  openInApp: 'utorrent',
  torrents: {
    limit: 30,
    details: {
      seeders: true,
      leechers: true,
      size: true,
      time: false
    },
    providers: {
      available: ['1337x', 'ThePirateBay', 'ExtraTorrent', 'Rarbg', 'Torrent9', 'KickassTorrents', 'TorrentProject', 'Torrentz2'],
      active: '1337x'
    }
  }
}
