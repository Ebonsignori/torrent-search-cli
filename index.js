const _ = require('lodash')
const inquirer = require('inquirer')
const TorrentSearchApi = require('torrent-search-api')
const chalk = require('chalk')
const ora = require('ora')
const clipboardy = require('clipboardy')
const open = require('open')

const config = require('./config')
const utils = require('./utils')

const options = {
  openDefault: config.method.openInDefault,
  clipboard: config.method.clipboard,
  openApp: config.method.openInApp
}

function overWriteOptions (cliOpts) {
  for (const entry of Object.entries(cliOpts)) {
    if (typeof entry[1] !== 'undefined') options[entry[0]] = entry[1]
  }
}

async function wizard (isNext, searchQuery, category, provider, rows, cliOpts) {
  if (cliOpts) overWriteOptions(cliOpts)
  // Ask use if they want to continue if after first iteration
  if (isNext) {
    const choices = ['Yes', 'No']
    const shouldContinuePrompt = await inquirer.prompt({
      type: config.listType,
      name: 'choice',
      message: 'Find another torrent?',
      choices
    })
    if (shouldContinuePrompt.choice === choices[1]) process.exit(0)
  }

  let torrent
  let inquirerResp = await getTorrent(searchQuery, category, provider, rows)
  if (inquirerResp) torrent = inquirerResp.selection
  const magnet = await getMagnet(torrent)
  if (!magnet) return console.error(chalk.red('Magnet not found.'))
  return download(magnet, torrent)
}

async function getTorrents (query, category, provider, providers = config.torrents.providers.available, rows = config.torrents.limit) {
  const hasProvider = !!provider
  if (!provider) {
    provider = await inquirer.prompt({
      type: config.listType,
      name: 'selection',
      message: 'Which torrent provider would you like to start with?',
      choices: providers
    })
    provider = provider.selection
  }

  const spinner = ora(`Waiting for "${chalk.bold(provider)}"...`).start()
  try {
    TorrentSearchApi.disableAllProviders()
    TorrentSearchApi.enableProvider(provider)
    if (!category) category = 'All'
    const torrents = await TorrentSearchApi.search(query, category, rows)
    spinner.stop()
    if (!torrents.length) throw new Error('No torrents found.')
    return torrents
  } catch (e) {
    spinner.stop()
    console.error(chalk.yellow(`No torrents found via "${chalk.bold(provider)}"`))
    const nextProviders = _.without(providers, provider)
    const nextProvider = hasProvider ? providers[providers.indexOf(provider) + 1] : ''
    if (!nextProvider || !nextProviders.length) return []
    return getTorrents(query, category, nextProvider, nextProviders, rows)
  }
}

async function getTorrent (withQuery, category, provider, rows) {
  let searchString = ''
  while (true) {
    if (!withQuery) {
      let query = await inquirer.prompt({
        type: 'input',
        name: 'input',
        message: 'What do you want to download?'
      })
      searchString = query.input
    } else {
      searchString = withQuery
    }
    const torrents = await getTorrents(searchString, category, provider, undefined, rows)
    if (!torrents || !torrents.length) {
      console.error(chalk.yellow(`No torrents found for "${chalk.bold(searchString)}" in category: "${category}", try another query.`))
      withQuery = undefined
      category = undefined
      continue
    }
    return utils.promptTitle('Which torrent?', torrents)
  }
}

async function getMagnet (torrent) {
  try {
    return await TorrentSearchApi.getMagnet(torrent)
  } catch (e) {
    console.error('Unable to get magnet for torrent.')
  }
}

async function download (magnet, torrent) {
  if (options.clipboard) {
    console.log(chalk.bold('Magnet link for ') + chalk.cyan(torrent.title) + chalk.bold(' copied to clipboard.'))
    clipboardy.writeSync(magnet)
  }
  if (options.openApp) {
    await open(magnet, { app: options.openApp })
  } else if (options.openDefault) {
    await open(magnet)
  }
  return wizard(true)
}

module.exports = {
  wizard,
  getTorrent
}
