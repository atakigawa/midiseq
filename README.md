MidiSeq
=======

This is an experimental HTML5 Polyrhythmic Midi Pattern generator.

See MidiSeq live at: http://sandbox.dev.chiparus.net/midi/

Watch a live demo: http://www.youtube.com/watch?v=rxanzYEwgJg

Compared to the fork origin:
------

* it does not require Jazz plugin, instead it sends midi message to the server via socket.io
* bunch of refactors, especially structurized using angular

Development
------
prepare
```
$ npm install
$ bower install
```

build once
```
$ gulp build
```

build when any changes are detected to files under assets

```$ gulp```
or
```$ gulp watch```
