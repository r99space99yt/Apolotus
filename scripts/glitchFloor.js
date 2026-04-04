var GlitchFloor = extend(Floor, {});
GlitchFloor.solid = false;
GlitchFloor.frameSpeed = 5; // still tick fast

// Collect all tiny sprites
var tinySprites = [];
Core.atlas.getRegions().each(r => {
    if(r.width <= 32 && r.height <= 32){
        tinySprites.push(r);
    }
});

// Fallback region
GlitchFloor.region = tinySprites.length > 0 ? tinySprites[0] : Core.atlas.find("error");

// Override draw method to pick a random sprite each frame
GlitchFloor.draw = function(tile){
    var region = tinySprites[Math.floor(Math.random() * tinySprites.length)];
    Draw.rect(region, tile.worldx(), tile.worldy());
}

// Register floor
Vars.content.add(GlitchFloor);
print("Random glitch floor loaded with " + tinySprites.length + " tiny sprites :)");