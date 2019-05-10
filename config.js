module.exports = {
  method: {
    clipboard: false, // Copy magnet link to clipboard
    openInApp: false, // Open in utorrent (change openInApp prop with name of default app)
    openInDefault: true // Open in default browser
  },
  openInApp: 'utorrent',
  torrents: {
    limit: 30, // Number of torrents to display
    details: {
      seeders: true,
      leechers: true,
      size: true,
      time: false
    },
    // Select your preferred provider
    providers: {
      available: ['1337x', 'ThePirateBay', 'ExtraTorrent', 'Rarbg', 'Torrent9', 'KickassTorrents', 'TorrentProject', 'Torrentz2'],
      active: '1337x'
    }
  }
}
