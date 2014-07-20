# tourney-time

[![Build Status](https://secure.travis-ci.org/duereg/tourney-time.svg?branch=master)](https://travis-ci.org/duereg/tourney-time)
[![Dependency status](https://david-dm.org/duereg/tourney-time.svg)](https://david-dm.org/duereg/tourney-time)
[![devDependency Status](https://david-dm.org/duereg/tourney-time/dev-status.svg)](https://david-dm.org/duereg/tourney-time#info=devDependencies)
[![Coverage Status](https://img.shields.io/coveralls/duereg/tourney-time.svg)](https://coveralls.io/r/duereg/tourney-time)
<!--
[![NPM](https://nodei.co/npm/tourney-time.svg)](https://npmjs.org/package/tourney-time)
 -->
## Installation

    npm install tourney-time

## Usage Example

```shell
  Usage: tourney-time -teams [num] -time [num] -rest [num] -areas [num]

Options:
  --teams  [required]
  --time   [default: 33]
  --rest   [default: 7]
  --areas  [default: 1]
```

```shell
  Example: tourney-time --teams 28 --time 20 --rest 10 --areas 3
```

## Testing

    npm test

## References

[Round Robin Scheduling](http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm)
[Round Robin Cyclic Algorithm](http://www.devenezia.com/javascript/article.php/RoundRobin1.html)
[Round Robin in C](http://www.math.niu.edu/~rusin/known-math/97/roundrobin)
[Swiss System Tournament](http://en.wikipedia.org/wiki/Swiss_system_tournament)
[Static Tournament Implementations](https://github.com/clux/tournament)

## License

The MIT License (MIT)

Copyright 2014 Matt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
