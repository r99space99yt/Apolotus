print("GLITCH FLOOR SCRIPT STARTED");

// --- Glitch sprites setup ---
var glitchSprites = [
    "error",
    "block-dark-metal-full",
    "bubble-11",
    "metal-floor-4-edge",
    "metal-floor-3-edge",
    "metal-floor-2-edge",
    "metal-floor-1-edge"
];

// --- Define the Glitch Floor safely ---
var GlitchFloor = extend(Floor, {
    draw: function(tile){
        // Pick a random sprite every frame
        var spriteName = glitchSprites[Math.floor(Math.random() * glitchSprites.length)];
        var region = Core.atlas.find(spriteName);
        if(region != null){
            Draw.rect(region, tile.worldx(), tile.worldy(), tile.width(), tile.height());
        }
    }
});
GlitchFloor.solid = false;

// Add the glitch floor to content after world is loaded
Time.runTask(1, function(){
    Vars.content.add(GlitchFloor);
    print("Glitch floor loaded :)");
});