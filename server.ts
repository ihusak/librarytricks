/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import 'zone.js/dist/zone-node';

import * as express from 'express';
import {join} from 'path';
import {readFileSync} from 'fs';
const path = require('path');

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.resolve(path.dirname(''));
const indexHtml =
 readFileSync(path.join(DIST_FOLDER, 'browser/index.html')).toString();;
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap, renderModuleFactory} = require('./dist/server/main');
// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
console.log('!!!!__dirname', indexHtml);
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

app.route('*').get((req, res) => {
  console.log('req.url', req.url);
  renderModuleFactory(AppServerModuleNgFactory, {
    document: indexHtml,
    url: req.url
  })
      .then((html) => res.status(200).send(html))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
