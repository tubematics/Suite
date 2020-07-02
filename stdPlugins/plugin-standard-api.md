# plugin-standard-api
The standard api supported by all plugins provides the following interfaces:

| Command | Type | http Call | Returns | Comment|
| --- | --- | --- | --- | --- |
| start | POST | /PluginName/start | json | parameters - see info below|
| getFrame | GET | /PluginName/getFrame | json | ?channel=0|
| getTargets | GET | /PluginName/getTargets | json| |
| getConfig | GET | /PluginName/getConfig | json | |
| saveConfig | POST | /PluginName/saveConfig | json | |
| none | GET | /PluginName | html | documentation |

## Start parameter
The start parameter are passed to the start command as a json object. Typically this object looks as follows:
```
{
  "name": "example name",
  "channel": 0,
  "sequence": "detect",
  "targets": []   # numpy Array (in json format)
}
```

After the plugin has completed it's task the same json object will be returned. After this "round trip" the attribute name is modifed as the parameters are forwarded to the next plugin for processing.