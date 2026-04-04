print("GLITCH FLOOR SCRIPT STARTED");

// Sprites to flicker between
var glitchSprites = [
    "error",
    "block-dark-metal-full",
    "bubble-11",
    "metal-floor-4-edge",
    "metal-floor-3-edge",
    "metal-floor-2-edge",
    "metal-floor-1-edge"
];

// Use JavaAdapter to avoid adapter/global errors
var GlitchFloor = new JavaAdapter(Floor, {
    draw: function(tile){
        // pick a random sprite each frame
        var region = Core.atlas.find(glitchSprites[Math.floor(Math.random() * glitchSprites.length)]);
        if(region != null){
            Draw.rect(region, tile.worldx(), tile.worldy(), tile.width(), tile.height());
        }
    }
});

// Non-solid floor
GlitchFloor.solid = false;

// Add safely after 1 tick
Time.runTask(1, function(){
    Vars.content.add(GlitchFloor);
    print("Glitch floor loaded :)");
});