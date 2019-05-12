#!/usr/bin/env node

const index = require('./index')

// CLI entry point
const cli = require('sywac')
  // If only a string is entered, search that string
  .positional('[search]', {
    paramsDesc: 'Name of torrent to search for. If omitted, wizard will prompt for search.'
  })
  // TODO: Include home dir config where defaults can be set
  // If config command is run, change config
  // .command('config <option> <value>', {
  //   desc: 'Change config of specified option',
  //   params: [{
  //     desc: 'Config option to change',
  //     choices: ['openInDefault', 'openInApp', 'copyToClipBoard']
  //   }, {
  //     desc: 'Value to set option to',
  //     choices: ['true', 'false'],
  //     defaultValue: 'true'
  //   }],
  //   setup: sywac => sywac.boolean('-z', { desc: 'This is the z description' }),
  //   run: argv => {
  //     index.changeConfig(argv)
  //   }
  // })
  .style(require('sywac-style-basic'))
  .outputSettings({ maxWidth: 100 })
  .enumeration('-c, --cat, --category', {
    desc: 'Limit torrent search to a category (some providers use different categories)',
    choices: ['All', 'Movies', 'TV', 'Music', 'Games', 'Apps', 'Books', 'Top100'],
    defaultValue: 'All'
  })
  .enumeration('-p, --provider', {
    desc: 'Specify the provider the try first',
    choices: ['1337x', 'ThePirateBay', 'ExtraTorrent', 'Rarbg', 'Torrent9', 'KickassTorrents', 'TorrentProject', 'Torrentz2']
  })
  .number('-r, --rows', {
    desc: 'Number of rows to list in search',
    defaultValue: 30
  })
  // TODO: Remove some of these options in favor of a config.json that lives in home dir
  .boolean('-b, --copy, --clipboard', {
    desc: 'Include to copy the torrent magnet url to your clipboard',
    defaultValue: false
  })
  .boolean('-o, --default, --openDefault', {
    desc: 'Open torrent in default torrent app',
    defaultValue: true
  })
  .string('-a, --app, --openApp', {
    desc: 'Name of app to open torrent in (e.g. "utorrent") (overrides openDefault)'
  })
  .help('-h, --help')
  .version('-v, --version')

async function main () {
  const argv = await cli.parseAndExit()
  const cliOptions = {
    openDefault: argv.openDefault,
    clipboard: argv.clipboard,
    openApp: argv.openApp
  }
  // When nothing is passed in, the wizard will ask the user to search
  index.wizard(false, argv.search, argv.category, argv.provider, argv.rows, cliOptions)
}

if (require.main === module) {
  main()
}
