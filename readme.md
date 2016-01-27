#### turf-cli

allows you to run turf functions on streaming **line delimited json**

##### specifying methods

use `--method`

```sh
turf-cli --method=bboxPolygon
```

accepted method names are any turf module

##### methods that take additional parameters

If you want to call a method that requires other parameters, for example, buffer, 
use `--parameters`. `$` is a standin for the streaming line input

`cat polygons.json | turf-cli --method=buffer --parameters=$,10,"miles"`