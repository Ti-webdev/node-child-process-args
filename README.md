Usage:

```javascript
var spawn = require('child_process').spawn;
var childProcessArgs = require('child-process-args');
childProcessArgs([
  'rsync',
  '-aHC',
  'root@machine2:/remotePath',
  './Local Path',
  '--exclude',
  '/Exclude me/'
  ]).then(function(rsyncCommand){
    var child = spawn('ssh', ['root@machine1', rsyncCommand], { stdio: 'inherit' });
  });
```
