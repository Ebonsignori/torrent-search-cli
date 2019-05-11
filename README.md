# Torrent Search and Install

A tool that lets you find torrents without leaving your CLI.

## Usage

Install dependencies with `npm install`

Start the CLI tool with `npm start` or as an executable with `./cli.js`

Run `./cli.js -h or npm start -- -h` for options
![Usage -h](./usage.png)

## Example

Try the following command to list 35 results from the `1337x` provider. Select an item from the list to copy your selection's magnet url to your clipboard.
```bash
./cli.js ubuntu -p='1337x' -o=false  --rows=35 --clipboard
```
