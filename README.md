AliveCounter
============

A counter app for numerous types of games, MTG, Munchkin and possibly many more...

## Install from source

The following tools are expected to be installed globally:

- [npm](https://npmjs.org/)
- bower, `npm install -g bower`
- jasmine-node, `npm install -g jasmine-node`
- testem, `npm install -g testem`

For copy-pasting pleasure: `npm install -g bower jasmine-node testem`

When global installs are (already) done, the following will suffice:

- `npm install`

*In case of weird errors in node, first attempt to re-install above mentioned tools and try again, if that doesn't help, search the tickets before posting a new one, Thank You!*

## Running from source

As this project in it's current state makes use of XMLHttpRequests it needs to be hosted (or wrapped) in order to run correctly. You will find an example of how to quickly host this project in the bin folder.