https://docs.slatejs.org/concepts/05-operations

```js
editor.apply({
  type: 'set_selection',
  properties: {
    anchor: { path: [0, 0], offset: 0 },
  },
  newProperties: {
    anchor: { path: [0, 0], offset: 15 },
  },
})
```


break on selection
```js   
Editor.insertBreak(editor)
```


select whole editor for range, from [Slate slack](https://slate-js.slack.com/archives/C1RH7AXSS/p1581298796206700?thread_ts=1581290922.206500&cid=C1RH7AXSS)
```js
Editor.range(editor, [])
```