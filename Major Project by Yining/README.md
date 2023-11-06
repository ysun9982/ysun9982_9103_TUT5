# ysun9982_9103_MajorProject

## Artworks: Anwar Jalal Shemza 'Apple Tree'
Our group chose Anwar Jalal Shemza's 'Apple Tree' to reproduce and recreate. We retained the overall layout and structure of the painting, abstracted and flattened the artwork, and preserved its main features while altering and adding details.

## Time-Based: Employ timers and events for animation.
I created a loop animation that simulates the entire day an apple tree goes through, including the four stages of day, dusk, night, and dawn. 

This animation includes:

### 1.Temporal Progress Control: 
The timer serves as a mechanism to track the progression of the animation. As the value of the timer increments, it denotes the passage of time, propelling the day-night cycle of the animation.

### 2.Day-Night Cycle Phases:
The timer's value determines the current phase of the cycle—daytime, dusk, nighttime, or dawn. When the timer reaches specific threshold values, it triggers the transition between these phases.

### 3.Color Transitions:
The value of the timer is employed in interpolation calculations to determine the gradations in background and sky colors, thereby simulating the color transitions seen during sunrise, sunset, and the onset of dawn.

### 4.Twinkling stars:
At night, an additional star animation is played, using a for loop and a random function to simulate the twinkling starry sky.

### 5.Cyclical Continuity:
Upon reaching a designated value, the timer resets, ensuring that the day-night cycle can perpetuate indefinitely, mirroring the continuous diurnal cycle of the real world.