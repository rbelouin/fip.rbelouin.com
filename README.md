fip-client
==========

HTML5 Audio Player for the [FIP radio](http://fipradio.fr), hosted on [fip.rbelouin.com](http://fip.rbelouin.com).

/!\ This player is at its early stage and may not work on all browsers

### Intro

Although I am in love with the FIP radio, I don't really like its web player. I want to build mine, and I want it to:

- be more usable with mobile devices
- keep the song history
- save the songs the user likes

### Contribution

Feel free to send PR if you want to contribute!

Requirements:

- Knowledge about FRP (see [http://baconjs.github.io/tutorials.html](http://baconjs.github.io/tutorials.html) for an intro)
- Basic knowledge about React (see [http://facebook.github.io/react/docs/getting-started.html](http://facebook.github.io/react/docs/getting-started.html) for an intro)
- node >= 5.0.0
- npm >= 3.3.0

##### How to build

```sh
npm install   # Run once, to install dependencies
npm run build # For a single build
npm run watch # For a continuous build
```

##### How to run

```sh
npm start
PORT=8000 npm start # Make the server listen on a custom port
```
