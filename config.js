module.exports = {
  method: {
    clipboard: false, // Copy magnet link to clipboard
    openInApp: false, // Open in utorrent (change this prop with name of default app e.g. 'utorrent')
    openInDefault: true // Open in default browser
  },
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
