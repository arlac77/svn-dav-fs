import {
  foo
}
from './helpers';
import {
  init as svn
}
from './svn';

let handle = svn('https://subversion.assembla.com/svn/delivery_notes', {
  credentials: {
    user: "arlac77"
  }
});

handle.then(svn => svn.report('https://subversion.assembla.com/svn/delivery_notes', 0, 100)).then(data => {
  console.log(data);
}).catch(e => {
  console.log(`error: ${e}`);
});

let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
