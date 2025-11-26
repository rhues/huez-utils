import Jasmine from 'jasmine';
import config from './jasmine.mjs';
const jasmine = new Jasmine();
jasmine.loadConfig(config);
jasmine.execute();
