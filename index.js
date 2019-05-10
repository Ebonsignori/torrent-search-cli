const _ = require('lodash')
const inquirer = require('inquirer')
const prompt = require('inquirer-helpers')
const TorrentSearchApi = require('torrent-search-api')
const chalk = require('chalk')
const ora = require('ora')
const clipboardy = require('clipboardy')
const open = require('open')

const config = require('./config')
const utils = require('./utils')

async function wizard (isNext) {
  // Ask use if they want to continue if after first iteration
  if (isNext) {
    const choices = ['Yes', 'No']
    const shouldContinuePrompt = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'Find another torrent?',
      choices
    })
    if (shouldContinuePrompt.choice === choices[1]) process.exit(0)
  }

  const torrent = await getTorrent()
  const magnet = await getMagnet(torrent)
  if (!magnet) return console.error(chalk.red('Magnet not found.'))
  return download(magnet, torrent)
}

async function getTorrents (query, rows = config.torrents.limit, provider = config.torrents.providers.active, providers = config.torrents.providers.available) {
  const hasProvider = !!provider
  if (!provider) {
    provider = await prompt.list('Which torrents provider?', providers)
  }

  const spinner = ora(`Waiting for "${chalk.bold(provider)}"...`).start()
  try {
    TorrentSearchApi.disableAllProviders()
    TorrentSearchApi.enableProvider(provider)
    const torrents = await TorrentSearchApi.search(query, 'All', rows)
    spinner.stop()
    if (!torrents.length) throw new Error('No torrents found.')
    return torrents
  } catch (e) {
    spinner.stop()
    console.error(chalk.yellow(`No torrents found via "${chalk.bold(provider)}"`))
    const nextProviders = _.without(providers, provider)
    const nextProvider = hasProvider ? providers[providers.indexOf(provider) + 1] : ''
    if (!nextProvider && !nextProviders.length) return []
    return getTorrents(query, rows, nextProvider, nextProviders)
  }
}

async function getTorrent () {
  while (true) {
    const query = await prompt.input('What do you want to download?')
    const torrents = await getTorrents(query)
    if (!torrents.length) {
      console.error(chalk.yellow(`No torrents found for "${chalk.bold(query)}", try another query.`))
      continue
    }
    return utils.prompt.title('Which torrent?', torrents)
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
  if (config.method.clipboard) {
    console.log(chalk.bold('Magnet link for ') + chalk.cyan(torrent.title) + chalk.bold(' copied to clipboard.'))
    clipboardy.writeSync(magnet)
  }
  if (config.method.openInApp) {
    await open(magnet, { app: config.openInApp })
  }
  if (config.method.openInDefault) {
    await open(magnet)
  }
  return wizard(true)
}

// Entry Point
wizard()
