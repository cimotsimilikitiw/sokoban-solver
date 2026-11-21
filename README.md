# sokoban-solver

[![make.fun · sokoban-solver-01-run-20261121](https://make.fun/badge/sokoban-solver-01-run-20261121.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![rank](https://make.fun/badge/sokoban-solver-01-run-20261121/cimotsimilikitiw/sokoban-solver/rank.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![reward](https://make.fun/badge/sokoban-solver-01-run-20261121/cimotsimilikitiw/sokoban-solver/reward.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)

Push-optimal room-decomposed Sokoban solver for the [make.fun](https://make.fun/bounty/sokoban-solver-01-run-20261121) `sokoban-solver-01-run-20261121` bounty.

## Architecture

- **XSB Parser & Writer**: Reads `/input/<id>/level.txt` (or `MAKEFUN_INPUT_DIR`) and writes `/output/<id>/solution.txt` (or `MAKEFUN_OUTPUT_DIR`) using Node 22 built-in `node:fs` only.
- **Room Decomposition**: Partitions the grid across the central hallway into up to 4 rooms, including each room's door cell.
- **Push-Optimal BFS**: Solves each room independently via push-order BFS with reverse-pull live-square pruning (`live`), player reachability canonicalization (`reach`), and a deterministic `250,000` state cap.
- **Hallway Stitching**: Reconstructs shortest walk paths between pushes and across the hallway between rooms.
