[![build-test](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml)
[![tag badge](https://img.shields.io/github/v/tag/defi-wonderland/interface-exporter-action)](https://github.com/defi-wonderland/interface-exporter-action/tags)
[![license badge](https://img.shields.io/github/license/defi-wonderland/interface-exporter-action)](./LICENSE)

# Interface Exporter Action

This action generates npm packages based on Solidity contract interfaces. It automates the process of extracting TypeScript interfaces from Solidity contracts and provides compatibility with TypeChain. With support for both web3-v1 and ethers-v6 typings, developers can seamlessly generate typings with only a few lines of yml code.

## Action Inputs

| Input           | Description                                      | Default      | Options                 |
| --------------- | ------------------------------------------------ | ------------ | ----------------------- |
| out_dir         | The path where contracts are build               | **Required** |                         |
| publish_type    | The option to publish                            | **Required** | abi, ethers-v6, web3-v1 |
| package_name    | The name of the package                          | **Required** |                         |
| destination_dir | The path to the directory where will be exported | **Required** |                         |

## Action Outputs

| Output | Description                                    |
| ------ | ---------------------------------------------- |
| passed | Boolean describing if the script passed or not |

# Usage

## Example

Publish an NPM package with your interfaces ABIs:

```yaml
- name: Use Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 16
    registry-url: "https://registry.npmjs.org"

- name: Install dependencies
  run: yarn --frozen-lockfile

- name: Build project and generate out directory
  run: yarn build

- name: Export interfaces for abi compatibility
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: ./out
    publish_type: abi
    package_name: @my-cool-protocol/core-interfaces-abi
    destination_dir: abi-project

- name: Publish
  run: cd abi-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Publish an NPM package with a typechain generated files for ethers compatibility from your interfaces.

```yaml
- name: Use Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 16
    registry-url: "https://registry.npmjs.org"

- name: Install dependencies
  run: yarn --frozen-lockfile

- name: Build project and generate out directory
  run: yarn build

- name: Add typechain to install dependencies
  run: yarn add typechain @typechain/ethers-v6

- name: Export interfaces for ethers compatibility
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: ./out
    publish_type: ethers-v6
    package_name: @my-cool-protocol/core-interfaces-ethers
    destination_dir: ethers-project

- name: Publish
  run: cd ethers-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Publish an NPM package with a typechain generated files for web3 compatibility from your interfaces.

```yaml
- name: Use Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 16
    registry-url: "https://registry.npmjs.org"

- name: Install dependencies
  run: yarn --frozen-lockfile

- name: Build project and generate out directory
  run: yarn build

- name: Add typechain to install dependencies
  run: yarn add typechain @typechain/web3-v1

- name: Export interfaces for web3 compatibility
  uses: defi-wonderland/interface-exporter-action@v1
  with:
    out_dir: ./out
    publish_type: web3-v1
    package_name: @my-cool-protocol/core-interfaces-web3
    destination_dir: web3-project

- name: Publish
  run: cd web3-project && npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

# Development

Install the dependencies

```bash
npm install
```

Build the typescript and package it for distribution

```bash
npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributors

Maintained with love by [Wonderland](https://defi.sucks). Made possible by viewers like you.
