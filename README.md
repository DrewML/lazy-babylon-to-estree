# lazy-babylon-to-estree

[![CircleCI](https://circleci.com/gh/DrewML/lazy-babylon-to-estree.svg?style=svg)](https://circleci.com/gh/DrewML/lazy-babylon-to-estree)

WIP: Lazily "convert" a Babylon AST to the ESTree equivalent. Currently only converts `Literal`s.

## Features

* Conversions happen lazily when a property on the AST is accessed
* Original AST is not mutated
* Referential Equality between nodes is maintained (`===`)
* Transformations occur as other code traverses the tree (this module does not perform a separate traversal of the AST)

## Why?

This is an experiment I'm doing with `webpack` and `babel-loader` to try and prevent the double parsing of code, without having to create an entire transformed copy of the AST each time we go from `babel-loader` >> `webpack`. It's possible this will have no positive performance impact (or will even have a negative perf impact), but I'd never know if I didn't write the code 🕺.

## Missing Features/TODO

* `ObjectProperty` and `ObjectMethod` >> `Property`
* `ClassMethod` >> `MethodDefinition`
* Need to see if comments are working at all ¯\_(ツ)\_/¯
