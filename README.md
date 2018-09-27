# Eunice [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgElementForYaml/createArrows/testcase.svg?sanitize=true)](Renderer/getSvgElementForYaml/createArrows/testcase.svg)

[![Build Status](https://travis-ci.org/DevSnicket/Eunice.svg?branch=master)](https://travis-ci.org/DevSnicket/Eunice) [![Coverage Status](https://coveralls.io/repos/github/DevSnicket/Eunice/badge.svg?branch=master&c=1)](https://coveralls.io/github/DevSnicket/Eunice?branch=master)

## Premise

Eunice is a system of utilities based on the premise that unidirectional dependencies can be beneficial to structure and modularity in software. Its approach isn't limited to direct dependencies, but includes indirect dependencies as well.

[try out Eunice on Eunice 🐶🥫](https://devsnicket.github.io/Eunice-harnesses/Renderer/harness.html) ([created with](dogfooding/generate.sh))

## Stacks

Part of how Eunince aims to achieve it's premise is by defining stacks. When its indended that an item is to be dependent upon another item, the first item is placed above the second item in a stack. When items are indended to be independent of each other they can be placed at the same level in a stack.

In some programming languages there are implied stacks, such as the order of functions in a file.

## Scale

The approach of defining stacks can be applied at all scales of software and across boundaries, from individual files, functions or classes, to multiple, large codebases in different languages, frameworks and runtimes.

![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/stages%20and%20transitions.svg?sanitize=true)

## YAML

So Euince has composability, for example multiple sources of dependency and structure, a common data format is described using YAML.

``` YAML
- id: item in upper level of stack
  dependsUpon: first item in lower level of stack
  items:
  - id: nested item
    dependsUpon: second item in lower level of stack
-
  - first item in lower level of stack
  - second item in lower level of stack
```

## Analyzers

Analyzers are implemented to create the YAML files, one is currently in development for JavaScript analyzer.

>[try out JavaScript &rightarrow; YAML](https://devsnicket.github.io/Eunice-harnesses/Analyzers/JavaScript/harness.html)

## Processors

YAML files generated by analyzers can then be optionally post-processed which includes combining the output of different analyzers. Currently there are processors written in JavaScript to:
- [group items by their identifier](Processors/groupItemsByIdentifierSeparator)
- order items by
	- [identifier](Processors/orderItemsBy/identifier)
	- index of
		- [identifier suffix](Processors/orderItemsBy/indexOf/identifierSuffix)
		- [type](Processors/orderItemsBy/indexOf/type)
- [remove suffixes from identifiers](Processors/removeIdentifierSuffix)
- [sets the type of root items](Processors/setTypeOfRootItems)
- [stack root items](Processors/stackRootItems)
- [unstack independent items](Processors/unstackIndependent)

Processors can be run from the command line and ([example](dogfooding/generate.sh)) from test harnesses through a [plug-in discovery](https://github.com/DevSnicket/plugin-discovery) system.

## Renderer

To visualise and explorer what's in the YAML files, and to statistically measure how well they match the intended structure, a SVG renderer has been implemented. The renderer doesn't use lines between items to show dependencies and instead marks items with counts for each dependency type:

- matches stack (green down arrow)
- does not match stack (red up arrow) 
- is not independent (red horizontal arrow).

[![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgElementForYaml/createArrows/testcase.svg?sanitize=true)](Renderer/getSvgElementForYaml/createArrows/testcase.svg)

Dependency counts appear for both sides of the dependency, the dependent item and the item depended upon. When there are multiple counts a summary of all counts is rendered at the bottom. <sup>[1]</sup>.

scenario | svg | scenario | svg | scenario | svg
-------- | :-: | -------- | :-: | -------- | :-:
upper depends<br/>upon lower | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/stack/upper-depends-upon-lower/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/stack/upper-depends-upon-lower/.svg) | lower depends<br/>upon upper | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/stack/lower-depends-upon-upper/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/stack/lower-depends-upon-upper/.svg) | interdependent<br/>(stacked) | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/stack/two-interdependent/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/stack/two-interdependent/.svg)
independent | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/two/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/two/.svg) | first depends<br/>upon second | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/independency/first-depends-upon-second/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/independency/first-depends-upon-second/.svg) | interdependent<br/>(not stacked)<sup>[1]</sup> | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/independency/two-interdependent/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/independency/two-interdependent/.svg)

Dependencies within an item are also summarised and rendered inside the item box, below the identifer text.

scenario | svg | scenario | svg | scenario | svg
-------- | :-: | -------- | :-: | -------- | :-:
parent depends<br />upon item | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/parent-depends-upon-item/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/parent-depends-upon-item/.svg) | item depends<br />upon parent | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/item-depends-upon-parent/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/item-depends-upon-parent/.svg) | first item<br/> depends upon<br/>second item<br/>(not stacked) | [![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/testcases/independency/first-item-depends-upon-second-item/.svg?sanitize=true)](Renderer/getSvgForYaml/testcases/independency/first-item-depends-upon-second-item/.svg)

Items and sub-item can also be opened by clicking/tapping on their box. Opening an item will show its contents and breadcrumb links for where it is in the hierarchy.

root > grandparent

[![](https://raw.githubusercontent.com/DevSnicket/Eunice/master/Renderer/getSvgForYaml/withSubset.testcases/upper-item-depends-upon-lower-item-with-parent.svg?sanitize=true)](Renderer/getSvgForYaml/withSubset.testcases/upper-item-depends-upon-lower-item-with-parent.svg) 

>[try out JavaScript &rightarrow; YAML &rightarrow; SVG](https://devsnicket.github.io/Eunice-harnesses/harness.html)
