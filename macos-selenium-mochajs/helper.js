/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const winston = require('winston');
const {
  install,
  Browser,
  resolveBuildId,
  detectBrowserPlatform,
  ChromeReleaseChannel,
} = require('@puppeteer/browsers');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});

async function setupBrowserVersion(BROWSER_VERSION) {
  const resolvedBrowserVersion =
    BROWSER_VERSION ||
    (await resolveBuildId(
      Browser.CHROME,
      detectBrowserPlatform(),
      ChromeReleaseChannel.CANARY,
    ));

  const cacheDir = path.resolve(__dirname, '.cache');

  logger.debug(`Chrome version: ${resolvedBrowserVersion}`);

  chromeBuild = await install({
    browser: Browser.CHROME,
    buildId: resolvedBrowserVersion,
    cacheDir: cacheDir,
  });

  chromedriverBuild = await install({
    browser: Browser.CHROMEDRIVER,
    buildId: resolvedBrowserVersion,
    cacheDir: cacheDir,
  });

  logger.debug(`Chrome installed at: ${chromeBuild.executablePath}`);
  logger.debug(
    `ChromeDriver installed at: ${chromedriverBuild.executablePath}`,
  );

  return { chromeBuild, chromedriverBuild };
}

module.exports = {
  logger,
  setupBrowserVersion,
};
