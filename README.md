# CPAC-Mask
Final Project for Creative Programming II 

For my final project for creative programming II, I knew that I wanted to try a project that combined many of the things I learned this year into one project. This year, I was also a department head for Castle Point Anime Convention (an anime convention by Stevens Institure of Technology students).  Therefore, I decided to combine these two things together, and create a filter for the convention that gived the user the hair of Pinky, one of the con mascots. I also added an interactive loading screen, which incoporates cherry blossoms (a symbol of Japan and also one used often in the convention's imagery this year), as well as elemnts from the convention logo. 

Full Length video of program running: https://youtu.be/TrTRbdNitHc


Clip of Phase 1 of Mask 

https://user-images.githubusercontent.com/84292881/118466484-e5d00480-b6d0-11eb-956f-2a3e55cdb25e.mp4

In this section, I had the screen open with a cherry blossom petal simulation, so they would look like they are blowing in the wind.  I also had the sky a darker shade of blue, that lightens as the circle representing the sun gets higher on the screen. It finally settles to a light shapde of blue.  There is also a ring of rotating cherry blossoms in the middle of the screen. In the center is the name of the convention.


Clip of Phase 2 of Mask 

https://user-images.githubusercontent.com/84292881/118466502-ea94b880-b6d0-11eb-9b4e-80b20e99d313.mp4

After the sun settles in it's place, the con logo appears, as well as a button to click for the filter.  They cherry blossom petals continue to fall, and the flowers keep spinning. There are some interactive elements here.  First, the typography is interactive, and the top and bottom row of text of the convention name each get larger when the mouse hovers over that line (going from pt size 50 to 72). The sun also goes from yellow to scarlet when it is hovered over. Finally, the slighly transparent rectangle button that says "Click here for filter!" gets less transparent when hovered over. Clicking this buttom unlocks the filter. 


Clip of Phase 3 of Mask

https://user-images.githubusercontent.com/84292881/118466519-eec0d600-b6d0-11eb-9842-297fdb6b1776.mp4

In this phase is the actual filter, which places Pinky's hair onto the user.  Blazeface, a lightweight face detection model, is used to place the hair, which is centered on the nose, and resizes based on the width of the face. atan2() is used to calculate the angle between the eyes, to also appropriately rotate the hair image when the head is turned. 


Credits

BlazeFace tenplate by Jeff Thompson 

Jeff on collision detection 
https://www.jeffreythompson.org/collision-detection/point-rect.php

Info on blazeface face detection:
https://github.com/tensorflow/tfjs-models/tree/master/blazeface
https://arxiv.org/abs/1907.05047

Formulas for petal class came from: 
https://editor.p5js.org/abrock/sketches/SyyaEusom

Sakura PNG download: 
https://pngtree.com/so/cherry-blossoms

All other images belong to Castle Point Anime Convention 
