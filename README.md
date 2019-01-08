# select

options:
- fields => [{ label: string, value: any}] - fields
- target => string|dom element|jquery element - dropdown would be appended to this element, if select provided, select would be wrapped by dropdown
- dropdownClass => string - custom dropdown wrapper classname
- listClass => string - custom list classname

methods:
- set => (label:string, value:any) => void - Add and after set to active a new field, field with same label would be riwrited.
Could be used just single label or single value in such case it would be seted from the existed options.
- add => (label:string, value:any) => void
- remove => (label:string) => void
- get => () => {label:string, value:any}
- reset => () => void
- start => () => void - start after stop or destroy
- stop => () => void - freeze controller, remove handlers
- destroy => () => void - stoped and after remove DOM elements

events:
- init: 'dropdown:init',
- start: 'dropdown:start',
- stop: 'dropdown:stop',
- destroy: 'dropdown:destroy',
- change: 'dropdown:change',
- listShown: 'dropdown:list:shown',
- listHidden: 'dropdown:list:hidden',


#autocomplete

options:
- data => string | [string] - fields, this option
- getData => () => string | [string] - function could be Promise
- searchInput => string|dom element|jquery element
- minCount => number - minimum string length, that start search

methods:
- set => (val: string) => void
- get => () => string
- reset => () => void
- start => () => void - start after stop or destroy
- stop => () => void - freeze controller, remove handlers
- destroy => () => void - stoped and after remove DOM elements

events:
- init: 'autocomplete:init',
- start: 'autocomplete:start',
- stop: 'autocomplete:stop',
- destroy: 'autocomplete:destroy',
- change: 'autocomplete:change',
- listShown: 'autocomplete:list:shown',
- listHidden: 'autocomplete:list:hidden',

