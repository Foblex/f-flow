import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
// import 'dotenv/config';
// import cookieParser from 'cookie-parser';
// import {setupServerRoutes} from "./server/setup-server-routes";

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // server.use(cookieParser());
  // setupServerRoutes(server);

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get(['/docs', '/docs/'], (_req, res) => {
    res.redirect(301, '/docs/intro/');
  });

  server.get(['/examples', '/examples/'], (_req, res) => {
    res.redirect(301, '/examples/overview/');
  });

  const slashCanonicalPrefixes = ['/docs', '/examples'];
  server.use((req, res, next) => {
    const [pathOnly, query = ''] = req.url.split('?', 2);
    const isAsset = /\.[A-Za-z0-9]{1,8}$/.test(pathOnly); // простая проверка "есть расширение"
    const needsPrefix = slashCanonicalPrefixes.some(
      (p) => pathOnly === p || pathOnly.startsWith(p + '/'),
    );

    if (needsPrefix && !isAsset && !pathOnly.endsWith('/')) {
      return res.redirect(301, pathOnly + '/' + (query ? '?' + query : ''));
    }
    next();
  });

  server.get('/:slug', (req, res, next) => {
    const { slug } = req.params;

    if (/\.[A-Za-z0-9]{1,8}$/.test(slug)) return next();

    if (!slug) return next();

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.headers.host}/404`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      })
      .then((html) => res.status(404).send(html))
      .catch((err) => next(err));
  });

  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1d',
      index: 'index.html',
    }),
  );

  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.use((req, res) => {
    res.status(404).send('Page not found');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.use((err: any, req: any, res: any, _next: any): void => {
    console.error('Error occurred:', err.message);
    res.status(500).send('Internal Server Error');
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
