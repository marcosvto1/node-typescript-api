import * as path from 'path';
import ModuleAlias from 'module-alias';

// import all files
const files = path.resolve(__dirname, '../..');

ModuleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test')
});