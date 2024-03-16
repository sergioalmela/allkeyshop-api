# 1.2.0
- Improve performance and reduce memory usage when searching multiple games at once.
- Dramatic improvement in the search method. From 8 seconds to 0.2
## Breaking changes
- When using the `search` method and no games are found, it will return an object with success: false instead of rejecting the promise.

# 1.1.0

#### Refactor, unit tests and actions
- Refactor the code to make it simpler and more readable. Add unit tests and actions to automate the release process.