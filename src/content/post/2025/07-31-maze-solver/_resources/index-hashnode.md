## Introduction

Pathfinding is a fundamental topic in computer science, with applications in fields like navigation, AI/ML, network routing, and many others. In this article, we compare four core pathfinding algorithms: breadth-first search (BFS), depth-first search (DFS), Dijkstra’s algorithm, and A\* (A star) through a practical maze-solving example. We don’t just explain them in theory, we built a demo app where you can tweak maze inputs or edit the algorithm code and instantly see how it affects the output and efficiency.

One of the key takeaways is how a tiny change, just a single line in the code can drastically alter an algorithm’s behavior. This highlights how critical implementation details are, even when the overall structure looks the same.

## Problem overview

Paths in a maze form a tree structure or a graph if the maze contains cycles. That's why tree and graph traversal algorithms can be used for finding paths and the shortest path in a maze.

All 4 algorithms differ in just a few lines of code, but their behavior differs dramatically.

## App architecture

We create a pragmatic, simplified OOP model of the maze and its behavior as a tradeoff, favoring clarity and concise instantiation of maze objects in tests.

### Maze representation

A maze is represented as a binary matrix where `0` stands for a free space, `1` for a boundary, and `*` for a path. It also has start and end points. In the sense of a weighted graph `0` cell has zero weight and cell `1` has infinite weight.

```ts
// src/maze.ts

export class Maze implements IMaze {
  private board: number[][];
  private start: Coordinate;
  private end: Coordinate;

  // ...
}

export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

// example maze
const testMaze: number[][] = [
  [0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

const start: Coordinate = { x: 0, y: 0 };
const end: Coordinate = { x: 4, y: 4 };
```

### Class structure

We use polymorphism and a simplified Factory pattern. `MazeSolver` is an abstract class that declares the `findPath()` method, which is implemented in each derived concrete solver class.

```ts
// src/solvers/maze-solver.ts

/**
 * Abstract base class for maze solving algorithms.
 * Implements common functionality for maze solvers.
 */

export abstract class MazeSolver implements IMazeSolver {
  protected maze: IMaze;

  protected abstract findPath(): Coordinate[] | null;

  // ...
}
```

We use encapsulation and coding towards interface, separating interfaces from implementations by exposing only the public class methods through the interfaces.

Maze interface:

```ts
// src/types/maze.ts

export interface IMaze {
  getBoard(): number[][];

  getStart: () => Coordinate;

  formatPath: (path: ReadonlyArray<Coordinate>) => string;

  // ...
}
```

Maze implementation:

```ts
// src/maze.ts

export class Maze implements IMaze {
  public getBoard(): number[][] { ... }

  public getStart(): Coordinate { ... }

  public formatPath(path: ReadonlyArray<Coordinate>): string { ... }

  // ...
}
```

Maze usage:

```ts
// src/main.ts

const _maze2: IMaze = Maze.create(testMaze, start, end);

// ...
```

**Class diagram:**

![Maze solver class diagram](https://cdn.hashnode.com/res/hashnode/image/upload/v1754401301000/426f930b-b17f-4f81-80cb-f680d6e78d50.png align="center")

## Running the app

We install dependencies, run the app, and run the tests as usual, like any other TypeScript app.

```bash
# install dependencies
yarn install

# enable or disable logging in src/config.ts

# run the app in dev mode
yarn dev

# logging is disabled for tests by default

# run tests
yarn test

# run tests in verbose mode
yarn test-verbose

# generate coverage report
yarn coverage
```

We can see that different algorithms require a different number of steps for the same input maze. Example output for a given maze input:

![App dev mode terminal output](https://cdn.hashnode.com/res/hashnode/image/upload/v1754401341001/46a23f34-dbde-41b0-b564-00c5daa899e4.png align="left")

We can run tests that ensure for each algorithm:

1. finds existing path
2. doesn't find a false non existent path
3. finds the shortest path.

![Run tests in verbose mode](https://cdn.hashnode.com/res/hashnode/image/upload/v1754401369305/1646ab42-98a8-4996-a9dd-cc14ad338447.png align="left")

And calculate the code coverage:

![Tests coverage table](https://cdn.hashnode.com/res/hashnode/image/upload/v1754401391410/a90d31fc-5252-41b8-8a09-7d068df311e9.png align="left")

## Algorithms analysis and discussion

Now for the most important and interesting part: let's analyze the algorithm's code and explain how it affects their behavior and efficiency.

### Unweighted graphs

BFS and DFS are basic traversal algorithms that ignore the weights of the edges, so they are applicable only to unweighted graphs.

The actual code for BFS and DFS differs by only a single line, but they exhibit completely opposite behavior. BFS uses a queue (FIFO), while DFS uses a stack (LIFO), and this has a fundamental impact on how the next node candidate for the path is selected.

```ts
// BFS
const { coord, path } = queue.shift()!;

// DFS
const { coord, path } = stack.pop()!;
```

This is the array of coordinates that represents possible directions for movement. This array is iterated over in the algorithm's inner loop.

```ts
// src/utils/constants.ts

export const directions: Direction[] = [
  { x: 0, y: 1 }, // up
  { x: 1, y: 0 }, // right
  { x: 0, y: -1 }, // down
  { x: -1, y: 0 }, // left
];
```

Here is the complete BFS implementation (since all 4 algorithms share most of the same base) so we can have a better idea of what we are working with:

```ts
// src/solvers/maze-solver-bfs.ts

export class MazeSolverBFS extends MazeSolver {
  /**
   * Implements the Breadth-First Search (BFS) algorithm to find a path from the start to the end of the maze.
   */
  protected findPath(): Coordinate[] | null {
    const start = this.maze.getStart();

    // Initialize the BFS queue with the start position.
    const queue: BFSQueueElement[] = [{ coord: start, path: [start] }];

    // Keep track of visited coordinates (as strings).
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      // Count iterations.
      this.incrementStep();

      // The most important line.
      // FIFO - Takes the oldest element in the queue.
      const { coord, path } = queue.shift()!;

      // Check if end and exit.
      if (this.maze.isEnd(coord)) {
        return path;
      }

      // Print the current state of the maze.
      this.printBoard(coord, visited, path);

      // Always loops 4 times.
      for (const direction of directions) {
        // Calculate the next coordinate by applying the direction.
        const nextCoord: Coordinate = {
          x: coord.x + direction.x,
          y: coord.y + direction.y,
        };
        // Create a key for nextCoord (to check for uniqueness in the visited set).
        const coordKey = `${nextCoord.x},${nextCoord.y}`;

        // If nextCoord is not visited, is within bounds, and is walkable, add it to the potential path.
        if (
          !visited.has(coordKey) &&
          this.maze.isWithinBounds(nextCoord) &&
          this.maze.isWalkable(nextCoord)
        ) {
          visited.add(coordKey);
          queue.push({ coord: nextCoord, path: [...path, nextCoord] });
        }
      }
    }

    // Return null if no path to the end is found.
    return null;
  }
}
```

### BFS

Since BFS uses a queue, it respects this structure and attempts to change direction in every iteration of the outer loop. Without obstacles and boundaries, this causes the algorithm to thoroughly inspect nodes closer to the starting node before moving further away. That's why BFS can be inefficient for large trees and graphs where the end node is very distant from the starting node.

### DFS

In contrast, DFS also respects the initial order in the directions array but prioritizes the earlier elements. So, in the example above, it will always attempt to apply the `up` direction first before exploring other directions. Without obstacles and boundaries, this causes the algorithm to inspect distant nodes in a straight line. DFS can be efficient for finding a distant end node but can also be very inefficient for finding a nearby node if it happens to be in a different direction.

### Weighted graphs

Not all graphs have edges with uniform weights. In such cases, we must use algorithms that are aware of weights (the cost between two nodes), such as Dijkstra and A\*.

### Dijkstra

Dijkstra's algorithm is aware of the cost between two nodes (edge weight) and takes it into account when selecting the next node. It uses a priority queue to keep track of the cost history.

```ts
// src/solvers/maze-solver-dijkstra.ts

// Take the first element from the priority queue.
// Choose the node that ads minimal cost.
queue.sort((a, b) => a.cost - b.cost);
const { coord, path, cost } = queue.shift()!;

// ...

// Test how much cost every new node ads to the path before adding it to the queue.
const nextCost = cost + this.maze.getCost(nextCoord);
// ...
if( ... && !costMap.has(coordKey) || nextCost < costMap.get(coordKey)!)
```

Dijkstra keeps a history of the cost of the current path and when selecting the next node chooses the node that adds the minimal cost. If there are cycles it may access the same node from multiple paths and will choose the one with the minimal weight (shortest path). In graphs with constant edge weights it reduces to BFS. This can be observed in the screenshot above, where both BFS and Dijkstra take an equal number of steps because the maze has uniform weights of 1 and Infinity.

### A\*

A\* is the same as Dijkstra but besides keeping the history, it uses a heuristic function to predict the future - the direction in which the end node could be.

```ts
// src/solvers/maze-solver-a-star.ts

protected heuristic(a: Coordinate, b: Coordinate): number {
    // Manhattan distance as the heuristic.
    // Can only move horizontally or vertically, not diagonally. In "rectangles".
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// ...

openSet.sort(
  (a, b) =>
    // The most important line. The only difference from Dijkstra.
    // Cost = history + Manhattan distance from the end node.
    // prettier-ignore
    (a.cost + this.heuristic(a.coord, end)) -
    (b.cost + this.heuristic(b.coord, end))
);
```

If the heuristic function is well chosen it will make A\* more efficient than the before mentioned algorithms. Consequently, if the heuristic function is poorly chosen it will degrade the algorithm efficiency.

## Completed code

- **Maze solver:** https://github.com/nemanjam/maze-solver

## Conclusion

In this example, we can see how algorithm analysis and design is a very sensitive and subtle discipline that leaves no room for low focus or a lack of understanding of the domain. Although BFS, DFS, Dijkstra, and A\* share most of their implementation, even a subtle change in the code can lead to a dramatic change in behavior.

In the demo app, you can tweak the predefined mazes in the `tests/fixtures/*.txt` files and make your own observations. You can also check the resources and interactive playground listed in the [References](#heading-references) section.

Have you experimented with maze-solving and pathfinding algorithms before? Let me know in the comments.

## References

- Some visualized algorithms behavior https://www.youtube.com/watch?v=GC-nBgi9r0U
- BFS vs DFS, basic overview and implementation https://www.geeksforgeeks.org/difference-between-bfs-and-dfs/
- BFS vs Dijkstra for unweighted and weighted graphs https://www.baeldung.com/cs/graph-algorithms-bfs-dijkstra
- BFS vs Dijkstra similarities https://stackoverflow.com/a/52676408/4383275
- Visual playgrounds https://visualmazesolver.vercel.app/, http://qiao.github.io/PathFinding.js/visual/
- Starter project, Typescript, Jest https://github.com/julianmateu/hello-ts
