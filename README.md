# Mower test

## usage

```js
import { Lawn } from './Lawn';
Lawn.schedule(your_script).run();

```

### events: change, warn

```js
const lawn.schedule(your_script);
lawn.on('change',(evt)=>{
	console.log(evt.mower);
	// you can get curent position
	console.log(evt.mower.getPosition());
	console.log(evt.data);
});
lawn.on('warn',(evt)=>{
	console.log(evt.warning);
	console.log(evt.mower);
});
lawn.run();
```

## how to test

### install dependencies

```shell
# if you use yarn
yarn
# otherwise
npm install
```

### test

```shell
# test code
yarn test

# coverage
yarn coverage
```
