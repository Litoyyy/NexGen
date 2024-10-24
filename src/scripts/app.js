import { accordion } from './modules/base/accordion.js';
import { anchor } from './modules/base/anchor.js';
import { modals } from './modules/base/modals.js';
import { inputs } from './modules/base/inputs.js';
import { filters } from './modules/base/filters.js';
import { pagination } from './modules/base/pagination.js';
import { validation } from './modules/base/validation.js';
import { select } from './modules/base/select.js';

import * as pages from './modules/pages/index.js';

import { checkLoggedIn } from './modules/checkLoggedIn.js';
import { chat } from './modules/chat.js';
import { clientInfo } from './modules/clientInfo.js';
import { managersList } from './modules/managersList.js';
import { clientsList } from './modules/clientsList.js';


accordion();
anchor();
modals();
inputs();
filters();
pagination();
validation();
select();

checkLoggedIn();
chat();
clientInfo();
managersList();
clientsList();