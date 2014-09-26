#phester

A [locomotivejs](http://locomotivejs.org/) concept for a programming testing/exam platform.  Currently it only supports PHP.  Yes, you heard that right. Eventually we're planning on teting it out with docker containers for other language compatibility.

This is a *work in progress* .

## Dependencies
- Redis (for sessions)
- Mysql (for users, exam questions, answers)


## Quick Start

    # Install deps
    $ npm install

    # Make an admin user
    $ node scripts/make_admin.js --username user --password pass --email foo@bar.com

    # Fire up the server!
    $ node server.js

Optionally, define your PHP path

    $ PHP_PATH=/bin/php node server.js

Then, head over to [http://localhost:3000](http://localhost:3000) or just laugh your ass off.


## Credits

  - [Colin Mutter](http://github.com/colinmutter)
  - [Dave McClure](https://github.com/dmcclure)
  - [Kyle Getson](https://github.com/kylegetson)

## License

(The MIT License)

Copyright (c) 2014 Colin Mutter, Kyle Getson, Dave McClure

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.