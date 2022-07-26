# flumedb-delete

A tool to delete feeds from an SSB pub.

The source code opens two instances of flumedb: `a` and `b`. Each of the
messages are streamed with `a.stream()` and appended to be with `b.append()`
as long as they pass the filter. The filter checks whether the message author
matches the given ID, and only appends messages that do *not* have that author.
Finally, database a is overwritten with database b.

If being used with Scuttlebutt, **this module does not delete blobs**.


## Install

```
git clone git@github.com:fraction/flumedb-delete.git
cd flumedb-delete
nvm use
```

## Usage

**Always backup your db before running**

To delete a feed, first select a valid ssb feed id. Make sure all scuttlebutt 
services are stoped, and run these two commands:

```
node ssb.js --id='feedId' --dir path/to/.ssb
node delete-views --dir path/to/.ssb
```

It can also help to private block a feed, so that it doesn't resync later: 

```
scuttlebot publish --type contact --blocking --recps 'yourId' --contact 'feedId'
```

## Troubleshooting

Because this script rewrites the db it may change the permissions you had set on
your flume directory. If this happens you may see an error like this:

```
node:internal/validators:97
        throw new ERR_INVALID_ARG_TYPE(name, 'number', value);
        ^

TypeError [ERR_INVALID_ARG_TYPE]: The "fd" argument must be of type number. Received undefined
    at Object.close (node:fs:454:8)
    at /home/node/node_modules/aligned-block-file/file.js:33:10
    at FSReqCallback.oncomplete (node:fs:183:23) {
  code: 'ERR_INVALID_ARG_TYPE'
}
```

In this case you need to chown .ssb/flume back to the user who is running ssb-server.

## Maintainers

[@fraction](https://github.com/fraction)

## Contributing

PRs accepted.

## License

MIT © 2022 Verse Communications, Inc.
