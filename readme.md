## turf-cli

allows you to run turf functions on streaming **line delimited json**

### specifying methods

use `--method`

```sh
turf-cli --method=bboxPolygon
```

accepted method names are any turf module

### methods that take additional parameters

If you want to call a method that requires other parameters, for example, buffer,
use `--args`. `$` is a standin for the streaming line input. Note that the value of `--args` must be quoted if it contains strings or objects.

`cat polygons.json | turf-cli --method=buffer --args='$,10,"miles"'`


### splitting feature collections

If the input contains feature collections, they can be split so that each feature is processed separately using `--splitCollections`. This is useful when piping the input from another task that outputs feature collections (like turf-random does)

```sh
echo '[-122.8,37.2,-121.7,37.9]' | \
  turf-cli --method=random --args='"point",1000,{"bbox":$}' | \
  turf-cli --splitCollections --method=buffer --args='$,100,"miles"'
```

### parallel processing (experimental)

Processing can be done in parallel, using one worker per CPU core via the `-P` flag. Unless you are doing especially heavy operations (such as complex unions, large merges, etc) **this is not advised**, because the cost of sending messages between processes usually outweighs the benefit of processing in parallel.

