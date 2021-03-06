Darwin Defenders v0.1


This is my entry for Ludum Dare #24.

The theme was evolution, so I made a game where the enemies evolve via genetic algorithm.

You can play the game on my website:
http://hi-scor.es/darwin_defenders/

Please keep in mind that this code was all written in 48 hours. It's not the prettiest, most-efficient, or best-organized -but it's fun.

Highlights:
src/GameScene.js - This one runs the game. In here is where the game starts, waves are created, and players win or die.

src/Body.js - This is the hex body. Contains some collision detection & logic for placing the other parts. Just about everything had to be recursive so that bodies could connect to other bodies.

src/Enemy.js - Enemy class with seek behavior & chromosomes.

src/Chromosome.js - Class representing a complete chromosome string. Each enemy is built from a chromosome. Chromosomes have 6 GeneSegments (1 for each body position), 1 value for the side of the screen to start on, and 1 for the behavior pattern (which is always seek because I ran out of time before I could program more). Chromosomes can cross-breed with one another to form new generations created out crosses of two parents with the possibility of mutation.

src/SegmentGene.js - Represents one segment attached to the enemy body. Segment could be a gun, a triangle shield, nothing, or another hex body. These had to be encapsulated in a class so that attached the hex bodies could store their own segments. While cross-over of the chromosomes occurs only between segments, mutation can extend all through the attached bodies. This means offspring will have basically the same body attachments as their parents, but with possible slight modifications.


Shoutouts:
http://www.ludei.com/tech/caat
http://www.playchilla.com/how-to-check-if-a-point-is-inside-a-hexagon
http://en.wikipedia.org/wiki/Equilateral_triangle
http://www.red3d.com/cwr/steer/gdc99/
http://www.obitko.com/tutorials/genetic-algorithms/

