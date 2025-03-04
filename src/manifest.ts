import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description + (isDev ? '(开发版)' : ''),
    homepage_url: 'https://github.com/xlzy520/bilibili-img-uploader',
    browser_action: {
      default_title: '哔哩哔哩图床',
      default_icon: './assets/favicon.png',
      default_popup: './dist/popup/index.html',
    },
    // options_ui: {
    //   page: './dist/options/index.html',
    //   open_in_tab: true,
    //   chrome_style: false,
    // },
    background: {
      page: './dist/background/index.html',
      persistent: false,
    },
    icons: {
      16: './assets/favicon@16.png',
      48: './assets/favicon@48.png',
      64: './assets/favicon@64.png',
      128: './assets/favicon.png',
    },
    permissions: [
      'cookies',
      'http://*.bilibili.com/*',
      'https://*.bilibili.com/*',
    ],
  }

  delete manifest.content_scripts

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`
  }

  return manifest
}
