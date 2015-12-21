import {
  foo
}
from './helpers';
import {
  init
}
from './svn';

let s = init('https://subversion.assembla.com/svn/delivery_notes', {
  credentials: {
    user: "arlac77"
  }
});

let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
