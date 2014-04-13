#Uptick.js

##API

###`Uptick.scene()`

Returns a blank scene.

###`scene.show(canvas)`

Starts showing a scene on the given canvas.

###`scene.pause()`

Stops displaying a scene.

###`scene.reset()`

Resets a scene to its initial state

###Entities

An entity has the following type (using TypeScript-ish notation):

```
type Entity<T> = {
	initial?: T,
	update?: (state: T, sceneState: Object, input: Object) => T,
	draw?: (ctx: CanvasRenderingContext2D, state: T, sceneState: Object) => undefined,
	children?: { [key: string]: Entity<any> |  Entity<any>[] }
	drawOrder?: string[],
	drawChildrenFirst?: boolean,
};
```

So, in English, an entity is an object with some or all of the following properties:

- `initial` (default: `{}`): The initial state of the entity, such as its coordinates or colour. This must be an object. Any state that changes for the entity should be stored here.
- `update` (default: `x => x`): This function, given the previous state of the entity and the scene, should return the next state of the entity. It should not modify any of its arguments. The following arguments are passed to it:
	- `state`: The previous state of the entity, which will either be `initial` or the return value of the previous invocation of `update` merged with the states of the child entities (see `children`).
	- `sceneState`: The state of the scene, which includes the states of all entities defined on the scene.
- `children`: The child entities of this entity, as an object of entity names pointing to either a single entity or an array of entities. Names used here should not be the same as those used in `initial` or in the return value of `update`, as the states of the children will be merged with them to produce the entity's state, as passed to `update` and `draw`.
- `draw` (default: `() => {}`): This function should draw the entity on the given canvas context.
	- TODO: arguments
- `drawOrder` (optional): Since the child entities of an entity are set as an object or array, they will have string keys. If `drawOrder` is defined (as a string array), the child entities of this entity will be drawn in the order of the keys given in it. Otherwise the entities will be drawn in order if they're given as an array, or in an arbitrary order if they're given as an object.
- `drawChildrenFirst` (default `false`): If truthy, the child entities of this entity will be drawn before it. Otherwise, this entity will be drawn first.

###`scene.addEntity(name, entity)`

Adds the entity to the scene with the given name.
